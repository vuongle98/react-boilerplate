import { Button } from "@/shared/ui/button";

interface ServiceErrorProps {
  type: "not-found" | "invalid-config" | "incomplete-config" | "invalid-operations" | "missing-base-url";
  serviceCode?: string;
  onBack: () => void;
}

export function ServiceError({ type, serviceCode, onBack }: ServiceErrorProps) {
  const getErrorContent = () => {
    switch (type) {
      case "not-found":
        return {
          title: "Service Not Found",
          description: `The service "${serviceCode}" could not be found or is not configured.`,
        };
      case "invalid-config":
        return {
          title: "Invalid Service Configuration",
          description: `The service "${serviceCode}" is missing required fields configuration.`,
        };
      case "incomplete-config":
        return {
          title: "Incomplete Service Configuration",
          description: `The service "${serviceCode}" is missing required display name or operations configuration.`,
        };
      case "invalid-operations":
        return {
          title: "Invalid Operations Configuration",
          description: `The service "${serviceCode}" is missing required list operation configuration.`,
        };
      case "missing-base-url":
        return {
          title: "Missing Base URL",
          description: `The service "${serviceCode}" is missing required base URL configuration.`,
        };
      default:
        return {
          title: "Configuration Error",
          description: "There was an error with the service configuration.",
        };
    }
  };

  const { title, description } = getErrorContent();

  return (
    <div className="page-container">
      <div className="section-spacing">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold tracking-tight mb-4">{title}</h1>
          <p className="text-muted-foreground mb-6">{description}</p>
          <Button onClick={onBack}>Back to Admin Dashboard</Button>
        </div>
      </div>
    </div>
  );
}
