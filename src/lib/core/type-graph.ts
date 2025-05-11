import {
  GraphQLSchema,
  isInterfaceType,
  isObjectType
} from 'graphql';

import type { VoyagerDisplayOptions } from '../components/Voyager';

export class TypeGraph {
  schema: GraphQLSchema;
  rootType: any;
  nodes: Map<string, any>; // Map of type name to type object
  edges: Map<string, any[]>; // Map of source type name to array of edge objects
  displayOptions: VoyagerDisplayOptions;

  constructor(schema: GraphQLSchema, displayOptions: VoyagerDisplayOptions) {
    this.schema = schema;
    this.displayOptions = displayOptions;
    this.nodes = new Map();
    this.edges = new Map();

    // Set root type based on options or default to Query
    if (displayOptions.rootType) {
      this.rootType = schema.getType(displayOptions.rootType);
    } else {
      this.rootType = schema.getQueryType();
    }

    if (!this.rootType) {
      throw new Error("Root type not found in schema");
    }

    // Build the graph
    this.buildGraph();
  }

  private buildGraph() {
    const typeMap = this.schema.getTypeMap();
    
    // Add nodes (types) to the graph
    for (const typeName in typeMap) {
      const type = typeMap[typeName];
      
      // Skip built-in types and hidden root if configured
      if (
        typeName.startsWith('__') || 
        (this.displayOptions.hideRoot && typeName === this.rootType.name)
      ) {
        continue;
      }
      
      // Skip relay types if configured
      if (this.displayOptions.skipRelay && 
          (typeName.endsWith('Connection') || 
           typeName.endsWith('Edge') || 
           typeName === 'PageInfo')) {
        continue;
      }
      
      // Add the node
      this.nodes.set(typeName, type);
    }
    
    // Add edges (field relationships between types)
    for (const [typeName, type] of this.nodes.entries()) {
      if (isObjectType(type) || isInterfaceType(type)) {
        this.edges.set(typeName, []);
        
        const fields = type.getFields();
        for (const fieldName in fields) {
          const field = fields[fieldName];
          
          // Skip deprecated fields if configured
          if (this.displayOptions.skipDeprecated && field.deprecationReason) {
            continue;
          }
          
          // Add edge to the list
          this.edges.get(typeName)?.push({
            sourceType: type,
            targetType: field.type,
            fieldName: fieldName
          });
        }
      }
    }
  }
  
  // Get connected types of a specific type
  getConnectedTypes(typeName: string): any[] {
    const connectedTypes: any[] = [];
    const edges = this.edges.get(typeName) || [];
    
    for (const edge of edges) {
      const namedType = this.getNamedType(edge.targetType);
      if (!connectedTypes.includes(namedType)) {
        connectedTypes.push(namedType);
      }
    }
    
    return connectedTypes;
  }
  
  // Helper to get the named type from a wrapped type
  private getNamedType(type: any): any {
    if (type.ofType) {
      return this.getNamedType(type.ofType);
    }
    return type;
  }
} 