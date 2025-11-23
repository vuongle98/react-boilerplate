import { useIsMobile } from "@/shared/hooks/use-mobile";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { X } from "lucide-react";
import React from "react";

interface DetailViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showCloseButton?: boolean;
  footerContent?: React.ReactNode;
}

export function DetailViewModal({
  isOpen,
  onClose,
  title,
  description,
  className,
  children,
  size = "md",
  showCloseButton = true,
  footerContent,
}: DetailViewModalProps) {
  const isMobile = useIsMobile();

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-2xl",
    xl: "!w-[72rem] !max-w-[90vw]", // Important modifiers to override defaults
    full: "!w-full !max-w-none",
  };

  // Handle the modal closing properly
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent
        className={cn(
          size === "full"
            ? "!w-full !max-w-none"
            : isMobile
            ? "w-[calc(100%-2rem)] mx-auto"
            : sizeClasses[size],
          "max-h-[90vh] sm:max-h-[85vh] flex flex-col overflow-hidden p-0 pointer-events-auto",
          className
        )}
      >
        <DialogHeader className="p-4 sm:p-4 bg-muted/30 border-b">
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-lg font-semibold">
                {title}
              </DialogTitle>
              {description && (
                <DialogDescription className="mt-1 text-sm">
                  {description}
                </DialogDescription>
              )}
            </div>
            {showCloseButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="h-8 w-8 rounded-full"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            )}
          </div>
        </DialogHeader>
        {/* Make content scrollable with custom scrollbar */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-4 pointer-events-auto">
          <div className="space-y-4">{children}</div>
        </div>
        {footerContent && (
          <div className="p-4 sm:p-4 border-t flex justify-end gap-2 bg-muted/20">
            {footerContent}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
