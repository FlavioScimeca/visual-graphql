import { createSignal, For, Show, type Component } from "solid-js";
import type { TypeGraph } from "../core/type-graph";

interface DocExplorerProps {
  typeGraph: TypeGraph;
  selectedTypeID: string | null;
  selectedEdgeID: string | null;
  onSelectNode: (id: string | null) => void;
  onSelectEdge: (id: string | null) => void;
}

export const DocExplorer: Component<DocExplorerProps> = (props) => {
  const [history, setHistory] = createSignal<string[]>([]);
  
  // Get the currently selected type
  const getSelectedType = () => {
    if (!props.selectedTypeID || !props.typeGraph) return null;
    
    // Convert ID to type name (removing the ID prefix if needed)
    const typeName = props.selectedTypeID.replace(/^TYPE-/, '');
    return props.typeGraph.nodes.get(typeName) || null;
  };
  
  // Handle back button click
  const handleBackClick = () => {
    const currentHistory = history();
    if (currentHistory.length > 0) {
      const newHistory = [...currentHistory];
      newHistory.pop();
      setHistory(newHistory);
      
      // Select the new current type
      const newCurrentType = newHistory.length > 0 
        ? newHistory[newHistory.length - 1] 
        : null;
      
      props.onSelectNode(newCurrentType);
    }
  };
  
  // Handle type click (navigation)
  const handleTypeClick = (typeName: string) => {
    setHistory([...history(), typeName]);
    props.onSelectNode(typeName);
  };
  
  const selectedType = getSelectedType();
  
  return (
    <div class="doc-explorer">
      <div class="doc-explorer-title-bar">
        <Show when={history().length > 0}>
          <div class="doc-explorer-back" onClick={handleBackClick}>
            ← Back
          </div>
        </Show>
        <div class="doc-explorer-title">
          {selectedType ? selectedType.name : "Documentation Explorer"}
        </div>
      </div>
      
      <div class="doc-explorer-contents">
        <Show when={selectedType}>
          {(type) => (
            <>
              <div class="doc-type-description">
                {type().description || `No description for ${type().name}`}
              </div>
              
              {/* Fields */}
              <Show when={type().getFields && typeof type().getFields === 'function'}>
                <div class="doc-category">
                  <div class="doc-category-title">Fields</div>
                  <For each={Object.values(type().getFields())}>
                    {(field: any) => (
                      <div class="doc-category-item">
                        <span class="field-name">{field.name}</span>
                        {field.args && field.args.length > 0 ? "(" : ""}
                        <For each={field.args}>
                          {(arg: any, index) => (
                            <>
                              <span class="arg-name">{arg.name}</span>: 
                              <span class="type-name" onClick={() => handleTypeClick(arg.type.name)}>
                                {arg.type.toString()}
                              </span>
                              {index() < field.args.length - 1 ? ", " : ""}
                            </>
                          )}
                        </For>
                        {field.args && field.args.length > 0 ? ")" : ""}
                        : 
                        <span 
                          class="type-name" 
                          onClick={() => {
                            const namedType = field.type.toString().replace(/[[\]!]/g, '');
                            handleTypeClick(namedType);
                          }}
                        >
                          {field.type.toString()}
                        </span>
                      </div>
                    )}
                  </For>
                </div>
              </Show>
              
              {/* Interfaces (if any) */}
              <Show when={type().getInterfaces && typeof type().getInterfaces === 'function' && type().getInterfaces().length > 0}>
                <div class="doc-category">
                  <div class="doc-category-title">Implements</div>
                  <For each={type().getInterfaces()}>
                    {(interfaceType: any) => (
                      <div 
                        class="doc-category-item"
                        onClick={() => handleTypeClick(interfaceType.name)}
                      >
                        <span class="type-name">{interfaceType.name}</span>
                      </div>
                    )}
                  </For>
                </div>
              </Show>
              
              {/* Possible Types (if it's an interface or union) */}
              <Show when={type().getTypes && typeof type().getTypes === 'function' && type().getTypes().length > 0}>
                <div class="doc-category">
                  <div class="doc-category-title">Possible Types</div>
                  <For each={type().getTypes()}>
                    {(possibleType: any) => (
                      <div 
                        class="doc-category-item"
                        onClick={() => handleTypeClick(possibleType.name)}
                      >
                        <span class="type-name">{possibleType.name}</span>
                      </div>
                    )}
                  </For>
                </div>
              </Show>
              
              {/* Enum Values (if it's an enum) */}
              <Show when={type().getValues && typeof type().getValues === 'function' && type().getValues().length > 0}>
                <div class="doc-category">
                  <div class="doc-category-title">Enum Values</div>
                  <For each={type().getValues()}>
                    {(enumValue: any) => (
                      <div class="doc-category-item">
                        <span class="field-name">{enumValue.name}</span>
                        <Show when={enumValue.description}>
                          <div class="enum-value-description">
                            {enumValue.description}
                          </div>
                        </Show>
                      </div>
                    )}
                  </For>
                </div>
              </Show>
            </>
          )}
        </Show>
        
        <Show when={!selectedType}>
          <div class="doc-category">
            <div class="doc-category-title">Schema Types</div>
            <For each={Array.from(props.typeGraph.nodes.values())}>
              {(type: any) => (
                <div 
                  class="doc-category-item"
                  onClick={() => handleTypeClick(type.name)}
                >
                  <span class="type-name">{type.name}</span>
                </div>
              )}
            </For>
          </div>
        </Show>
      </div>
    </div>
  );
}; 