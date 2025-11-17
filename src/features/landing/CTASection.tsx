import React from "react";
import { Button } from "@/shared/ui/button";
import { Scale } from "@/shared/ui/animate";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface CTASectionProps {
  title: string;
  subtitle: string;
  primaryButton: {
    text: string;
    to: string;
    icon?: React.ReactNode;
  };
  secondaryButton?: {
    text: string;
    to: string;
  };
  tertiaryButton?: {
    text: string;
    to: string;
  };
  background?: "primary" | "gradient";
  className?: string;
}

export const CTASection: React.FC<CTASectionProps> = ({
  title,
  subtitle,
  primaryButton,
  secondaryButton,
  tertiaryButton,
  background = "primary",
  className = ""
}) => {
  const backgroundClasses = {
    primary: "bg-primary text-primary-foreground",
    gradient: "bg-gradient-to-r from-primary via-primary/90 to-blue-600 text-white"
  };

  return (
    <section className={`py-20 lg:py-24 ${backgroundClasses[background]} ${className}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Scale delay={100}>
          <div className="space-y-8">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              {title}
            </h2>
            <p className="text-xl sm:text-2xl opacity-90 max-w-2xl mx-auto leading-relaxed">
              {subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button
                size="lg"
                variant="secondary"
                className={`px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 ${
                  background === "primary"
                    ? "bg-white text-primary hover:bg-neutral-50"
                    : "bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20"
                }`}
                asChild
              >
                <Link to={primaryButton.to} className="inline-flex items-center gap-2">
                  {primaryButton.text}
                  {primaryButton.icon || <ArrowRight className="h-5 w-5" />}
                </Link>
              </Button>
              {secondaryButton && (
                <Button
                  size="lg"
                  variant="outline"
                  className={`px-8 py-4 text-lg font-semibold border-2 ${
                    background === "primary"
                      ? "border-white/20 text-white hover:bg-white/10"
                      : "border-white/30 text-white hover:bg-white/10"
                  }`}
                  asChild
                >
                  <Link to={secondaryButton.to}>
                    {secondaryButton.text}
                  </Link>
                </Button>
              )}
              {tertiaryButton && (
                <Button
                  size="lg"
                  variant="ghost"
                  className={`px-8 py-4 text-lg font-semibold ${
                    background === "primary"
                      ? "text-primary-foreground hover:bg-white/10"
                      : "text-white hover:bg-white/10"
                  }`}
                  asChild
                >
                  <Link to={tertiaryButton.to}>
                    {tertiaryButton.text}
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </Scale>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-white/5 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
};
