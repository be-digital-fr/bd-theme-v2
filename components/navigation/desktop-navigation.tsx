"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from '@/components/providers/locale-provider';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { LanguageSelector } from '@/components/language-selector';

import { MenuItem } from '@/hooks/useHeaderData';

interface DesktopNavigationProps {
  menuItems: MenuItem[];
  showLanguageSelector?: boolean;
  className?: string;
  isLoading?: boolean;
}

export function DesktopNavigation({ menuItems, showLanguageSelector = false, className, isLoading = false }: DesktopNavigationProps) {
  const pathname = usePathname();
  const { resolveMultilingualValue } = useLocale();

  if (isLoading) {
    return (
      <nav className={cn("flex items-center space-x-6", className)}>
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-18" />
        <Skeleton className="h-6 w-14" />
      </nav>
    );
  }

  // Si pas de menu items, on affiche le skeleton pendant quelques secondes de plus
  // pour éviter le flash du message d'erreur
  if (!menuItems || menuItems.length === 0) {
    return (
      <nav className={cn("flex items-center space-x-6", className)}>
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-18" />
        <Skeleton className="h-6 w-14" />
      </nav>
    );
  }

  return (
    <nav className={cn("flex items-center space-x-8", className)}>
      {menuItems.filter(item => item.isActive).map((item, index) => {
        const label = resolveMultilingualValue(item.label);
        const isActive = pathname === item.href;
        
        const LinkComponent = item.isExternal ? 'a' : Link;
        const linkProps = item.isExternal 
          ? { 
              href: item.href, 
              target: item.openInNewTab ? "_blank" : "_self", 
              rel: item.openInNewTab ? "noopener noreferrer" : undefined 
            }
          : { href: item.href };

        return (
          <LinkComponent
            key={item._key || item.href || index}
            {...linkProps}
            className={cn(
              "relative text-sm font-medium transition-colors duration-200",
              "hover:text-primary",
              "before:absolute before:inset-x-0 before:-bottom-1 before:h-0.5 before:bg-primary before:scale-x-0 before:transition-transform before:duration-200",
              "hover:before:scale-x-100",
              isActive 
                ? "text-primary before:scale-x-100" 
                : "text-foreground/80"
            )}
          >
            {label}
          </LinkComponent>
        );
      })}
      
      {/* Language Selector */}
      {showLanguageSelector && (
        <div className="ml-4">
          <LanguageSelector variant="dropdown" />
        </div>
      )}
    </nav>
  );
}