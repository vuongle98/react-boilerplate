import React, { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { FadeUp } from "@/shared/ui/animate";
import { Section } from "@/features/landing";
import { User, Mail, Lock, Search } from "lucide-react";

export const InputsSection: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Section>
      <FadeUp delay={200}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Form Inputs
            </CardTitle>
            <CardDescription>
              Input fields with validation, icons, and accessibility features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Basic Inputs */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Basic Inputs</h3>
                <Input
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email"
                  startAdornment={<Mail className="h-4 w-4" />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  startAdornment={<Lock className="h-4 w-4" />}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Input Variants */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Input Variants</h3>
                <Input
                  label="Search"
                  placeholder="Search for items..."
                  startAdornment={<Search className="h-4 w-4" />}
                  endAdornment={<Button variant="ghost" size="sm">Search</Button>}
                />
                <Input
                  label="Username"
                  placeholder="Choose a username"
                  helperText="This will be your public display name"
                />
                <Input
                  label="Error Example"
                  placeholder="This field has an error"
                  error="This field is required"
                  readOnly
                  value=""
                />
                <Input
                  label="Disabled Input"
                  placeholder="This field is disabled"
                  disabled
                  readOnly
                  value="Disabled content"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </FadeUp>
    </Section>
  );
};
