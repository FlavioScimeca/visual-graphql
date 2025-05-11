import {
  buildClientSchema,
  buildSchema,
  GraphQLSchema,
  lexicographicSortSchema
} from 'graphql';
import type { VoyagerDisplayOptions } from '../components/Voyager';
import { transformSchema } from '../utils/transformSchema';

// Convert introspection data to GraphQLSchema
export async function getSchema(
  introspection: any, 
  displayOptions: VoyagerDisplayOptions
): Promise<GraphQLSchema> {
  try {
    let schema;
    
    // Sanitize the introspection data to ensure it's in the right format
    let schemaData = introspection;
    
    // Handle different formats of introspection data
    if (typeof introspection === 'string') {
      // If it's SDL (String)
      schema = buildSchema(introspection);
      return applyTransformations(schema, displayOptions);
    } 
    
    // If it's JSON, ensure it has proper structure
    if (introspection.data && introspection.data.__schema) {
      // If it's wrapped in a data property (from GraphQL response)
      schemaData = introspection.data;
    } else if (introspection.__schema) {
      // If it's a direct introspection result
      schemaData = introspection;
    }
    
    // Ensure the schema has all required parts
    if (!schemaData.__schema) {
      throw new Error('Invalid introspection data: missing __schema property');
    }
    
    // Ensure we have queryType defined
    if (!schemaData.__schema.queryType) {
      throw new Error('Invalid schema: missing queryType definition');
    }
    
    // Validate types array exists
    if (!schemaData.__schema.types || !Array.isArray(schemaData.__schema.types)) {
      throw new Error('Invalid schema: missing or invalid types array');
    }
    
    // Check if required scalar types exist
    const requiredScalars = ['String', 'Int', 'Float', 'Boolean', 'ID'];
    const definedScalars = schemaData.__schema.types
      .filter((type: any) => type.kind === 'SCALAR')
      .map((type: any) => type.name);
    
    const missingScalars = requiredScalars.filter(scalar => !definedScalars.includes(scalar));
    
    // If any scalars are missing, report the issue
    if (missingScalars.length > 0) {
      console.warn(`Missing required scalar types: ${missingScalars.join(', ')}`);
    }
    
    try {
      // Try to build the client schema
      schema = buildClientSchema(schemaData);
      return applyTransformations(schema, displayOptions);
    } catch (schemaError) {
      console.error('Error building client schema:', schemaError);
      throw schemaError;
    }
  } catch (error) {
    console.error('Error processing schema:', error);
    throw error;
  }
}

function applyTransformations(
  schema: GraphQLSchema,
  displayOptions: VoyagerDisplayOptions
): GraphQLSchema {
  let transformedSchema = schema;
  
  // Apply transformations in sequence
  const transforms = [];
  
  // Skip relay types
  if (displayOptions.skipRelay !== false) {
    transforms.push(removeRelayTypes);
  }
  
  // Skip deprecated fields
  if (displayOptions.skipDeprecated !== false) {
    transforms.push(removeDeprecatedFields);
  }
  
  // Sort schema
  if (displayOptions.sortByAlphabet === true) {
    transformedSchema = lexicographicSortSchema(transformedSchema);
  }
  
  // Apply all transforms
  if (transforms.length > 0) {
    transformedSchema = transformSchema(transformedSchema, transforms);
  }
  
  return transformedSchema;
}

// Transform function to remove Relay-specific types
function removeRelayTypes(type: any): any {
  // Implementation would filter out Relay connection types
  // This is a simplified version - the full implementation would be more complex
  if (type && type.name) {
    // Skip connection types
    if (
      /.Connection$/.test(type.name) ||
      /.Edge$/.test(type.name) ||
      type.name === 'PageInfo' ||
      type.name === 'Node'
    ) {
      return null;
    }
  }
  
  return type;
}

// Transform function to remove deprecated fields
function removeDeprecatedFields(type: any): any {
  // This is a simplified version - would need more logic for a complete implementation
  if (type && type.getFields) {
    try {
      const fields = type.getFields();
      
      // Check if all fields are deprecated
      const allFieldsDeprecated = Object.values(fields).every(
        (field: any) => field.deprecationReason != null
      );
      
      // If all fields are deprecated and we're removing deprecated fields, 
      // remove the entire type
      if (allFieldsDeprecated) {
        return null;
      }
    } catch (e) {
      // Ignore errors when getting fields
    }
  }
  
  return type;
} 