import { requireAdmin } from "@/lib/auth-actions";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Separator } from "@/components/ui/separator";
import { DashboardHeader } from "@/components/admin/layout/DashboardHeader";
import { PageBreadcrumbs } from "@/components/admin/layout/PageBreadcrumbs";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Protect all admin routes
  await requireAdmin();

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="bg-background sticky top-0 z-10 flex min-h-16 shrink-0 flex-col sm:flex-row items-start sm:items-center gap-2 border-b px-4 py-3 w-full overflow-hidden">
          <div className="flex items-center gap-2 shrink-0">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
          <div className="flex-1 min-w-0 w-full">
            <DashboardHeader />
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:p-6 min-w-0 overflow-x-auto">
          <PageBreadcrumbs />
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}