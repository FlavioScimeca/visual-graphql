import { getNamedType, isInterfaceType, isObjectType, isScalarType, isUnionType } from 'graphql';
import { digraph, toDot } from 'ts-graphviz';
import type { TypeGraph } from '../core/type-graph';
import { typeNameToId } from '../utils/introspection-utils';

export function generateDot(typeGraph: TypeGraph): string {
  // Create a new directed graph
  const g = digraph('TypeGraph');
  
  // Set graph attributes for better visual layout
  (g as any).set('rankdir', 'LR'); // Left to right layout
  (g as any).set('splines', 'polyline'); // Use straight lines with bends
  (g as any).set('fontname', 'Arial');
  (g as any).set('fontsize', '14');
  (g as any).set('bgcolor', 'transparent');
  (g as any).set('nodesep', '0.8');
  (g as any).set('ranksep', '1.5');
  (g as any).set('concentrate', 'true'); // Merge edge lines
  
  // Process each node in the type graph
  for (const [, type] of typeGraph.nodes.entries()) {
    const nodeId = typeNameToId(type.name);
    let nodeColor = getNodeColor(type);
    let nodeShape = 'box';
    
    // Different shapes for different node types
    if (isInterfaceType(type)) {
      nodeShape = 'hexagon';
    } else if (isUnionType(type)) {
      nodeShape = 'oval';
    } else if (isScalarType(type)) {
      nodeShape = 'ellipse';
    }
    
    // Create node with HTML-like label for table structure
    g.createNode(nodeId, {
      label: createNodeLabel(type),
      fillcolor: nodeColor,
      shape: nodeShape,
      style: 'rounded,filled',
      color: '#1a59b7',
      fontname: 'Arial',
      fontsize: '12',
      penwidth: '1.5',
    } as any);

    // Add edges for this type's fields
    if (isObjectType(type) || isInterfaceType(type)) {
      const fields = type.getFields();
      
      for (const fieldName in fields) {
        const field = fields[fieldName];
        const targetType = getNamedType(field.type);
        
        // Only add edges to other nodes in our graph
        if (typeGraph.nodes.has(targetType.name)) {
          const targetId = typeNameToId(targetType.name);
          const edgeId = `${nodeId}->${targetId}`;
          
          g.createEdge([nodeId, targetId], {
            id: edgeId,
            label: fieldName,
            color: '#1a59b7',
            fontname: 'Arial',
            fontsize: '10',
            fontcolor: '#444444',
            penwidth: '1.2',
          } as any);
        }
      }
    }
    
    // Add edges for union types
    if (isUnionType(type)) {
      for (const memberType of type.getTypes()) {
        if (typeGraph.nodes.has(memberType.name)) {
          const targetId = typeNameToId(memberType.name);
          const edgeId = `${nodeId}->${targetId}`;
          
          g.createEdge([nodeId, targetId], {
            id: edgeId,
            style: 'dashed',
            label: 'member',
            color: '#e6194b',
            fontname: 'Arial',
            fontsize: '10',
            fontcolor: '#e6194b',
            penwidth: '1.2',
          } as any);
        }
      }
    }
    
    // Add edges for interfaces
    if (isObjectType(type)) {
      for (const interfaceType of type.getInterfaces()) {
        if (typeGraph.nodes.has(interfaceType.name)) {
          const targetId = typeNameToId(interfaceType.name);
          const edgeId = `${nodeId}->${targetId}`;
          
          g.createEdge([nodeId, targetId], {
            id: edgeId,
            style: 'dotted',
            label: 'implements',
            color: '#3cb44b',
            fontname: 'Arial',
            fontsize: '10',
            fontcolor: '#3cb44b',
            penwidth: '1.2',
          } as any);
        }
      }
    }
  }

  return toDot(g);
}

// Helper function to create HTML-like label for nodes
function createNodeLabel(type: any): string {
  let typeName = type.name;
  let typeKind = getTypeKind(type);
  
  let label = `<<TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0" CELLPADDING="4">
    <TR><TD BGCOLOR="#D0E4FA" COLSPAN="2"><B>${typeName}</B> <FONT POINT-SIZE="9" COLOR="#666666">(${typeKind})</FONT></TD></TR>`;
  
  if (isObjectType(type) || isInterfaceType(type)) {
    const fields = type.getFields();
    
    // Sort fields by name for consistency
    const fieldNames = Object.keys(fields).sort();
    
    for (const fieldName of fieldNames) {
      const field = fields[fieldName];
      label += `<TR>
        <TD ALIGN="LEFT" PORT="${fieldName}">${fieldName}</TD>
        <TD ALIGN="LEFT"><FONT COLOR="#444444">${field.type.toString()}</FONT></TD>
      </TR>`;
    }
  } else if (isUnionType(type)) {
    label += `<TR><TD COLSPAN="2" ALIGN="LEFT">Possible Types:</TD></TR>`;
    for (const memberType of type.getTypes()) {
      label += `<TR><TD COLSPAN="2" ALIGN="LEFT" PORT="${memberType.name}">• ${memberType.name}</TD></TR>`;
    }
  } else if (isScalarType(type)) {
    label += `<TR><TD COLSPAN="2" ALIGN="LEFT">Scalar Type</TD></TR>`;
  }
  
  label += '</TABLE>>';
  
  return label;
}

// Get type kind for display
function getTypeKind(type: any): string {
  if (isInterfaceType(type)) {
    return 'Interface';
  } else if (isUnionType(type)) {
    return 'Union';
  } else if (isScalarType(type)) {
    return 'Scalar';
  } else if (isObjectType(type)) {
    return 'Object';
  }
  return 'Type';
}

// Get node color based on type
function getNodeColor(type: any): string {
  if (isInterfaceType(type)) {
    return '#e6fffb'; // Light teal
  } else if (isUnionType(type)) {
    return '#fff1f0'; // Light red
  } else if (isScalarType(type)) {
    return '#f6ffed'; // Light green
  } else {
    return '#e8f2ff'; // Light blue (default)
  }
} 