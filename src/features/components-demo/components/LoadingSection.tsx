import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { SlideUp } from "@/shared/ui/animate";
import { Section } from "@/features/landing";
import { Skeleton } from "@/shared/ui/skeleton";
import { Settings } from "lucide-react";

export const LoadingSection: React.FC = () => {
  return (
    <Section>
      <SlideUp delay={800}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Loading States
            </CardTitle>
            <CardDescription>
              Skeleton loaders and loading indicators
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full max-w-[250px]" />
                  <Skeleton className="h-4 w-full max-w-[200px]" />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full max-w-[300px]" />
                  <Skeleton className="h-4 w-full max-w-[250px]" />
                  <Skeleton className="h-4 w-full max-w-[200px]" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </CardContent>
        </Card>
      </SlideUp>
    </Section>
  );
};
