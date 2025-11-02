import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { FadeUp } from "@/shared/ui/animate";
import { Section } from "@/features/landing";
import { useToast } from "@/shared/ui/use-toast";
import { Bell } from "lucide-react";

export const ToastSection: React.FC = () => {
  const { toast } = useToast();

  return (
    <Section background="neutral">
      <FadeUp delay={850}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Toast Notifications
            </CardTitle>
            <CardDescription>
              Non-intrusive notifications that appear temporarily
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button
                variant="secondary"
                onClick={() =>
                  toast({
                    title: "Success!",
                    description: "Your changes have been saved successfully.",
                    variant: "success",
                  })
                }
              >
                Show Success Toast
              </Button>
              <Button
                variant="secondary"
                onClick={() =>
                  toast({
                    title: "Error",
                    description: "Something went wrong. Please try again.",
                    variant: "destructive",
                  })
                }
              >
                Show Error Toast
              </Button>
              <Button
                variant="secondary"
                onClick={() =>
                  toast({
                    title: "Information",
                    description: "Here's some important information for you.",
                    variant: "info",
                  })
                }
              >
                Show Info Toast
              </Button>
              <Button
                variant="secondary"
                onClick={() =>
                  toast({
                    title: "Warning",
                    description: "Please review your input before proceeding.",
                    variant: "warning",
                  })
                }
              >
                Show Warning Toast
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Click any button above to see the toast notifications in action.
              They appear in the top-right corner and auto-dismiss after a few seconds.
            </p>
          </CardContent>
        </Card>
      </FadeUp>
    </Section>
  );
};
