import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Switch } from "@/shared/ui/switch";
import { SlideUp } from "@/shared/ui/animate";
import { Section } from "@/features/landing";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/ui/accordion";
import { Settings, Info } from "lucide-react";

export const TabsSection: React.FC = () => {
  return (
    <Section background="neutral">
      <SlideUp delay={700}>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Tabs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Tabs
              </CardTitle>
              <CardDescription>
                Tabbed interface for organizing content into separate sections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="account" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="account">Account</TabsTrigger>
                  <TabsTrigger value="password">Password</TabsTrigger>
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                </TabsList>
                <TabsContent value="account" className="space-y-4">
                  <Input label="Full Name" placeholder="John Doe" />
                  <Input label="Email" type="email" placeholder="john@example.com" />
                  <Button>Update Account</Button>
                </TabsContent>
                <TabsContent value="password" className="space-y-4">
                  <Input label="Current Password" type="password" />
                  <Input label="New Password" type="password" />
                  <Input label="Confirm Password" type="password" />
                  <Button>Change Password</Button>
                </TabsContent>
                <TabsContent value="notifications" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Email notifications</label>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Push notifications</label>
                    <Switch defaultChecked />
                  </div>
                  <Button>Save Preferences</Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Accordions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Accordions
              </CardTitle>
              <CardDescription>
                Collapsible content sections for organizing information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>What is this project about?</AccordionTrigger>
                  <AccordionContent>
                    This is a comprehensive React component library with a modern design system,
                    featuring accessibility, dark mode support, and consistent styling.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>How do I get started?</AccordionTrigger>
                  <AccordionContent>
                    Simply import the components you need and start using them in your React application.
                    All components follow consistent APIs and include TypeScript support.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Is dark mode supported?</AccordionTrigger>
                  <AccordionContent>
                    Yes! All components automatically support dark mode through Tailwind CSS classes
                    and can be customized through the theme provider.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </SlideUp>
    </Section>
  );
};
