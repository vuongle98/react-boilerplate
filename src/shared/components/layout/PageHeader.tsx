import { Button } from "@/shared/ui/button";
import { ThemeToggle } from "@/shared/ui/theme-toggle";
import { PlusCircle, MoreVertical } from "lucide-react";
import { toast } from "sonner";
import { ReactNode, ReactElement, Children, cloneElement, isValidElement } from "react";
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
      <ThemeToggle />
      {showAddButton && (
        <Button onClick={handleAdd} size="sm" className="gap-1.5 sm:gap-2 min-w-0 sm:min-w-fit"
        iconLeft={<PlusCircle className="h-3.5 w-3.5" />} title={addButtonLabel || addButtonText}>
          <span className="sr-only sm:not-sr-only sm:text-sm">{addButtonLabel || addButtonText}</span>
        </Button>
      )}
    </div>
  );

  // Helper function to convert ReactNode to dropdown menu items
  const renderNodeAsDropdownItem = (node: ReactNode, index: number) => {
    if (!isValidElement(node)) return null;

    // Extract the text content and icon from button children
    const getButtonContent = (children: ReactNode) => {
      const childArray = Children.toArray(children);
      let icon: ReactNode = null;
      let text: ReactNode = null;

      childArray.forEach((child) => {
        if (isValidElement(child) && child.type === 'svg') {
          icon = child;
        } else if (typeof child === 'string') {
          text = child;
        }
      });

      // If no text found, use the first non-icon child
      if (!text && childArray.length > 0) {
        text = childArray.find(child => !(isValidElement(child) && child.type === 'svg')) || childArray[0];
      }

      return { icon, text };
    };

    const { icon, text } = getButtonContent(node.props.children);

    return (
      <DropdownMenuItem
        key={index}
        onClick={node.props.onClick}
        disabled={node.props.disabled}
        className="gap-2"
      >
        {icon && cloneElement(icon as ReactElement, { className: "h-4 w-4" })}
        {text || node.props.title || node.props.children}
      </DropdownMenuItem>
    );
  };

  // Render mobile layout (dropdown menu or compact buttons)
  const renderMobileActions = () => {
    const hasActions = children || button || actions || showAddButton;

    if (!hasActions) return null;

    // If only actions (like refresh/clear cache buttons) and no other elements, show them compactly
    const onlyHasActions = actions && !children && !button && !showAddButton;

    if (onlyHasActions) {
      return (
        <div className="flex items-center gap-1.5">
          {actions}
          {showAddButton && (
            <Button onClick={handleAdd} size="sm" className="gap-1.5 min-w-0">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:text-sm">
                {addButtonLabel || addButtonText}
              </span>
            </Button>
          )}
        </div>
      );
    }

    // For complex layouts, use dropdown
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="sm" title="More actions">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {children && Children.map(children, (child, index) =>
            renderNodeAsDropdownItem(child, index)
          )}
          {(children && button) && <DropdownMenuSeparator />}
          {button && renderNodeAsDropdownItem(button, -1)}
          {((children || button) && actions) && <DropdownMenuSeparator />}
          {actions && renderNodeAsDropdownItem(actions, -2)}
          {((children || button || actions) && showAddButton) && <DropdownMenuSeparator />}
          <DropdownMenuSeparator />
          <div className="px-1 py-1">
            <ThemeToggle variant="ghost" size="sm" showLabel />
          </div>
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
    <div className="flex justify-between items-start sm:items-center pb-2 sm:pb-3 border-b gap-3">
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
