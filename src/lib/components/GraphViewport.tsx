import { createEffect, onCleanup, onMount, type Component } from "solid-js";
import type { TypeGraph } from "../core/type-graph";
import { renderGraph } from "../layout/engine";

interface GraphViewportProps {
  typeGraph: TypeGraph;
  selectedTypeID: string | null;
  selectedEdgeID: string | null;
  onSelectNode: (id: string | null) => void;
  onSelectEdge: (id: string | null) => void;
}

export const GraphViewport: Component<GraphViewportProps> = (props) => {
  let containerRef: HTMLDivElement | undefined;
  let svgElement: SVGSVGElement | null = null;
  let panZoomInstance: any = null;
  let initialRenderComplete = false;

  // Add styles for the controls
  const style = document.createElement('style');
  style.textContent = `
    .graph-viewport .controls {
      position: absolute;
      bottom: 20px;
      right: 20px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      background: rgba(255, 255, 255, 0.85);
      border-radius: 6px;
      padding: 10px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      z-index: 1000;
    }
    
    .graph-viewport .controls button {
      width: 36px;
      height: 36px;
      border-radius: 4px;
      border: 1px solid #d9d9d9;
      background: white;
      font-size: 18px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    
    .graph-viewport .controls button:hover {
      background: #f0f7ff;
      border-color: #1a59b7;
      color: #1a59b7;
    }
    
    .graph-viewport .controls button:active {
      background: #e6f4ff;
    }
    
    .graph-viewport .controls-help {
      font-size: 11px;
      color: #888;
      text-align: center;
      margin-top: 8px;
      white-space: nowrap;
    }
    
    .graph-viewport .pulse {
      animation: pulse-animation 1.5s ease-in-out;
    }
    
    @keyframes pulse-animation {
      0% { opacity: 1; }
      50% { opacity: 0.5; }
      100% { opacity: 1; }
    }
  `;
  document.head.appendChild(style);

  onMount(async () => {
    if (!containerRef || !props.typeGraph) return;
    
    try {
      // Clear any loading indicators
      containerRef.innerHTML = '';
      
      // Add loading spinner during render
      const loadingDiv = document.createElement('div');
      loadingDiv.className = 'graph-loading';
      loadingDiv.innerHTML = '<div class="spinner"></div><div>Rendering graph...</div>';
      containerRef.appendChild(loadingDiv);
      
      // Render the graph asynchronously
      setTimeout(async () => {
        try {
          // Render the graph using visualization engine
          const { svg, panZoom } = await renderGraph(props.typeGraph);
          
          if (containerRef) {
            // Clear previous content including loading spinner
            containerRef.innerHTML = '';
            
            // Add the new SVG
            containerRef.appendChild(svg);
            svgElement = svg;
            panZoomInstance = panZoom;
            
            // Add event listeners for node and edge selection
            setupEventListeners(svg);
            
            // Set up touch events
            setupTouchEvents(svg);
            
            // Mark initial render as complete
            initialRenderComplete = true;
            
            // Add custom controls (with direct access to the panZoom instance)
            addCustomControls();
            
            // Focus on selected node if any
            if (props.selectedTypeID) {
              const node = svg.getElementById(props.selectedTypeID);
              if (node) {
                focusNode(node);
              }
            }
          }
        } catch (error) {
          console.error("Error in async rendering:", error);
          showRenderError(String(error));
        }
      }, 10);
    } catch (error) {
      console.error("Error rendering graph:", error);
      showRenderError(String(error));
    }
  });

  // Update selection when props change
  createEffect(() => {
    if (!svgElement || !initialRenderComplete) return;
    
    // Remove previous selection
    const selectedNodes = svgElement.querySelectorAll('.node.selected');
    selectedNodes.forEach(node => node.classList.remove('selected'));
    
    const selectedEdges = svgElement.querySelectorAll('.edge.selected');
    selectedEdges.forEach(edge => edge.classList.remove('selected'));
    
    // Add new selection
    if (props.selectedTypeID) {
      const node = svgElement.getElementById(props.selectedTypeID);
      if (node) {
        node.classList.add('selected');
        if (panZoomInstance) {
          focusNode(node);
        }
      }
    }
    
    if (props.selectedEdgeID) {
      const edge = svgElement.getElementById(props.selectedEdgeID);
      if (edge) {
        edge.classList.add('selected');
      }
    }
  });

  onCleanup(() => {
    if (panZoomInstance) {
      panZoomInstance.destroy();
    }
    
    // Remove the style element when component is unmounted
    if (style && style.parentNode) {
      style.parentNode.removeChild(style);
    }
  });

  const setupEventListeners = (svg: SVGSVGElement) => {
    // Use capture phase to catch events on SVG child elements
    svg.addEventListener('click', handleSvgClick, true);
    
    // Add keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
  };

  const setupTouchEvents = (svg: SVGSVGElement) => {
    let touchStartX = 0;
    let touchStartY = 0;
    let lastTapTime = 0;
    
    svg.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        
        // Check for double tap
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTapTime;
        if (tapLength < 300 && tapLength > 0) {
          e.preventDefault();
          handleDoubleTap(e);
        }
        lastTapTime = currentTime;
      }
    });
    
    svg.addEventListener('touchend', (e) => {
      if (e.changedTouches.length === 1) {
        const deltaX = Math.abs(e.changedTouches[0].clientX - touchStartX);
        const deltaY = Math.abs(e.changedTouches[0].clientY - touchStartY);
        
        // If the touch was more of a tap than a drag
        if (deltaX < 10 && deltaY < 10) {
          const touch = e.changedTouches[0];
          const target = document.elementFromPoint(touch.clientX, touch.clientY) as SVGElement;
          handleTouchTap(target, e);
        }
      }
    });
  };

  const handleTouchTap = (target: SVGElement, event: TouchEvent) => {
    if (!target) return;
    
    // Check if we tapped on a node or its child elements
    const nodeElement = findParentWithClass(target, 'node');
    if (nodeElement) {
      event.preventDefault();
      props.onSelectNode(nodeElement.id);
      return;
    }
    
    // Check if we tapped on an edge or its child elements
    const edgeElement = findParentWithClass(target, 'edge');
    if (edgeElement) {
      event.preventDefault();
      props.onSelectEdge(edgeElement.id);
      return;
    }
    
    // Tap on background clears selection
    props.onSelectNode(null);
    props.onSelectEdge(null);
  };

  const handleDoubleTap = (event: TouchEvent) => {
    // Double tap to zoom in
    if (panZoomInstance) {
      const touch = event.touches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY) as SVGElement;
      
      const nodeElement = findParentWithClass(target, 'node');
      if (nodeElement) {
        event.preventDefault();
        focusNode(nodeElement);
        panZoomInstance.zoomIn();
      } else {
        panZoomInstance.zoomIn();
      }
    }
  };

  const handleSvgClick = (event: MouseEvent) => {
    // Find the closest node or edge that was clicked
    const target = event.target as SVGElement;
    
    // Check if we clicked on a node or its child elements
    const nodeElement = findParentWithClass(target, 'node');
    if (nodeElement) {
      event.preventDefault();
      event.stopPropagation();
      props.onSelectNode(nodeElement.id);
      return;
    }
    
    // Check if we clicked on an edge or its child elements
    const edgeElement = findParentWithClass(target, 'edge');
    if (edgeElement) {
      event.preventDefault();
      event.stopPropagation();
      props.onSelectEdge(edgeElement.id);
      return;
    }
    
    // Click on background clears selection
    props.onSelectNode(null);
    props.onSelectEdge(null);
  };

  const handleKeyboardNavigation = (event: KeyboardEvent) => {
    if (!svgElement || !props.selectedTypeID) return;
    
    // Navigate between nodes with arrow keys
    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight':
        navigateWithArrowKeys(event.key);
        event.preventDefault();
        break;
      case '+':
        handleZoomIn();
        event.preventDefault();
        break;
      case '-':
        handleZoomOut();
        event.preventDefault();
        break;
      case '0':
        handleZoomReset();
        event.preventDefault();
        break;
      case 'f':
        handleFitView();
        event.preventDefault();
        break;
    }
  };

  const navigateWithArrowKeys = (direction: string) => {
    if (!svgElement || !props.selectedTypeID || !props.typeGraph) return;
    
    const currentNode = props.typeGraph.nodes.get(props.selectedTypeID);
    if (!currentNode || !currentNode.getFields) return;
    
    // Get all connected types from the current node
    const connectedTypes = props.typeGraph.getConnectedTypes(props.selectedTypeID);
    if (!connectedTypes.length) return;
    
    // Find the closest node in the specified direction
    const currentElement = svgElement.getElementById(props.selectedTypeID);
    if (!currentElement) return;
    
    const currentRect = currentElement.getBoundingClientRect();
    const currentCenterX = currentRect.left + currentRect.width / 2;
    const currentCenterY = currentRect.top + currentRect.height / 2;
    
    // Use explicit any type to avoid type errors with GraphQL objects
    let closestNode: any = null;
    let closestDistance = Infinity;
    
    connectedTypes.forEach(type => {
      // Skip if type is not valid
      if (!type) return;
      
      // Extract name from type (which might be a string or an object)
      const typeName = typeof type === 'string' ? type : type.name;
      if (!typeName) return;
      
      const typeElement = svgElement?.getElementById(typeName);
      if (!typeElement) return;
      
      const typeRect = typeElement.getBoundingClientRect();
      const typeCenterX = typeRect.left + typeRect.width / 2;
      const typeCenterY = typeRect.top + typeRect.height / 2;
      
      const deltaX = typeCenterX - currentCenterX;
      const deltaY = typeCenterY - currentCenterY;
      
      // Check if the node is in the right direction
      let inRightDirection = false;
      switch (direction) {
        case 'ArrowUp':
          inRightDirection = deltaY < -20; // Node is above
          break;
        case 'ArrowDown':
          inRightDirection = deltaY > 20; // Node is below
          break;
        case 'ArrowLeft':
          inRightDirection = deltaX < -20; // Node is to the left
          break;
        case 'ArrowRight':
          inRightDirection = deltaX > 20; // Node is to the right
          break;
      }
      
      if (inRightDirection) {
        // Calculate the distance
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestNode = type;
        }
      }
    });
    
    if (closestNode) {
      try {
        // Handle both string and object types
        const nodeId = typeof closestNode === 'string' ? closestNode : closestNode.name;
        if (nodeId) {
          props.onSelectNode(nodeId);
        }
      } catch (err) {
        console.error('Error selecting node:', err);
      }
    }
  };

  const findParentWithClass = (element: SVGElement, className: string): SVGElement | null => {
    let current: Element | null = element;
    
    while (current && current.tagName !== 'svg') {
      if (current.classList && current.classList.contains(className)) {
        return current as SVGElement;
      }
      current = current.parentElement;
    }
    
    return null;
  };

  const focusNode = (node: Element) => {
    if (!panZoomInstance || !containerRef) return;
    
    try {
      // Get bounding boxes
      const nodeRect = node.getBoundingClientRect();
      const containerRect = containerRef.getBoundingClientRect();
      
      // Get current pan and zoom
      const pan = panZoomInstance.getPan();
      const zoom = panZoomInstance.getZoom();
      
      // Calculate center position
      const centerX = containerRect.width / 2;
      const centerY = containerRect.height / 2;
      
      // Calculate new pan position to center the node
      const newPanX = pan.x - (nodeRect.left - containerRect.left) + centerX - nodeRect.width / 2;
      const newPanY = pan.y - (nodeRect.top - containerRect.top) + centerY - nodeRect.height / 2;
      
      // Create a smooth animation to the new position
      const currentPan = { x: pan.x, y: pan.y };
      const targetPan = { x: newPanX, y: newPanY };
      const animationSteps = 30;
      let step = 0;
      
      // Add highlighting pulse animation to the node
      node.classList.add('pulse');
      setTimeout(() => {
        node.classList.remove('pulse');
      }, 1500);
      
      const animate = () => {
        step++;
        if (step <= animationSteps) {
          const progress = step / animationSteps;
          // Use easing function for smoother animation
          const easeProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease out
          
          const interpolatedX = currentPan.x + (targetPan.x - currentPan.x) * easeProgress;
          const interpolatedY = currentPan.y + (targetPan.y - currentPan.y) * easeProgress;
          
          panZoomInstance.pan({ x: interpolatedX, y: interpolatedY });
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    } catch (error) {
      console.error("Error focusing node:", error);
    }
  };
  
  const handleZoomIn = () => {
    if (panZoomInstance) {
      panZoomInstance.zoomIn();
    }
  };
  
  const handleZoomOut = () => {
    if (panZoomInstance) {
      panZoomInstance.zoomOut();
    }
  };
  
  const handleZoomReset = () => {
    if (panZoomInstance) {
      panZoomInstance.reset();
    }
  };
  
  const handleFitView = () => {
    if (panZoomInstance) {
      panZoomInstance.fit();
      panZoomInstance.center();
    }
  };
  
  const showRenderError = (errorMessage: string) => {
    if (!containerRef) return;
    
    containerRef.innerHTML = '';
    const errorDiv = document.createElement('div');
    errorDiv.className = 'graph-error';
    errorDiv.innerHTML = `
      <h3>Error Rendering Graph</h3>
      <p>${errorMessage}</p>
      <p>Try refreshing the page or using a different browser.</p>
    `;
    containerRef.appendChild(errorDiv);
  };
  
  const addCustomControls = () => {
    if (!containerRef) return;
    
    // Remove any existing controls
    const existingControls = containerRef.querySelector('.controls');
    if (existingControls) {
      existingControls.remove();
    }
    
    // Create controls container
    const controls = document.createElement('div');
    controls.className = 'controls';
    
    // Create control buttons with directly bound event handlers
    const buttons = [
      { label: '+', title: 'Zoom In (Shortcut: +)', action: () => panZoomInstance?.zoomIn() },
      { label: '−', title: 'Zoom Out (Shortcut: -)', action: () => panZoomInstance?.zoomOut() },
      { label: '⟲', title: 'Reset View (Shortcut: 0)', action: () => panZoomInstance?.reset() },
      { label: '⤢', title: 'Fit to View (Shortcut: f)', action: () => {
        if (panZoomInstance) {
          panZoomInstance.fit();
          panZoomInstance.center();
        }
      }}
    ];
    
    buttons.forEach(button => {
      const buttonElement = document.createElement('button');
      buttonElement.textContent = button.label;
      buttonElement.title = button.title;
      
      // Add direct event handler using addEventListener to ensure proper binding
      buttonElement.addEventListener('click', (e) => {
        e.preventDefault();
        button.action();
      });
      
      controls.appendChild(buttonElement);
    });
    
    // Mini help text
    const helpText = document.createElement('div');
    helpText.className = 'controls-help';
    helpText.textContent = 'Use arrow keys to navigate, drag to pan';
    controls.appendChild(helpText);
    
    containerRef.appendChild(controls);
  };

  return (
    <div class="graph-viewport" ref={containerRef}>
      <div class="initial-loading">
        <div class="spinner"></div>
        <div>Loading GraphQL schema visualization...</div>
      </div>
    </div>
  );
}; 