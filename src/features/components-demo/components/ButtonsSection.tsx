import React from "react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { SlideUp } from "@/shared/ui/animate";
import { Section } from "@/features/landing";
import {
  Settings,
  Plus,
  Download,
  Edit,
  Trash2,
  Bell
} from "lucide-react";

export const ButtonsSection: React.FC = () => {
  return (
    <Section background="neutral">
      <SlideUp delay={100}>
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Buttons
            </CardTitle>
            <CardDescription>
              Interactive buttons with multiple variants, sizes, and states
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Variants */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Variants</h3>
              <div className="flex flex-wrap gap-3">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="success">Success</Button>
              </div>
            </div>

            {/* Sizes */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Sizes</h3>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="xs">Extra Small</Button>
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
                <Button size="xl">Extra Large</Button>
              </div>
            </div>

            {/* With Icons */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">With Icons</h3>
              <div className="flex flex-wrap gap-3">
                <Button iconLeft={<Plus className="h-4 w-4" />}>Add Item</Button>
                <Button iconRight={<Download className="h-4 w-4" />}>Download</Button>
                <Button variant="ghost" iconLeft={<Edit className="h-4 w-4" />}>Edit</Button>
                <Button variant="danger" iconLeft={<Trash2 className="h-4 w-4" />}>Delete</Button>
              </div>
            </div>

            {/* States */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">States</h3>
              <div className="flex flex-wrap gap-3">
                <Button loading loadingText="Saving...">Normal</Button>
                <Button disabled>Disabled</Button>
                <Button variant="ghost" size="icon">
                  <Bell className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </SlideUp>
    </Section>
  );
};
