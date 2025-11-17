import { GenericDataItem } from "@/shared/types/admin-dashboard";
import { Badge } from "@/shared/ui/badge";

interface ItemDetailViewProps {
  item: GenericDataItem;
  fields: any[];
}

export function ItemDetailView({ item, fields }: ItemDetailViewProps) {
  return (
    <div className="space-y-6">
      {fields
        .filter((field) => field.detail?.visible !== false)
        .map((field) => {
          const value = item[field.key];

          // Custom renderer takes precedence
          let displayValue;
          if (field.detail?.render) {
            displayValue = field.detail.render(value, item);
          } else {
            // Type-specific rendering (similar to table)
            switch (field.type) {
              case "boolean":
                displayValue = value ? (
                  <Badge variant="default">Yes</Badge>
                ) : (
                  <Badge variant="secondary">No</Badge>
                );
                break;

              case "date":
              case "datetime":
                if (!value) {
                  displayValue = (
                    <span className="text-muted-foreground">-</span>
                  );
                } else {
                  const date = new Date(value);
                  displayValue =
                    field.type === "datetime"
                      ? date.toLocaleString()
                      : date.toLocaleDateString();
                }
                break;

              case "select":
                if (!value) {
                  displayValue = (
                    <span className="text-muted-foreground">-</span>
                  );
                } else {
                  const option = field.options?.find(
                    (opt) => opt.value === value
                  );
                  displayValue = option ? option.label : String(value);
                }
                break;

              case "json":
                displayValue = value ? (
                  <code className="text-xs bg-muted p-2 rounded block whitespace-pre-wrap">
                    {JSON.stringify(value, null, 2)}
                  </code>
                ) : (
                  <span className="text-muted-foreground">-</span>
                );
                break;

              default:
                displayValue = value || (
                  <span className="text-muted-foreground">-</span>
                );
                break;
            }
          }

          return (
            <div key={field.key} className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                {field.label}
              </label>
              <div className="text-sm">{displayValue}</div>
            </div>
          );
        })}
    </div>
  );
}
