import React, { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { FadeUp } from "@/shared/ui/animate";
import { Section } from "@/features/landing";
import { Checkbox } from "@/shared/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";
import { Switch } from "@/shared/ui/switch";
import { Settings } from "lucide-react";

export const FormControlsSection: React.FC = () => {
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [radioValue, setRadioValue] = useState("option1");
  const [switchValue, setSwitchValue] = useState(false);

  return (
    <Section background="neutral">
      <FadeUp delay={550}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Form Controls
            </CardTitle>
            <CardDescription>
              Interactive form controls including checkboxes, radio buttons, and switches
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Checkboxes */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Checkboxes</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={checkboxValue}
                      onCheckedChange={(checked) => setCheckboxValue(checked === true)}
                    />
                    <label htmlFor="terms" className="text-sm font-medium">
                      Accept terms and conditions
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="newsletter" />
                    <label htmlFor="newsletter" className="text-sm font-medium">
                      Subscribe to newsletter
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="marketing" defaultChecked />
                    <label htmlFor="marketing" className="text-sm font-medium">
                      Receive marketing emails
                    </label>
                  </div>
                </div>
              </div>

              {/* Radio Group */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Radio Buttons</h3>
                <RadioGroup value={radioValue} onValueChange={setRadioValue}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option1" id="r1" />
                    <label htmlFor="r1" className="text-sm font-medium">Option 1</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option2" id="r2" />
                    <label htmlFor="r2" className="text-sm font-medium">Option 2</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option3" id="r3" />
                    <label htmlFor="r3" className="text-sm font-medium">Option 3</label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Switches */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Switches</h3>
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="notifications"
                    checked={switchValue}
                    onCheckedChange={(checked) => setSwitchValue(checked === true)}
                  />
                  <label htmlFor="notifications" className="text-sm font-medium">
                    Enable notifications
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="dark-mode" />
                  <label htmlFor="dark-mode" className="text-sm font-medium">
                    Dark mode
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="auto-save" defaultChecked />
                  <label htmlFor="auto-save" className="text-sm font-medium">
                    Auto-save
                  </label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </FadeUp>
    </Section>
  );
};
