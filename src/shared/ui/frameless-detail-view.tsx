import { Dialog, DialogContent, DialogTitle } from "@/shared/ui/dialog";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { cn } from "@/shared/lib/utils";
import React from "react";

interface FramelessDetailViewModalProps {
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

export function FramelessDetailViewModal({
  isOpen,
  onClose,
  title,
  description,
  className,
  children,
  size = "md",
  showCloseButton = true,
  footerContent,
}: FramelessDetailViewModalProps) {
  const isMobile = useIsMobile();

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: isMobile
      ? "w-[calc(100%-2rem)] max-w-[calc(100%-2rem)]"
      : "max-w-screen-lg",
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
      <DialogTitle />
      <DialogContent
        className={cn(
          isMobile ? "w-[calc(100%-2rem)] mx-auto" : sizeClasses[size],
          "max-h-[90vh] sm:max-h-[85vh] flex flex-col overflow-hidden p-0", // Keep overflow-hidden for the container
          className
        )}
      >
        {/* Make ScrollArea scrollable */}
        <ScrollArea className="flex-1 p-4 sm:p-4 overflow-y-auto">
          <div className="space-y-4">{children}</div>
        </ScrollArea>
        {footerContent && (
          <div className="p-4 sm:p-4 border-t flex flex-col sm:flex-row sm:justify-end gap-2 bg-muted/20">
            {footerContent}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
