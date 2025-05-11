import { createSignal, onMount, Show, type Component } from "solid-js";
import { createStore } from "solid-js/store";
import { getSchema } from "../core/introspection";
import { TypeGraph } from "../core/type-graph";
import "../styles/voyager.css";
import { typeNameToId } from "../utils/introspection-utils";
import { DocExplorer } from "./DocExplorer";
import { GraphViewport } from "./GraphViewport";

export interface VoyagerDisplayOptions {
  rootType?: string;
  skipRelay?: boolean;
  skipDeprecated?: boolean;
  showLeafFields?: boolean;
  sortByAlphabet?: boolean;
  hideRoot?: boolean;
}

export interface VoyagerProps {
  introspection: any;
  displayOptions?: VoyagerDisplayOptions;
  hideDocs?: boolean;
  hideSettings?: boolean;
}

export const Voyager: Component<VoyagerProps> = (props) => {
  const [state, setState] = createStore({
    schema: null as any,
    typeGraph: null as any,
    selectedTypeID: null as string | null,
    selectedEdgeID: null as string | null,
    displayOptions: {
      rootType: undefined,
      skipRelay: true,
      skipDeprecated: true,
      sortByAlphabet: false,
      showLeafFields: true,
      hideRoot: false,
      ...props.displayOptions,
    },
  });

  const [isLoading, setIsLoading] = createSignal(true);

  onMount(async () => {
    try {
      // Process introspection data
      const schema = await getSchema(props.introspection, state.displayOptions);
      const typeGraph = new TypeGraph(schema, state.displayOptions);
      
      setState({
        schema,
        typeGraph,
      });
    } catch (error) {
      console.error("Error processing schema:", error);
    } finally {
      setIsLoading(false);
    }
  });

  const handleSelectNode = (typeID: string | null) => {
    setState({
      selectedTypeID: typeID,
      selectedEdgeID: null,
    });
  };

  const handleSelectEdge = (edgeID: string | null) => {
    if (edgeID === state.selectedEdgeID || edgeID == null) {
      setState({ selectedEdgeID: null });
    } else {
      setState({
        selectedTypeID: typeNameToId(extractTypeName(edgeID)),
        selectedEdgeID: edgeID,
      });
    }
  };

  // Extract type name from edge ID
  function extractTypeName(edgeID: string): string {
    // Implementation depends on your edge ID format
    // This is a placeholder
    return edgeID.split('->')[1]?.trim() || '';
  }

  return (
    <div class="graphql-voyager">
      {!props.hideDocs && (
        <div class="doc-panel">
          <div class="contents">
            <Show when={!isLoading() && state.typeGraph}>
              <DocExplorer
                typeGraph={state.typeGraph}
                selectedTypeID={state.selectedTypeID}
                selectedEdgeID={state.selectedEdgeID}
                onSelectNode={handleSelectNode}
                onSelectEdge={handleSelectEdge}
              />
            </Show>
          </div>
        </div>
      )}

      <div class="viewport-area">
        <Show when={!isLoading() && state.typeGraph}>
          <GraphViewport
            typeGraph={state.typeGraph}
            selectedTypeID={state.selectedTypeID}
            selectedEdgeID={state.selectedEdgeID}
            onSelectNode={handleSelectNode}
            onSelectEdge={handleSelectEdge}
          />
        </Show>
        <Show when={isLoading()}>
          <div class="loading">Loading schema...</div>
        </Show>
      </div>
    </div>
  );
}; 