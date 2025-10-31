import { SidebarProvider } from "@/shared/ui/sidebar";
import { ReactNode } from "react";

interface AuthenticatedLayoutProps {
  children: ReactNode;
}

export const AuthenticatedLayout = ({ children }: AuthenticatedLayoutProps) => {
  return (
    <SidebarProvider>
      <main className="flex-1 py-4 px-2 sm:py-6 sm:px-4 md:py-8 md:px-6">{children}</main>
    </SidebarProvider>
  );
};
