import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { FadeUp } from "@/shared/ui/animate";
import { Section } from "@/features/landing";
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert";
import { AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react";

export const AlertsSection: React.FC = () => {
  return (
    <Section>
      <FadeUp delay={650}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alert Notifications
            </CardTitle>
            <CardDescription>
              Different types of alert messages for user feedback and notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Information</AlertTitle>
              <AlertDescription>
                This is an informational message that provides context or additional details.
              </AlertDescription>
            </Alert>

            <Alert variant="success">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>
                Your changes have been saved successfully.
              </AlertDescription>
            </Alert>

            <Alert variant="warning">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                Please review your input before proceeding.
              </AlertDescription>
            </Alert>

            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Something went wrong. Please try again later.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </FadeUp>
    </Section>
  );
};
