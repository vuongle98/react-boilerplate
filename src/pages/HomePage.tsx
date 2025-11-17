import {
  CTASection,
  FeatureCard,
  HeroSection,
  Section,
  SectionHeader,
} from "@/features/landing";
import { DataTable } from "@/shared/components/data-display/DataTable";
import { FadeUp, SlideUp } from "@/shared/ui/animate";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { ThemeToggle } from "@/shared/ui/theme-toggle";
import {
  BarChart3,
  Bot,
  CheckCircle,
  Code,
  Database,
  Edit,
  Eye,
  Globe,
  Layers,
  Shield,
  Smartphone,
  Star,
  Trash2,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

export const HomePage = () => {
  const features = [
    {
      icon: <Bot className="h-6 w-6" />,
      title: "Bot Management",
      description:
        "Complete CRUD operations with advanced filtering, pagination, and real-time updates",
      color: "text-blue-500",
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: "Smart Caching",
      description:
        "Intelligent data caching with React Query for optimal performance",
      color: "text-green-500",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Authentication",
      description:
        "Secure Keycloak integration with protected routes and role-based access",
      color: "text-purple-500",
    },
    {
      icon: <Layers className="h-6 w-6" />,
      title: "Component Library",
      description:
        "Comprehensive shadcn/ui components with dark mode and accessibility",
      color: "text-orange-500",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Modern Architecture",
      description:
        "Feature-based structure with TypeScript, clean separation of concerns",
      color: "text-yellow-500",
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Data Visualization",
      description:
        "Rich tables, charts, and interactive data displays with loading states",
      color: "text-red-500",
    },
  ];

  const stats = [
    { label: "Components", value: "50+", icon: <Layers className="h-4 w-4" /> },
    { label: "TypeScript", value: "100%", icon: <Code className="h-4 w-4" /> },
    {
      label: "Responsive",
      value: "Mobile-first",
      icon: <Smartphone className="h-4 w-4" />,
    },
    {
      label: "Performance",
      value: "Optimized",
      icon: <Zap className="h-4 w-4" />,
    },
  ];

  // Mock table data
  const tableData = [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      role: "Admin",
      status: "Active",
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob@example.com",
      role: "User",
      status: "Inactive",
    },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie@example.com",
      role: "Editor",
      status: "Active",
    },
    {
      id: 4,
      name: "Diana Prince",
      email: "diana@example.com",
      role: "User",
      status: "Active",
    },
    {
      id: 5,
      name: "Eve Wilson",
      email: "eve@example.com",
      role: "Admin",
      status: "Pending",
    },
  ];

  return (
    <div className="min-h-screen relative">
      {/* Theme Toggle - Floating Action Button */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle variant="secondary" showSettings={true} />
      </div>

      {/* Hero Section */}
      <HeroSection
        title="Build Better React Applications"
        subtitle="A feature-rich, production-ready React boilerplate with modern tooling, comprehensive component library, and best practices built-in."
        primaryButton={{
          text: "View Demo",
          to: "/bots",
        }}
        secondaryButton={{
          text: "Explore Components",
          to: "/components",
        }}
        tertiaryButton={{
          text: "Admin Panel",
          to: "/admin",
        }}
        stats={stats}
      />

      {/* Features Section */}
      <Section background="white">
        <SectionHeader
          title="Everything You Need"
          subtitle="Built with modern technologies and best practices for scalable, maintainable applications"
        />

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              color={feature.color}
              delay={200 + index * 50}
            />
          ))}
        </div>
      </Section>

      {/* Layout Demo Section */}
      <Section background="neutral">
        <SectionHeader
          title="Layout Patterns"
          subtitle="Consistent design system with responsive layouts and smooth animations"
        />

        <div className="space-y-12">
          {/* Card Layout Demo */}
          <SlideUp delay={200}>
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 text-center">
                Card-Based Layouts
              </h3>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                          <Star className="h-4 w-4 text-primary" />
                        </div>
                        <CardTitle>Feature {i}</CardTitle>
                      </div>
                      <CardDescription>
                        Clean, accessible card components with hover effects and
                        proper spacing.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button size="sm" variant="secondary">
                        Learn More
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </SlideUp>

          {/* Table Layout Demo */}
          <FadeUp delay={300}>
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 text-center">
                Data Tables & Forms
              </h3>
              <Card className="bg-white dark:bg-neutral-900">
                <CardHeader>
                  <CardTitle>Modern Data Display</CardTitle>
                  <CardDescription>
                    Responsive tables with loading states, pagination, and
                    interactive elements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DataTable
                    data={tableData}
                    columns={[
                      { key: "name", label: "Name", className: "font-medium" },
                      { key: "email", label: "Email" },
                      {
                        key: "role",
                        label: "Role",
                        render: (value) => (
                          <Badge
                            variant={
                              value === "Admin" ? "default" : "secondary"
                            }
                          >
                            {value}
                          </Badge>
                        ),
                      },
                      {
                        key: "status",
                        label: "Status",
                        render: (value) => (
                          <Badge
                            variant={
                              value === "Active"
                                ? "success"
                                : value === "Inactive"
                                ? "secondary"
                                : "warning"
                            }
                          >
                            {value}
                          </Badge>
                        ),
                      },
                    ]}
                    actions={[
                      {
                        label: "View",
                        icon: Eye,
                        onClick: (item) => console.log("View", item),
                      },
                      {
                        label: "Edit",
                        icon: Edit,
                        onClick: (item) => console.log("Edit", item),
                      },
                      {
                        label: "Delete",
                        icon: Trash2,
                        variant: "destructive",
                        onClick: (item) => console.log("Delete", item),
                      },
                    ]}
                    showPagination={true}
                    page={0}
                    pageSize={5}
                    totalItems={tableData.length}
                    totalPages={Math.ceil(tableData.length / 5)}
                    onPageChange={(page) => console.log("Page change:", page)}
                    onPageSizeChange={(size) =>
                      console.log("Page size change:", size)
                    }
                  />
                </CardContent>
              </Card>
            </div>
          </FadeUp>
        </div>
      </Section>

      {/* CTA Section */}
      <CTASection
        title="Ready to Build Something Amazing?"
        subtitle="Start with our production-ready boilerplate and focus on what matters most - your application logic."
        primaryButton={{
          text: "Explore Live Demo",
          to: "/bots",
        }}
        secondaryButton={{
          text: "View Components",
          to: "/components",
        }}
        tertiaryButton={{
          text: "Admin Panel",
          to: "/admin",
        }}
        background="gradient"
      />

      {/* Footer */}
      <footer className="py-12 bg-neutral-900 text-neutral-300">
        <div className="page-container">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Globe className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold text-white">
                  React Boilerplate
                </span>
              </div>
              <p className="text-sm">
                A modern, feature-rich React application boilerplate built with
                best practices and cutting-edge technologies.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-semibold">Navigation</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/bots"
                    className="hover:text-white transition-colors"
                  >
                    Bots Demo
                  </Link>
                </li>
                <li>
                  <Link
                    to="/components"
                    className="hover:text-white transition-colors"
                  >
                    Components
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin"
                    className="hover:text-white transition-colors"
                  >
                    Admin Panel
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-semibold">Features</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  TypeScript Support
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Dark Mode
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Responsive Design
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Authentication
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-semibold">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs">
                  React
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  TypeScript
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Tailwind
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Vite
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  shadcn/ui
                </Badge>
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-700 mt-8 pt-8 text-center text-sm">
            <p>
              &copy; 2024 React Boilerplate. Built with modern web technologies.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
