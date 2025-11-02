import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { SlideUp } from "@/shared/ui/animate";
import { Section } from "@/features/landing";
import { Textarea } from "@/shared/ui/textarea";
import { Progress } from "@/shared/ui/progress";
import { Edit, Info } from "lucide-react";

export const TextAreasSection: React.FC = () => {
  const [textareaValue, setTextareaValue] = useState("");
  const [progressValue, setProgressValue] = useState(65);

  return (
    <Section>
      <SlideUp delay={600}>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Textarea */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Textarea
              </CardTitle>
              <CardDescription>
                Multi-line text input with character counting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                label="Message"
                placeholder="Write your message here..."
                value={textareaValue}
                onChange={(e) => setTextareaValue(e.target.value)}
                helperText={`${textareaValue.length}/500 characters`}
              />
              <Textarea
                label="Comments"
                placeholder="Add your comments..."
                rows={3}
              />
            </CardContent>
          </Card>

          {/* Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Progress Indicators
              </CardTitle>
              <CardDescription>
                Visual progress bars for loading states and completion tracking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Upload Progress</span>
                  <span>{progressValue}%</span>
                </div>
                <Progress value={progressValue} className="w-full" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Loading...</span>
                  <span>75%</span>
                </div>
                <Progress value={75} className="w-full" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Complete</span>
                  <span>100%</span>
                </div>
                <Progress value={100} className="w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </SlideUp>
    </Section>
  );
};
