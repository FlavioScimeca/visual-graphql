// Convert a type name to a valid DOM ID
export function typeNameToId(typeName: string): string {
  // Ensure the ID is DOM-safe by removing special characters
  return `TYPE-${typeName.replace(/[^_a-zA-Z0-9]/g, '_')}`;
}

// Extract type name from a wrapped type string
export function extractTypeName(typeStr: string): string {
  return typeStr.replace(/[\[\]!]/g, '').trim();
}

// Extract field name from a field string
export function fieldNameToId(fieldName: string): string {
  return `FIELD_${fieldName.replace(/[^\w]/g, '_')}`;
}

// Convert object to ID
export function typeObjToId(typeObj: any): string {
  return typeNameToId(typeObj.name);
}

// Generate edge ID
export function generateEdgeId(fromId: string, toId: string): string {
  return `${fromId}->${toId}`;
}

// Map fields for a given type object
export function mapFields(
  typeObj: any,
  callback: (id: string, field: any) => string | null
): string[] {
  if (!typeObj.getFields) {
    return [];
  }

  try {
    const fields = typeObj.getFields();
    const results: string[] = [];

    for (const fieldName in fields) {
      const field = fields[fieldName];
      const fieldId = `FIELD::${typeObj.name}::${fieldName}`;
      const result = callback(fieldId, field);
      
      if (result) {
        results.push(result);
      }
    }

    return results;
  } catch (error) {
    console.error(`Error mapping fields for ${typeObj.name}:`, error);
    return [];
  }
}

// Map union types
export function mapPossibleTypes(
  typeObj: any,
  callback: (id: string, type: any) => string | null
): string[] {
  if (!typeObj.getTypes || typeof typeObj.getTypes !== 'function') {
    return [];
  }

  try {
    const types = typeObj.getTypes();
    const results: string[] = [];

    for (const possibleType of types) {
      const typeId = `POSSIBLE_TYPE::${typeObj.name}::${possibleType.name}`;
      const result = callback(typeId, possibleType);
      
      if (result) {
        results.push(result);
      }
    }

    return results;
  } catch (error) {
    console.error(`Error mapping possible types for ${typeObj.name}:`, error);
    return [];
  }
}

// Map derived types
export function mapDerivedTypes(
  schema: any,
  typeObj: any,
  callback: (id: string, type: any) => string | null
): string[] {
  if (!schema.getImplementations || typeof schema.getImplementations !== 'function') {
    return [];
  }

  try {
    const implementations = schema.getImplementations(typeObj);
    const results: string[] = [];

    if (implementations) {
      for (const impl of [...(implementations.interfaces || []), ...(implementations.objects || [])]) {
        const typeId = `DERIVED_TYPE::${typeObj.name}::${impl.name}`;
        const result = callback(typeId, impl);
        
        if (result) {
          results.push(result);
        }
      }
    }

    return results;
  } catch (error) {
    console.error(`Error mapping derived types for ${typeObj.name}:`, error);
    return [];
  }
}

// Get the underlying named type from a wrapped type (e.g., [Type!]! -> Type)
export function getNamedType(type: any): any {
  if (type.ofType) {
    return getNamedType(type.ofType);
  }
  return type;
}

// Stringify a type, including wrappers like non-null and list
export function stringifyType(type: any): string {
  if (type.kind === 'NON_NULL') {
    return `${stringifyType(type.ofType)}!`;
  }
  if (type.kind === 'LIST') {
    return `[${stringifyType(type.ofType)}]`;
  }
  return type.name;
}

// Check if a type is a leaf type (scalar or enum)
export function isLeafType(type: any): boolean {
  return type.kind === 'SCALAR' || type.kind === 'ENUM';
}

// Format GraphQL description text
export function formatDescription(description: string | null | undefined): string {
  if (!description) return '';
  return description
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
} 