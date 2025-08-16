"use client";

import {
  BarChart3,
  FileText,
  Home,
  Images,
  Settings,
  Video,
  FileEdit,
  Type,
  Package,
  FolderTree,
  ChefHat,
  Star,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const adminNavItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: Home,
  },
  {
    title: "Analytics",
    url: "/admin/analytics",
    icon: BarChart3,
  },
];

const storeItems = [
  {
    title: "Produits",
    url: "/admin/products",
    icon: Package,
  },
  {
    title: "Collections",
    url: "/admin/collections",
    icon: Star,
  },
  {
    title: "Catégories",
    url: "/admin/categories",
    icon: FolderTree,
  },
  {
    title: "Ingrédients",
    url: "/admin/ingredients",
    icon: ChefHat,
  },
];

const contentItems = [
  {
    title: "Vue d'ensemble",
    url: "/admin/content-management",
    icon: FileText,
  },
  {
    title: "Page d'accueil",
    url: "/admin/home-content",
    icon: Home,
  },
  {
    title: "Paramètres du site",
    url: "/admin/content-management/settings",
    icon: Settings,
  },
  {
    title: "Éditorial",
    url: "/admin/content/editorial",
    icon: FileEdit,
  },
  {
    title: "Vidéos",
    url: "/admin/content/videos",
    icon: Video,
  },
  {
    title: "Textes",
    url: "/admin/content/texts",
    icon: Type,
  },
  {
    title: "Images",
    url: "/admin/content/images",
    icon: Images,
  },
];

const settingsItems = [
  {
    title: "Réglages du site",
    url: "/admin/site-settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-4 py-3 border-b">
          <h2 className="text-lg font-semibold">Administration</h2>
          <p className="text-sm text-muted-foreground">Gestion du site</p>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={cn(
                        "flex items-center gap-2 w-full",
                        pathname === item.url && "bg-secondary"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Store Management */}
        <SidebarGroup>
          <SidebarGroupLabel>Gestion du store</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {storeItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={cn(
                        "flex items-center gap-2 w-full",
                        pathname === item.url && "bg-secondary"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Content Management */}
        <SidebarGroup>
          <SidebarGroupLabel>Gestion du contenu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {contentItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={cn(
                        "flex items-center gap-2 w-full",
                        pathname === item.url && "bg-secondary"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings */}
        <SidebarGroup>
          <SidebarGroupLabel>Configuration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={cn(
                        "flex items-center gap-2 w-full",
                        pathname === item.url && "bg-secondary"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="px-4 py-3 border-t">
          <p className="text-xs text-muted-foreground">
            © 2024 Be Digital Restaurant
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}