import { ServiceConfig } from "@/shared/types/generic-dashboard";
import { FadeUp, SlideUp } from "@/shared/ui/animate";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Database, ExternalLink, Settings, Zap } from "lucide-react";
import { useTheme } from "@/app/providers/ThemeProvider";

interface ServicesGridProps {
  services: ServiceConfig[];
  onViewService: (service: ServiceConfig) => void;
  onEditService: (service: ServiceConfig) => void;
  onTestService: (service: ServiceConfig) => void;
}

export function ServicesGrid({
  services,
  onViewService,
  onEditService,
  onTestService,
}: ServicesGridProps) {
  const { glassEffect } = useTheme();
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {services.map((serviceConfig, index) => (
        <SlideUp
          key={serviceConfig.id}
          delay={100 + index * 75} // Staggered animation with increasing delay
          className="h-full"
        >
          <Card 
            className="hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border-2 hover:border-primary/20 h-full"
            data-glass={glassEffect ? "true" : undefined}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border">
                    <Database className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg line-clamp-1">
                      {serviceConfig.displayName}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <Badge variant="success" className="text-xs">
                        <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
                        Active
                      </Badge>
                    </div>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="text-xs bg-muted/50 hover:bg-muted transition-colors"
                >
                  {serviceConfig.category || "General"}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col">
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                {serviceConfig.description || "No description provided"}
              </p>

              <div className="flex items-center justify-between text-sm mb-4">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Database className="h-3 w-3" />
                    {serviceConfig.fields?.length || 0} fields
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Zap className="h-3 w-3" />
                    {
                      Object.values(serviceConfig.features || {}).filter(
                        Boolean
                      ).length
                    }{" "}
                    features
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewService(serviceConfig)}
                  className="flex-1 gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                  iconLeft={<ExternalLink />}
                >
                  View Dashboard
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditService(serviceConfig)}
                  className="gap-2 hover:bg-muted"
                >
                  <Settings className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onTestService(serviceConfig)}
                  className="hover:bg-blue-50 hover:border-blue-200"
                >
                  <Zap className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </SlideUp>
      ))}
    </div>
  );
}
