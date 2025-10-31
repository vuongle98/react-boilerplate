import React, { useState, useEffect } from "react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { ThemeToggle } from "@/shared/ui/theme-toggle";
import { Skeleton } from "@/shared/ui/skeleton";
import { LoadingSpinner } from "@/shared/components/loading";
import { FadeUp, SlideUp, Scale, Bounce } from "@/shared/ui/animate";
import { Bot, Database, Home as HomeIcon, Settings } from "lucide-react";
import { Link } from "react-router-dom";

export const Home = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading for demo purposes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // 1.5 seconds loading simulation

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="section-spacing space-y-8">
          <FadeUp delay={50}>
            <div className="flex flex-col gap-4">
              <div className="flex justify-end">
                <ThemeToggle />
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-10 w-96" />
                <Skeleton className="h-6 w-80" />
              </div>
            </div>
          </FadeUp>

          <Scale delay={150} className="grid element-spacing gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Bounce key={i} delay={200 + (i - 1) * 50}>
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-5" />
                      <Skeleton className="h-6 w-32" />
                    </div>
                    <Skeleton className="h-4 w-full mt-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              </Bounce>
            ))}
          </Scale>

          <SlideUp delay={400}>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          </SlideUp>
        </div>
        <div className="flex justify-center mt-8">
          <LoadingSpinner text="Loading application..." />
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="section-spacing space-y-8">
        <FadeUp delay={50}>
          <div className="flex flex-col gap-4">
            <div className="flex justify-end">
              <ThemeToggle />
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                Welcome to React Boilerplate
              </h1>
              <p className="text-lg text-neutral-600 dark:text-neutral-400">
                A modern, feature-based React application with best practices
              </p>
            </div>
          </div>
        </FadeUp>

      <Scale delay={150} className="grid element-spacing gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* Bots Sample */}
        <Bounce delay={200}>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                <CardTitle>Bots Management</CardTitle>
              </div>
              <CardDescription>
                Complete CRUD example with pagination, filters, and cache management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/bots">
                <Button className="w-full">
                  View Bots Example
                </Button>
              </Link>
            </CardContent>
          </Card>
        </Bounce>

        {/* Feature Structure */}
        <Bounce delay={250}>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                <CardTitle>Feature-Based Architecture</CardTitle>
              </div>
              <CardDescription>
                Organized by features with co-located components, hooks, and services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                ✓ Auth Feature<br />
                ✓ Bots Feature (Sample)<br />
                ✓ Shared Components<br />
                ✓ Type Safety
              </p>
              <div className="mt-4">
                <Link to="/components">
                  <Button variant="secondary" size="sm" className="w-full">
                    View Components Demo
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </Bounce>

        {/* Best Practices */}
        <Bounce delay={300}>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                <CardTitle>Modern Tooling</CardTitle>
            </div>
            <CardDescription>
              Built with industry-standard tools and libraries
            </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                ✓ React Query (Caching)<br />
                ✓ Tailwind CSS<br />
                ✓ shadcn/ui Components<br />
                ✓ TypeScript
              </p>
            </CardContent>
          </Card>
        </Bounce>
      </Scale>

      {/* Quick Links */}
      <SlideUp delay={400}>
        <Card>
          <CardHeader>
            <CardTitle>Quick Start Guide</CardTitle>
            <CardDescription>
              Key features and documentation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">📦 Structure</h3>
                <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
                  <li>• <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded text-neutral-700 dark:text-neutral-300">app/</code> - Application setup</li>
                  <li>• <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded text-neutral-700 dark:text-neutral-300">features/</code> - Feature modules</li>
                  <li>• <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded text-neutral-700 dark:text-neutral-300">shared/</code> - Reusable code</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">🚀 Features</h3>
                <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
                  <li>• Authentication (Keycloak)</li>
                  <li>• Smart Caching</li>
                  <li>• Pagination & Filters</li>
                  <li>• Dark Mode Support</li>
                </ul>
              </div>
            </div>
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                📚 Check <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded text-neutral-700 dark:text-neutral-300">PROJECT_STRUCTURE.md</code> for detailed documentation
              </p>
            </div>
          </CardContent>
        </Card>
      </SlideUp>
      </div>
    </div>
  );
};
