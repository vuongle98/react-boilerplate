import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Bounce } from "@/shared/ui/animate";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color?: string;
  delay?: number;
  className?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  color = "text-primary",
  delay = 200,
  className = ""
}) => {
  return (
    <Bounce delay={delay}>
      <Card className={`h-full group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white dark:bg-neutral-800 hover:-translate-y-1 ${className}`}>
        <CardHeader className="pb-4">
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 ${color}`}>
            {icon}
          </div>
          <CardTitle className="text-xl font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
          <CardDescription className="text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="w-full h-1 bg-gradient-to-r from-primary/20 to-primary/5 rounded-full group-hover:from-primary/40 group-hover:to-primary/10 transition-all duration-300"></div>
        </CardContent>
      </Card>
    </Bounce>
  );
};
