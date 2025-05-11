# GraphQL Voyager - Project Structure and Functionality

## Overview

GraphQL Voyager is a visualization tool that represents any GraphQL API as an interactive graph. It allows users to explore GraphQL schemas by displaying them as a navigable graph, making it easier to understand the relationships between types, fields, and how the data model is structured. The tool is built with React and leverages GraphViz for rendering the graph visualization.

## Core Architecture

The project follows a modular architecture divided into several key components:

### Main Components

1. **Voyager Component**: The main React component that orchestrates the entire application.
2. **GraphViewport**: Handles the display and interaction with the rendered graph.
3. **DocExplorer**: Provides detailed information about types and fields in a side panel.
4. **SVG Renderer**: Converts the GraphQL schema into an SVG graph using GraphViz.
5. **Web Worker**: Offloads the heavy GraphViz rendering process to a separate thread.

### Data Flow

1. GraphQL schema is provided via introspection or direct schema input
2. The schema is processed and converted to a type graph
3. The type graph is converted to DOT language for GraphViz
4. GraphViz renders the DOT code to SVG via a web worker
5. The SVG is enhanced with interactive features
6. The result is displayed in the viewport for user interaction

## Detailed Component Breakdown

### Voyager Component (`src/components/Voyager.tsx`)

The main component that serves as the entry point. It:

- Manages the overall application state
- Handles schema introspection
- Controls the display options (skip relay, show leaf fields, etc.)
- Orchestrates the sidebar panel and the graph viewport
- Manages selections of types and edges

### GraphViewport (`src/components/GraphViewport.tsx`)

Responsible for displaying the rendered graph and handling user interactions:

- Renders the SVG graph
- Provides zoom and pan controls
- Handles node and edge selection
- Manages the viewport state and updates

### Viewport (`src/graph/viewport.ts`)

The core class that handles SVG manipulation:

- Initializes the SVG pan-zoom functionality
- Binds click and hover events to graph elements
- Handles focusing on specific nodes
- Manages selection states and highlighting
- Controls zoom and pan animations

### Type Graph Generation (`src/graph/type-graph.ts`)

Processes the GraphQL schema to create a graph representation:

- Filters types based on display options
- Builds node and edge relationships
- Handles special cases like Relay connections

### DOT Generation (`src/graph/dot.ts`)

Converts the type graph to DOT language for GraphViz:

- Creates a DOT representation of the graph
- Formats node labels and styling
- Defines edge connections and types
- Handles different GraphQL type representations

### SVG Renderer (`src/graph/svg-renderer.ts`)

Processes the raw SVG output from GraphViz:

- Renders the DOT representation using GraphViz
- Enhances the SVG with interactive elements
- Adds custom icons and styling
- Optimizes the SVG for better user interaction

### Web Worker Implementation

A critical part of the architecture that offloads heavy processing:

- `worker/viz.cpp`: C++ implementation using Emscripten to compile GraphViz to WebAssembly
- `worker/post.js`: JavaScript bridge for the worker
- `worker/bundle.js`: Script that bundles the worker code
- `src/graph/graphviz-worker.ts`: TypeScript interface to the worker

### Introspection Handling (`src/introspection/introspection.ts`)

Processes GraphQL schemas:

- Handles schema introspection
- Implements options like skipping Relay types
- Processes deprecated fields based on display options
- Sorts and formats schema for visualization

### DocExplorer (`src/components/doc-explorer/DocExplorer.tsx`)

Provides documentation and details for selected types:

- Shows detailed type information
- Displays field lists and their types
- Shows relationships between types
- Provides navigation through the schema

## Build System Architecture

### Webpack Configuration

The project uses webpack for bundling with two separate configurations:

1. **Library Build (`voyager.lib.js`)**: 
   - Externalized dependencies (react, graphql, etc.)
   - Intended for use as an npm package
   - Entry point is `src/index.ts`
   - Outputs CommonJS module format

2. **Standalone Build (`voyager.standalone.js`)**: 
   - Includes all dependencies
   - Ready for direct browser use via CDN or script tag
   - Entry point is `src/standalone.ts`
   - Minified for production use
   - Used by the middleware implementations

### Asset Handling

- CSS is extracted and bundled with MiniCssExtractPlugin
- SVGs are processed in two ways:
  - As React components via SVGR for UI elements
  - As raw strings for the GraphViz rendering
- PostCSS is used for CSS processing with features like:
  - CSS variables
  - CSS imports
  - CSS Next features

### Worker Build Process

The worker that runs GraphViz is built through a complex Docker-based process:

1. A Docker container with Emscripten is used to compile C++ code to WebAssembly
2. The build includes:
   - GraphViz library (version 8.0.1)
   - Expat XML parser (version 2.5.0)
   - C++ wrapper for GraphViz functionality (`worker/viz.cpp`) 
3. The resulting WASM is converted to a JavaScript file with embedded WASM
4. The worker is bundled with `worker/bundle.js` and output to `worker-dist/voyager.worker.js`
5. The worker build must be completed before the main webpack build

### Build Scripts

Key build scripts defined in `package.json`:

- `build:worker`: Builds the GraphViz WebAssembly worker using Docker
- `bundle`: Uses webpack to create the library and standalone bundles
- `compile:middleware`: TypeScript compilation for server middleware
- `declarations`: Generates TypeScript declarations
- `build:release`: Complete build process for publishing
- `build:demo`: Builds everything and prepares demo distribution

### Docker Integration

Docker is used for various aspects of the build:

- `worker/Dockerfile`: Configures Emscripten environment for the worker build
- `docker-compose.yml`: Defines services for:
  - Building the worker
  - Serving example applications
  - Running tests with Playwright

### Middleware Build Process

The middleware is built separately from the main application:

- Uses TypeScript compiler directly (not webpack)
- TypeScript Declaration files are generated
- The output is placed in a separate `middleware` directory
- Includes server implementations for Express, Hapi, and Koa

## Tech Stack

- **Frontend**: React, Material UI
- **Graph Visualization**: GraphViz via WebAssembly
- **Build Tools**: Webpack, TypeScript, Docker, Emscripten
- **CSS Processing**: PostCSS, CSS modules
- **Worker Technology**: Emscripten, WebAssembly
- **Testing**: Playwright
- **Code Quality**: ESLint, Prettier, CSpell

## Key Features

- Interactive graph visualization of GraphQL schema
- Zoom and pan capabilities
- Type and field exploration
- Skip Relay option to simplify complex schemas
- Option to hide deprecated fields
- Ability to choose any type as the root
- Quick navigation between related types
- Middleware for easy server integration

## Integration Methods

1. **Standalone UI**: Can be used directly in a web page
2. **React Component**: Can be integrated into React applications
3. **Server Middleware**: Can be added to GraphQL API servers
4. **Docker Container**: Can be run as a standalone service

## Dependencies

### Production Dependencies
- Material UI components and styling
- Commonmark for markdown rendering
- SVG-Pan-Zoom for interactive graph navigation

### Peer Dependencies
- React (>=18.0.0)
- GraphQL (>=16.5.0)

### Development Dependencies
- Webpack and related plugins
- TypeScript and type definitions
- PostCSS and loaders
- Testing utilities (Playwright)
- Code quality tools (ESLint, Prettier)

This documentation represents the core structure and functionality of the GraphQL Voyager project, highlighting its modular architecture and the key components that enable its visualization capabilities.
