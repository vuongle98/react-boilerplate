import React from "react";
import { Button } from "@/shared/ui/button";
import { useNavigate } from "react-router-dom";
import { Section, SectionHeader } from "@/features/landing";
import { FadeUp } from "@/shared/ui/animate";
import { Home } from "lucide-react";
import { Toaster } from "@/shared/ui/toaster";
import {
  ButtonsSection,
  InputsSection,
  SelectsSection,
  TablesSection,
  ModalsSection,
  FormControlsSection,
  TextAreasSection,
  AlertsSection,
  TabsSection,
  NavigationSection,
  LoadingSection,
  ToastSection,
  DesignSystemSection
} from "@/features/components-demo/components";

export const ComponentsDemo = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <Section className="pt-20 pb-16">
        <FadeUp delay={50}>
          <div className="space-y-8">
            <div className="flex justify-start">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/')}
                className="gap-2"
                iconLeft={<Home className="h-4 w-4" />}
              >
                Back to Home
              </Button>
            </div>
            <SectionHeader
              title="Design System Components"
              subtitle="A comprehensive showcase of our enhanced UI components with consistent design language, accessibility, and modern interactions."
            />
          </div>
        </FadeUp>
      </Section>

      <ButtonsSection />

      <InputsSection />

      <SelectsSection />

      <TablesSection />

      <ModalsSection />
      <FormControlsSection />

      <TextAreasSection />
      <AlertsSection />

      <TabsSection />
      <NavigationSection />
      <LoadingSection />
      <ToastSection />
      <DesignSystemSection />
      <Toaster />
    </div>
  );
};
