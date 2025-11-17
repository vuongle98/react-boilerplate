import React from "react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { FadeUp, SlideUp } from "@/shared/ui/animate";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

interface HeroSectionProps {
  badgeText?: string;
  title: string;
  subtitle: string;
  primaryButton: {
    text: string;
    to: string;
    icon?: React.ReactNode;
  };
  secondaryButton: {
    text: string;
    to: string;
  };
  tertiaryButton?: {
    text: string;
    to: string;
  };
  stats?: Array<{
    value: string;
    label: string;
    icon?: React.ReactNode;
  }>;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  badgeText = "Modern React Boilerplate",
  title,
  subtitle,
  primaryButton,
  secondaryButton,
  tertiaryButton,
  stats
}) => {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeUp delay={50}>
          <div className="text-center space-y-8">
            <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
              <Sparkles className="h-4 w-4 mr-2" />
              {badgeText}
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 leading-tight">
              {title.includes("React Applications") ? (
                <>
                  Build Better
                  <span className="block text-primary mt-2">React Applications</span>
                </>
              ) : (
                title
              )}
            </h1>

            <p className="text-xl sm:text-2xl text-neutral-600 dark:text-neutral-400 max-w-4xl mx-auto leading-relaxed">
              {subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Button size="lg" className="px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-shadow" asChild>
                <Link to={primaryButton.to} className="inline-flex items-center gap-2">
                  {primaryButton.text}
                  {primaryButton.icon || <ArrowRight className="h-5 w-5" />}
                </Link>
              </Button>
              <Button size="lg" variant="secondary" className="px-8 py-4 text-lg font-semibold" asChild>
                <Link to={secondaryButton.to}>
                  {secondaryButton.text}
                </Link>
              </Button>
              {tertiaryButton && (
                <Button size="lg" variant="outline" className="px-8 py-4 text-lg font-semibold" asChild>
                  <Link to={tertiaryButton.to}>
                    {tertiaryButton.text}
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </FadeUp>

        {stats && stats.length > 0 && (
          <SlideUp delay={200} className="mt-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="flex items-center justify-center mb-3 p-3 rounded-full bg-white dark:bg-neutral-800 shadow-sm group-hover:shadow-md transition-shadow">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </SlideUp>
        )}
      </div>

      {/* Background decorations */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/3 to-blue-500/3 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
};
