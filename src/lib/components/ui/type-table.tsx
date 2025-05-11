import { For, type Component } from "solid-js";

interface Field {
  name: string;
  type: string;
  description?: string;
  isDeprecated?: boolean;
  deprecationReason?: string;
}

interface TypeTableProps {
  fields: Field[];
  onSelectType: (typeName: string) => void;
}

export const TypeTable: Component<TypeTableProps> = (props) => {
  const handleTypeClick = (type: string) => {
    // Extract the base type name from type expressions like [User]!, User!, [User], etc.
    const baseType = type
      .replace(/[\[\]!]/g, '') // Remove brackets and non-null indicators
      .trim();
    
    props.onSelectType(baseType);
  };
  
  return (
    <div class="rounded-md border border-border mt-4">
      <table class="w-full caption-bottom text-sm">
        <thead>
          <tr class="border-b border-border bg-muted/50">
            <th class="h-10 px-4 text-left align-middle font-medium text-foreground">Field</th>
            <th class="h-10 px-4 text-left align-middle font-medium text-foreground">Type</th>
            <th class="h-10 px-4 text-left align-middle font-medium text-foreground">Description</th>
          </tr>
        </thead>
        <tbody>
          <For each={props.fields}>
            {(field) => (
              <tr class="border-b border-border transition-colors hover:bg-muted/50">
                <td class="p-4 align-middle">
                  <div class="font-medium">{field.name}</div>
                  {field.isDeprecated && (
                    <div class="text-xs text-destructive">
                      Deprecated: {field.deprecationReason || "No reason provided"}
                    </div>
                  )}
                </td>
                <td class="p-4 align-middle">
                  <button 
                    class="font-mono text-primary hover:underline"
                    onClick={() => handleTypeClick(field.type)}
                  >
                    {field.type}
                  </button>
                </td>
                <td class="p-4 align-middle text-muted-foreground">
                  {field.description || ""}
                </td>
              </tr>
            )}
          </For>
        </tbody>
      </table>
    </div>
  );
}; 