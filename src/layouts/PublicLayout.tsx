import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface PublicLayoutProps {
  children?: ReactNode;
}

export const PublicLayout = ({ children }: PublicLayoutProps) => {
  // Use children if provided, otherwise use Outlet for nested routes
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">{children}</main>
      <footer className="bg-background border-t py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Boilerplate App. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
