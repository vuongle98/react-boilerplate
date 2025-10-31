import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { FadeUp, SlideUp, Scale, Bounce } from "@/shared/ui/animate";
import { Bot, Database, Home as HomeIcon, Settings } from "lucide-react";
import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <div className="space-y-8">
      <FadeUp delay={50}>
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold tracking-tight">Welcome to React Boilerplate</h1>
          <p className="text-lg text-muted-foreground">
            A modern, feature-based React application with best practices
          </p>
        </div>
      </FadeUp>

      <Scale delay={150} className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
                <h3 className="font-semibold">📦 Structure</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <code className="text-xs bg-muted px-1 py-0.5 rounded">app/</code> - Application setup</li>
                  <li>• <code className="text-xs bg-muted px-1 py-0.5 rounded">features/</code> - Feature modules</li>
                  <li>• <code className="text-xs bg-muted px-1 py-0.5 rounded">shared/</code> - Reusable code</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">🚀 Features</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Authentication (Keycloak)</li>
                  <li>• Smart Caching</li>
                  <li>• Pagination & Filters</li>
                  <li>• Dark Mode Support</li>
                </ul>
              </div>
            </div>
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                📚 Check <code className="text-xs bg-muted px-1 py-0.5 rounded">PROJECT_STRUCTURE.md</code> for detailed documentation
              </p>
            </div>
          </CardContent>
        </Card>
      </SlideUp>
    </div>
  );
};
