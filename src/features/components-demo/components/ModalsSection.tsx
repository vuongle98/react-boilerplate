import React from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { SlideUp } from "@/shared/ui/animate";
import { Section } from "@/features/landing";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Info, Plus, CheckCircle } from "lucide-react";

export const ModalsSection: React.FC = () => {
  return (
    <Section>
      <SlideUp delay={500}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Modal Dialog
            </CardTitle>
            <CardDescription>
              Modal with backdrop blur, smooth animations, and accessibility features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" iconLeft={<Plus className="h-5 w-5" />}>
                  Open Modal
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[90vw] max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Item</DialogTitle>
                  <DialogDescription>
                    Add a new item to your collection. Fill in the details below.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Input label="Name" placeholder="Enter item name" />
                  <Input label="Description" placeholder="Enter description" />
                  <Select>
                    <SelectTrigger placeholder="Select category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="work">Work</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="ghost">Cancel</Button>
                  <Button iconLeft={<CheckCircle className="h-4 w-4" />}>
                    Create Item
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </SlideUp>
    </Section>
  );
};
