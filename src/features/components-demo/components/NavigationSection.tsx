import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { FadeUp } from "@/shared/ui/animate";
import { Section } from "@/features/landing";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/shared/ui/breadcrumb";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/shared/ui/pagination";
import { Settings, User } from "lucide-react";

export const NavigationSection: React.FC = () => {
  return (
    <Section>
      <FadeUp delay={750}>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Avatars */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Avatars
              </CardTitle>
              <CardDescription>
                User profile images and fallback initials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">shadcn</p>
                  <p className="text-xs text-muted-foreground">@shadcn</p>
                </div>
              </div>

              <div className="flex -space-x-2">
                <Avatar className="border-2 border-background">
                  <AvatarImage src="https://github.com/vercel.png" />
                  <AvatarFallback>VC</AvatarFallback>
                </Avatar>
                <Avatar className="border-2 border-background">
                  <AvatarImage src="https://github.com/nextjs.png" />
                  <AvatarFallback>NJ</AvatarFallback>
                </Avatar>
                <Avatar className="border-2 border-background">
                  <AvatarImage src="https://github.com/tailwindcss.png" />
                  <AvatarFallback>TW</AvatarFallback>
                </Avatar>
                <Avatar className="border-2 border-background">
                  <AvatarFallback>+3</AvatarFallback>
                </Avatar>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Avatar size="sm">
                  <AvatarFallback>SM</AvatarFallback>
                </Avatar>
                <Avatar size="md">
                  <AvatarFallback>MD</AvatarFallback>
                </Avatar>
                <Avatar size="lg">
                  <AvatarFallback>LG</AvatarFallback>
                </Avatar>
                <Avatar size="xl">
                  <AvatarFallback>XL</AvatarFallback>
                </Avatar>
              </div>
            </CardContent>
          </Card>

          {/* Breadcrumbs & Pagination */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Navigation
              </CardTitle>
              <CardDescription>
                Breadcrumbs and pagination for site navigation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Breadcrumbs */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Breadcrumbs</h4>
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/components">Components</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Demo</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>

              {/* Pagination */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Pagination</h4>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#" isActive>1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </CardContent>
          </Card>
        </div>
      </FadeUp>
    </Section>
  );
};
