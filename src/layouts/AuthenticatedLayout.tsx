import { SidebarProvider } from "@/shared/ui/sidebar";
import { ReactNode } from "react";

interface AuthenticatedLayoutProps {
  children: ReactNode;
}

export const AuthenticatedLayout = ({ children }: AuthenticatedLayoutProps) => {
  return (
    <SidebarProvider>
      <main className="flex-1 py-2 px-1 sm:py-3 sm:px-2 md:py-4 md:px-3 bg-neutral-50 dark:bg-neutral-950">{children}</main>
    </SidebarProvider>
  );
};
