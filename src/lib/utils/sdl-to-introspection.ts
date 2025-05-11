import type { IntrospectionQuery } from 'graphql';
import {
  buildSchema,
  GraphQLSchema,
  introspectionFromSchema,
} from 'graphql';

/**
 * Converts a GraphQL SDL (Schema Definition Language) string to an introspection result
 * 
 * @param sdl The GraphQL schema in SDL format
 * @returns Introspection result that can be used with GraphQL Voyager
 */
export function sdlToIntrospection(sdl: string): IntrospectionQuery {
  try {
    // Build schema from SDL
    const schema: GraphQLSchema = buildSchema(sdl);
    
    // Convert schema to introspection
    return introspectionFromSchema(schema);
  } catch (error) {
    console.error('Error converting SDL to introspection:', error);
    throw error;
  }
} 