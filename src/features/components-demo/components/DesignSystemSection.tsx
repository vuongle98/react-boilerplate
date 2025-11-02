import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { FadeUp } from "@/shared/ui/animate";
import { Section } from "@/features/landing";

export const DesignSystemSection: React.FC = () => {
  return (
    <Section>
      <FadeUp delay={950}>
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Design System Features</CardTitle>
            <CardDescription>
              Our comprehensive design system ensures consistency and reusability
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                  🎨 Design Language
                </h3>
                <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
                  <li>• Consistent color palette</li>
                  <li>• Typography scale</li>
                  <li>• Spacing system</li>
                  <li>• Shadow hierarchy</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                  ⚡ Component Features
                </h3>
                <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
                  <li>• Multiple variants & sizes</li>
                  <li>• Accessibility (ARIA)</li>
                  <li>• Dark mode support</li>
                  <li>• Smooth animations</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                  🛠️ Developer Experience
                </h3>
                <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
                  <li>• TypeScript support</li>
                  <li>• Consistent API</li>
                  <li>• CVA pattern</li>
                  <li>• Utility functions</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </FadeUp>
    </Section>
  );
};
