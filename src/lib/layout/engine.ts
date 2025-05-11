import svgPanZoom from 'svg-pan-zoom';
import type { TypeGraph } from '../core/type-graph';
import { generateDot } from './dot-generator';

// Dynamically import the Graphviz vizjs library
declare global {
  interface Window {
    Viz?: any;
    d3?: any;
  }
}

// Create a reference to store the active panZoom instance
let activePanZoomInstance: any = null;

// Render the graph using ts-graphviz
export async function renderGraph(typeGraph: TypeGraph): Promise<{ svg: SVGSVGElement, panZoom: any }> {
  try {
    console.log('Starting graph rendering process with typeGraph:', typeGraph);
    // Generate DOT representation for reference (not used directly in fallback)
    const dotCode = generateDot(typeGraph);
    console.log('Generated DOT code for reference');
    
    // Skip trying to load external libraries and go straight to reliable fallback
    console.log('Creating fallback visualization for TypeGraph with nodes:', typeGraph.nodes.size);
    const svgString = createFallbackSVG(typeGraph);
    
    // Create SVG DOM element
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, 'image/svg+xml');
    
    // Check for parsing errors
    const parserError = doc.querySelector('parsererror');
    if (parserError) {
      console.error('SVG parsing error:', parserError.textContent);
      throw new Error('Failed to parse SVG');
    }
    
    // Cast to SVG element
    const svg = doc.documentElement as unknown as SVGSVGElement;
    console.log('SVG element created successfully');
    
    // Optimize SVG for rendering and performance
    optimizeSvgForRendering(svg);
    
    // Enhance SVG with interactive elements
    enhanceSvg(svg);
    
    // Create a proper pan-zoom object with working methods
    const panZoom = {
      zoomIn: () => {
        if (activePanZoomInstance) activePanZoomInstance.zoomIn();
      },
      zoomOut: () => {
        if (activePanZoomInstance) activePanZoomInstance.zoomOut();
      },
      reset: () => {
        if (activePanZoomInstance) activePanZoomInstance.reset();
      },
      fit: () => {
        if (activePanZoomInstance) activePanZoomInstance.fit();
      },
      center: () => {
        if (activePanZoomInstance) activePanZoomInstance.center();
      },
      getPan: () => {
        return activePanZoomInstance ? activePanZoomInstance.getPan() : { x: 0, y: 0 };
      },
      getZoom: () => {
        return activePanZoomInstance ? activePanZoomInstance.getZoom() : 1;
      },
      pan: (point: {x: number, y: number}) => {
        if (activePanZoomInstance) activePanZoomInstance.pan(point);
      },
      destroy: () => {
        if (activePanZoomInstance) {
          activePanZoomInstance.destroy();
          activePanZoomInstance = null;
        }
      }
    };
    
    // Initialize the svg-pan-zoom library with a delay to ensure the SVG is properly rendered
    // Return the SVG and panZoom object immediately, but initialize the real pan-zoom instance asynchronously
    setTimeout(() => {
      try {
        // Clean up any previous instance
        if (activePanZoomInstance) {
          activePanZoomInstance.destroy();
        }
        
        // Initialize the svg-pan-zoom library
        activePanZoomInstance = svgPanZoom(svg, {
          zoomScaleSensitivity: 0.4,
          minZoom: 0.1,
          maxZoom: 10,
          controlIconsEnabled: false,
          fit: true,
          center: true,
          dblClickZoomEnabled: true
        });
        
        console.log('Pan-zoom initialized successfully');
        
        // Trigger an initial fit to ensure everything is visible
        setTimeout(() => {
          if (activePanZoomInstance) {
            activePanZoomInstance.fit();
            activePanZoomInstance.center();
          }
        }, 100);
      } catch (e) {
        console.error('Failed to initialize pan-zoom:', e);
      }
    }, 100);
    
    return { svg, panZoom };
  } catch (error) {
    console.error("Error rendering graph:", error);
    return createErrorSvg();
  }
}

// Optimize SVG for better rendering performance
function optimizeSvgForRendering(svg: SVGSVGElement): void {
  // Set attributes to improve rendering performance
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  
  // Add CSS classes for styling
  svg.classList.add('schema-diagram');
  
  // Set better viewBox that works well with pan-zoom
  const viewBox = svg.getAttribute('viewBox');
  if (!viewBox) {
    svg.setAttribute('viewBox', '0 0 1800 1200');
  }
  
  // Reduce the number of decimal places in path coordinates for better performance
  svg.querySelectorAll('path').forEach(path => {
    const d = path.getAttribute('d');
    if (d) {
      const rounded = d.replace(/(\d+\.\d{0,2})\d*/g, '$1');
      path.setAttribute('d', rounded);
    }
  });
  
  // Add document title for accessibility
  const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
  title.textContent = 'GraphQL Schema Visualization';
  svg.insertBefore(title, svg.firstChild);
}

// Create a fallback SVG visualization for the schema
function createFallbackSVG(typeGraph: TypeGraph): string {
  // Directly use the nodes from the typeGraph
  const nodeNames = Array.from(typeGraph.nodes.keys());
  console.log('Creating fallback SVG with', nodeNames.length, 'nodes');
  
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="1200" viewBox="0 0 1800 1200" class="schema-diagram">
    <defs>
      <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
        <path d="M0,0 L0,6 L9,3 z" fill="#1a59b7" />
      </marker>
    </defs>
    <g class="graph">`;
  
  // Define node dimensions and spacing
  const nodesPerRow = 4;
  const nodeWidth = 230;
  const nodeHeight = 180;
  const marginX = 100;
  const marginY = 120;
  
  // Define type colors
  const typeColors: Record<string, string> = {
    OBJECT: '#e8f2ff',
    INTERFACE: '#e6fffb', 
    UNION: '#fff1f0',
    SCALAR: '#f6ffed',
    INPUT_OBJECT: '#fcf4dc',
    ENUM: '#f6e9ff',
    UNKNOWN: '#f0f0f0'
  };
  
  // Create nodes
  nodeNames.forEach((nodeName, index) => {
    const row = Math.floor(index / nodesPerRow);
    const col = index % nodesPerRow;
    const x = marginX + col * (nodeWidth + marginX);
    const y = marginY + row * (nodeHeight + marginY);
    
    // Get the node from typeGraph to display more details
    const node = typeGraph.nodes.get(nodeName);
    const nodeType = node?.kind || 'UNKNOWN';
    const nodeColor = typeColors[nodeType] || typeColors.UNKNOWN;
    
    // Create a node SVG group
    svg += `
      <g class="node" id="${nodeName}">
        <rect x="${x}" y="${y}" width="${nodeWidth}" height="${nodeHeight}" fill="${nodeColor}" stroke="#1a59b7" rx="5" ry="5" />
        <rect x="${x}" y="${y}" width="${nodeWidth}" height="30" fill="#1a59b7" rx="5" ry="0" />
        <text x="${x + nodeWidth/2}" y="${y + 20}" text-anchor="middle" font-family="Arial" font-size="14" font-weight="bold" fill="white">${nodeName}</text>
        <text x="${x + nodeWidth/2}" y="${y + 45}" text-anchor="middle" font-family="Arial" font-size="12">(${nodeType})</text>`;
      
    // If the node has fields, display more of them
    const fields = node?.getFields ? node.getFields() : null;
    if (fields) {
      const fieldNames = Object.keys(fields);
      const maxFieldsToShow = Math.min(8, fieldNames.length);
      
      fieldNames.slice(0, maxFieldsToShow).forEach((fieldName, fieldIndex) => {
        const field = fields[fieldName];
        const typeName = field.type.toString();
        
        // Show field name and type
        svg += `
          <text x="${x + 10}" y="${y + 70 + fieldIndex * 15}" font-family="Arial" font-size="12">${fieldName}</text>
          <text x="${x + nodeWidth - 10}" y="${y + 70 + fieldIndex * 15}" text-anchor="end" font-family="Arial" font-size="11" fill="#666666">${typeName}</text>`;
      });
      
      if (fieldNames.length > maxFieldsToShow) {
        svg += `<text x="${x + 10}" y="${y + 70 + maxFieldsToShow * 15}" font-family="Arial" font-size="11">... and ${fieldNames.length - maxFieldsToShow} more</text>`;
      }
    }
    
    // If it's a scalar, show it has no fields
    if (nodeType === 'SCALAR') {
      svg += `<text x="${x + 10}" y="${y + 70}" font-family="Arial" font-size="12" fill="#666666">Scalar Type</text>`;
    }
    
    // If it's an enum, show enum values
    if (nodeType === 'ENUM' && node.getValues) {
      try {
        const values = node.getValues();
        const maxValuesToShow = Math.min(5, values.length);
        
        values.slice(0, maxValuesToShow).forEach((value: any, valueIndex: number) => {
          svg += `<text x="${x + 10}" y="${y + 70 + valueIndex * 15}" font-family="Arial" font-size="12">${value.name}</text>`;
        });
        
        if (values.length > maxValuesToShow) {
          svg += `<text x="${x + 10}" y="${y + 70 + maxValuesToShow * 15}" font-family="Arial" font-size="11">... and ${values.length - maxValuesToShow} more</text>`;
        }
      } catch (e) {
        console.error('Error getting enum values:', e);
      }
    }
        
    svg += `</g>`;
  });
  
  // Create edges (connections between nodes)
  nodeNames.forEach((sourceName) => {
    const node = typeGraph.nodes.get(sourceName);
    
    if (node?.getFields) {
      const fields = node.getFields();
      
      for (const fieldName in fields) {
        try {
          const field = fields[fieldName];
          let targetType = field.type;
          
          // Navigate through NON_NULL and LIST types to get to the named type
          while (targetType.ofType) {
            targetType = targetType.ofType;
          }
          
          // Only create edges for types that are in our typeGraph
          if (targetType.name && typeGraph.nodes.has(targetType.name)) {
            const sourceIndex = nodeNames.indexOf(sourceName);
            const targetIndex = nodeNames.indexOf(targetType.name);
            
            if (sourceIndex > -1 && targetIndex > -1) {
              const sourceRow = Math.floor(sourceIndex / nodesPerRow);
              const sourceCol = sourceIndex % nodesPerRow;
              const targetRow = Math.floor(targetIndex / nodesPerRow);
              const targetCol = targetIndex % nodesPerRow;
              
              const sourceX = marginX + sourceCol * (nodeWidth + marginX) + nodeWidth/2;
              const sourceY = marginY + sourceRow * (nodeHeight + marginY) + nodeHeight;
              const targetX = marginX + targetCol * (nodeWidth + marginX) + nodeWidth/2;
              const targetY = marginY + targetRow * (nodeHeight + marginY);
              
              // Only draw direct connections or curves based on position
              let path = '';
              let labelX = 0;
              let labelY = 0;
              
              if (targetRow > sourceRow) {
                // Target is below source - draw direct line
                path = `M${sourceX},${sourceY} L${targetX},${targetY}`;
                labelX = (sourceX + targetX) / 2;
                labelY = (sourceY + targetY) / 2 - 5;
              } else if (targetRow === sourceRow && Math.abs(targetCol - sourceCol) === 1) {
                // Target is adjacent on same row - draw curved line
                const midY = sourceY + 50;
                path = `M${sourceX},${sourceY} Q${sourceX},${midY} ${(sourceX + targetX)/2},${midY} T${targetX},${targetY}`;
                labelX = (sourceX + targetX) / 2;
                labelY = midY - 10;
              } else {
                // Target is more complex - draw S-curve
                const dy = Math.abs(targetY - sourceY);
                const dx = Math.abs(targetX - sourceX);
                const curve = Math.min(dx / 2, 100);
                
                path = `M${sourceX},${sourceY} C${sourceX},${sourceY + curve} ${targetX},${targetY - curve} ${targetX},${targetY}`;
                labelX = (sourceX + targetX) / 2;
                labelY = (sourceY + targetY) / 2 - 15;
              }
              
              svg += `
              <g class="edge" id="${sourceName}->${targetType.name}">
                <path d="${path}" stroke="#1a59b7" fill="none" marker-end="url(#arrow)" />
                <text x="${labelX}" y="${labelY}" text-anchor="middle" font-family="Arial" font-size="10" fill="#444444">${fieldName}</text>
              </g>`;
            }
          }
        } catch (e) {
          console.error('Error creating edge for field:', fieldName, e);
        }
      }
    }
  });
  
  svg += `
    </g>
  </svg>`;
  
  return svg;
}

// Create an error SVG
function createErrorSvg(): { svg: SVGSVGElement, panZoom: any } {
  const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgElement.setAttribute('width', '100%');
  svgElement.setAttribute('height', '100%');
  svgElement.setAttribute('viewBox', '0 0 800 600');
  
  // Add error message
  const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  textElement.setAttribute('x', '400');
  textElement.setAttribute('y', '300');
  textElement.setAttribute('text-anchor', 'middle');
  textElement.setAttribute('font-family', 'Arial');
  textElement.setAttribute('font-size', '24');
  textElement.setAttribute('fill', '#f5222d');
  textElement.textContent = 'Error rendering GraphQL schema visualization';
  
  // Add smaller explanation text
  const subtextElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  subtextElement.setAttribute('x', '400');
  subtextElement.setAttribute('y', '340');
  subtextElement.setAttribute('text-anchor', 'middle');
  subtextElement.setAttribute('font-family', 'Arial');
  subtextElement.setAttribute('font-size', '16');
  subtextElement.setAttribute('fill', '#666');
  subtextElement.textContent = 'See browser console for details';
  
  svgElement.appendChild(textElement);
  svgElement.appendChild(subtextElement);
  
  // Create a minimal pan-zoom implementation
  const dummyPanZoom = {
    zoomIn: () => {},
    zoomOut: () => {},
    reset: () => {},
    fit: () => {},
    center: () => {},
    getPan: () => ({ x: 0, y: 0 }),
    getZoom: () => 1,
    pan: () => {},
    destroy: () => {}
  };
  
  return { svg: svgElement, panZoom: dummyPanZoom };
}

// Enhance SVG with interactive elements
function enhanceSvg(svg: SVGSVGElement): void {
  // Add classes and event handlers to nodes and edges
  svg.querySelectorAll('.node').forEach(node => {
    // Add hover effects
    node.classList.add('interactive');
  });
  
  svg.querySelectorAll('.edge').forEach(edge => {
    // Add hover effects
    edge.classList.add('interactive');
  });
  
  // Add accessibility attributes
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'GraphQL Schema Visualization');
} 