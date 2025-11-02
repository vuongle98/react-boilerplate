import React from "react";
import { FadeUp } from "@/shared/ui/animate";

interface SectionProps {
  id?: string;
  className?: string;
  containerClassName?: string;
  background?: "white" | "neutral" | "primary" | "gradient";
  padding?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({
  id,
  className = "",
  containerClassName = "",
  background = "white",
  padding = "lg",
  children
}) => {
  const backgroundClasses = {
    white: "bg-white dark:bg-neutral-900",
    neutral: "bg-neutral-50 dark:bg-neutral-800",
    primary: "bg-primary text-primary-foreground",
    gradient: "bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900"
  };

  const paddingClasses = {
    sm: "py-12 lg:py-16",
    md: "py-16 lg:py-20",
    lg: "py-20 lg:py-24",
    xl: "py-24 lg:py-32"
  };

  return (
    <section
      id={id}
      className={`relative ${backgroundClasses[background]} ${paddingClasses[padding]} ${className}`}
    >
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${containerClassName}`}>
        {children}
      </div>
    </section>
  );
};

interface SectionHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badge,
  title,
  subtitle,
  align = "center",
  className = ""
}) => {
  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right"
  };

  return (
    <FadeUp delay={100} className={`space-y-6 mb-16 ${alignClasses[align]} ${className}`}>
      {badge && (
        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
          {badge}
        </div>
      )}

      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 leading-tight">
        {title}
      </h2>

      {subtitle && (
        <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </FadeUp>
  );
};
