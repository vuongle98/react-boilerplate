import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { SlideUp } from "@/shared/ui/animate";
import { Section } from "@/features/landing";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Settings, Info, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Badge } from "@/shared/ui/badge";

export const SelectsSection: React.FC = () => {
  const [selectedValue, setSelectedValue] = useState("option1");

  return (
    <Section background="neutral">
      <SlideUp delay={300}>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Select Component */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Select Dropdown
              </CardTitle>
              <CardDescription>
                Enhanced select component with better styling and accessibility
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedValue} onValueChange={setSelectedValue}>
                <SelectTrigger placeholder="Choose an option">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Options</SelectLabel>
                    <SelectItem value="option1">Option 1</SelectItem>
                    <SelectItem value="option2">Option 2</SelectItem>
                    <SelectItem value="option3">Option 3</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Advanced</SelectLabel>
                    <SelectItem value="option4">Advanced Option 1</SelectItem>
                    <SelectItem value="option5">Advanced Option 2</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger placeholder="Select role" size="lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Badges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Status Badges
              </CardTitle>
              <CardDescription>
                Color-coded status indicators and labels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Error</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Task completed</span>
                  <Badge variant="success">Done</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Payment failed</span>
                  <Badge variant="destructive">Failed</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Update available</span>
                  <Badge variant="warning">Pending</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SlideUp>
    </Section>
  );
};
