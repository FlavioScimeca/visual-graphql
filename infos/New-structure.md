# GraphQL Voyager - Refactored Structure

## Package Size Reduction Goals

The original GraphQL Voyager package size is 7.4MB, which is excessive for an npm package. Our target is to reduce this to **under 200KB**, representing a ~97% reduction in package size.

## Technology Stack Replacement

| Original | Replacement | Reasoning |
|----------|-------------|-----------|
| React + Material UI | Solid.js | ~97% smaller (4KB vs React's ~130KB), with React-like syntax |
| Webpack | Vite | Faster, more modern, better tree-shaking, smaller output |
| Docker + Emscripten | WebAssembly directly | Remove Docker dependency, simplify build process |
| GraphViz (C++ compiled) | ts-graphviz | Lightweight TypeScript implementation (77.3KB), no WASM needed |
| Custom SVG manipulation | Solid.js reactivity | Use native framework features for UI updates |
| Multiple bundle formats | Single ESM format | Modern JS modules are supported by all target environments |

## Core Components to Keep

1. **Type Graph Generation Logic**: The core functionality that processes GraphQL schemas
2. **Schema Introspection**: Essential for analyzing GraphQL APIs
3. **Interactive Graph UI**: The main value proposition of the tool
4. **Display Options**: Features like "Skip Relay" that improve usability

## Components to Eliminate

1. **Docker-based Build**: Replace with direct WebAssembly compilation or pure JS
2. **Material UI**: Replace with lightweight CSS and minimal DOM manipulation
3. **Complex Worker System**: Simplify with direct rendering or lighter worker approach
4. **Multiple Build Outputs**: Focus on a single modern ESM bundle
5. **Elaborate Testing Framework**: Implement essential testing only
6. **Heavy CSS Processing**: Use modern CSS features natively supported

## Refactoring Approach

### 1. GraphViz Replacement with ts-graphviz

We'll use [ts-graphviz](https://www.npmjs.com/package/ts-graphviz) (77.3KB) as our graph rendering engine:

- **TypeScript-native**: Built from the ground up for TypeScript
- **No WebAssembly needed**: Pure TypeScript/JavaScript implementation
- **Declarative API**: Supports both object-oriented and declarative styles
  ```typescript
  import { digraph, toDot } from 'ts-graphviz';
  
  const graph = digraph('G', (g) => {
    const queryType = g.node('Query');
    const userType = g.node('User');
    g.edge([queryType, userType]);
  });
  
  const dot = toDot(graph);
  ```
- **Customizable**: Allows extension through custom classes
- **Tiny footprint**: At 77.3KB, it's dramatically smaller than the C++ GraphViz compilation

### 2. UI Framework with shadcn Integration

- Replace React + Material UI with Solid.js as the core framework
- Use [shadcn/ui](https://ui.shadcn.com/) principles for component design:
  - **Copy-paste components**: Only include the components we need
  - **Zero runtime dependencies**: No package installation required
  - **Styled with Tailwind CSS**: Minimal CSS footprint with utility classes
  - **Themeable and customizable**: Dark mode support built-in

For our implementation:
- Create a minimal set of shadcn-inspired components:
  - Table component for type details
  - Tabs for navigation
  - Dialog for settings
  - Dropdown for type selection
- Adapt shadcn's component designs to work with Solid.js
- Use only the necessary utility classes to keep bundle size minimal

```typescript
// Example of a shadcn-inspired table component in Solid.js
const TypeTable = (props) => {
  return (
    <div class="rounded-md border">
      <table class="w-full caption-bottom text-sm">
        <thead>
          <tr class="border-b bg-muted/50">
            <th class="h-10 px-4 text-left align-middle font-medium">Name</th>
            <th class="h-10 px-4 text-left align-middle font-medium">Type</th>
          </tr>
        </thead>
        <tbody>
          <For each={props.fields}>{(field) => (
            <tr class="border-b transition-colors hover:bg-muted/50">
              <td class="p-4 align-middle">{field.name}</td>
              <td class="p-4 align-middle">{field.type}</td>
            </tr>
          )}</For>
        </tbody>
      </table>
    </div>
  );
};
```

### 3. Build System

- Vite for modern, efficient bundling
- ESM-only output to leverage tree-shaking
- Direct TypeScript compilation
- No separate worker build process

### 4. Worker Strategy

Since ts-graphviz is a lightweight TypeScript library, we can eliminate the worker entirely for most use cases. For very large schemas:

- **Dynamic import**: Load ts-graphviz only when needed
- **Micro-task scheduling**: Process large graphs in chunks for UI responsiveness
- **Virtualization**: Only render visible portions of large graphs

### 5. Package Structure

```
/src
  /core
    - type-graph.ts       # Core schema processing
    - introspection.ts    # Schema introspection
  /layout
    - engine.ts           # Graph layout adapter for ts-graphviz
    - dot-generator.ts    # GraphQL to DOT conversion
  /components
    - Voyager.tsx         # Main component
    - GraphView.tsx       # Graph rendering
    - TypeInfo.tsx        # Type information display
    /ui                   # shadcn-inspired components
      - table.tsx
      - tabs.tsx
      - dialog.tsx
      - dropdown.tsx
  /utils
    - schema-parser.ts    # Schema parsing utilities
    - svg-helpers.ts      # SVG manipulation utilities
  /themes
    - light.ts           # Light theme colors
    - dark.ts            # Dark theme colors
  index.ts               # Public API
```

### 6. Direct Browser Import Support

- Provide pre-built UMD version for direct browser use
- Support ES module imports for modern applications
- Package exports that support tree-shaking

### 7. Middleware

- Optional import for server integration
- Lightweight middleware implementations
- No dependency on bundled UI in middleware

## Development Workflow

1. Implement core schema processing
2. Integrate ts-graphviz for layout generation
3. Develop UI components with Solid.js and shadcn-inspired design
4. Connect components with core processing
5. Optimize bundle size
6. Create simple middleware options

## Future Considerations

- Optional lazy-loaded enhancements
- Plugin system for extensions
- Server-side rendering support
- Progressive enhancement for large schemas

## Size Budget Allocation

| Component | Size Budget |
|-----------|-------------|
| Core Logic | 40KB |
| ts-graphviz | 77KB |
| UI/Components | 40KB |
| Middleware | 30KB |
| Utilities | 13KB |
| **Total** | **200KB** |

## Implementation Phases

### Phase 1: Core Architecture
- Set up Vite build
- Implement core schema processing
- Integrate ts-graphviz for DOT generation

### Phase 2: UI Implementation  
- Develop shadcn-inspired components in Solid.js
- Implement minimal styling with utility classes
- Create interactive navigation

### Phase 3: Optimization
- Profile and optimize bundle size
- Implement lazy loading where needed
- Refine rendering performance

### Phase 4: Packaging
- Create proper npm package
- Document API and usage
- Implement middleware options

## Comparison with Original Approach

This refactored approach prioritizes:

1. **Simplicity**: Fewer dependencies, simpler architecture
2. **Performance**: Modern tools, efficient rendering
3. **Size**: Dramatically reduced package size
4. **Maintainability**: Simpler build process, fewer moving parts
5. **Modern Standards**: ESM, tree-shaking, modern browser support

By focusing on these aspects, we can maintain the core functionality and value of GraphQL Voyager while significantly reducing the package size and complexity.
