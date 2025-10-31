import { Button } from "@/shared/ui/button";
import { PlusCircle, MoreVertical } from "lucide-react";
import { toast } from "sonner";
import { ReactNode, Children, cloneElement, isValidElement } from "react";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

interface PageHeaderProps {
  title: string;
  description?: string;
  showAddButton?: boolean;
  addButtonText?: string;
  onAddClick?: () => void;
  onAddButtonClick?: () => void; // For backward compatibility
  addButtonLabel?: string;
  actions?: ReactNode;
  button?: ReactNode;
  children?: ReactNode;
}

export function PageHeader({
  title,
  description,
  showAddButton = false,
  addButtonText = "Add New",
  onAddClick,
  onAddButtonClick,
  addButtonLabel,
  actions,
  button,
  children,
}: PageHeaderProps) {
  const isMobile = useIsMobile();

  const handleAdd = () => {
    if (onAddClick) {
      onAddClick();
    } else if (onAddButtonClick) {
      onAddButtonClick();
    } else {
      toast.success(`Add new ${title.toLowerCase()} action triggered`);
    }
  };

  // Render desktop layout (horizontal)
  const renderDesktopActions = () => (
    <div className="flex items-center gap-4">
      {children}
      {button}
      {actions}
      {showAddButton && (
        <Button onClick={handleAdd}>
          <PlusCircle className="h-4 w-4 mr-2" />
          {addButtonLabel || addButtonText}
        </Button>
      )}
    </div>
  );

  // Helper function to convert ReactNode to dropdown menu items
  const renderNodeAsDropdownItem = (node: ReactNode, index: number) => {
    if (!isValidElement(node)) return null;

    // Clone the element and wrap it in a dropdown item container
    const clonedNode = cloneElement(node, {
      className: `${node.props.className || ''} w-full justify-start`.trim(),
      size: 'sm',
      variant: node.props.variant || 'ghost',
    });

    return (
      <div key={index} className="px-1">
        {clonedNode}
      </div>
    );
  };

  // Render mobile layout (dropdown menu)
  const renderMobileActions = () => {
    const hasActions = children || button || actions || showAddButton;

    if (!hasActions) return null;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {children && Children.map(children, (child, index) =>
            renderNodeAsDropdownItem(child, index)
          )}
          {(children && button) && <DropdownMenuSeparator />}
          {button && renderNodeAsDropdownItem(button, -1)}
          {((children || button) && actions) && <DropdownMenuSeparator />}
          {actions && renderNodeAsDropdownItem(actions, -2)}
          {((children || button || actions) && showAddButton) && <DropdownMenuSeparator />}
          {showAddButton && (
            <DropdownMenuItem onClick={handleAdd}>
              <PlusCircle className="h-4 w-4 mr-2" />
              {addButtonLabel || addButtonText}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="flex justify-between items-start sm:items-center pb-4 sm:pb-6 border-b gap-4">
      <div className="flex-1 min-w-0">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">{title}</h1>
        {description && (
          <p className="text-sm sm:text-base text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {isMobile ? renderMobileActions() : renderDesktopActions()}
    </div>
  );
}
