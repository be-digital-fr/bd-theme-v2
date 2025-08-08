"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from '@/components/providers/locale-provider';
import { cn } from '@/lib/utils';
import { Languages } from 'lucide-react';
import { LanguageSelector } from '@/components/language-selector';

import { MenuItem } from '@/hooks/useHeaderData';

interface MobileNavigationProps {
  menuItems: MenuItem[];
  onItemClick?: () => void;
  className?: string;
  showLanguageSelector?: boolean;
}

export function MobileNavigation({ 
  menuItems, 
  onItemClick, 
  className,
  showLanguageSelector = true
}: MobileNavigationProps) {
  const pathname = usePathname();
  const { resolveMultilingualValue } = useLocale();

  return (
    <nav className={cn("flex flex-col space-y-2 pt-4", className)}>
      
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
            onClick={onItemClick}
            className={cn(
              "flex items-center px-4 py-3 text-base font-medium rounded-md transition-colors duration-200",
              "hover:bg-accent hover:text-accent-foreground",
              isActive 
                ? "bg-primary text-primary-foreground" 
                : "text-foreground"
            )}
          >
            {label}
          </LinkComponent>
        );
      })}

      {/* Language Selector as a menu item */}
      {showLanguageSelector && (
        <div className="px-4 py-3">
          <div className="flex items-center gap-3 mb-3">
            <Languages className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              Langue / Language
            </span>
          </div>
          <div className="pl-8">
            <LanguageSelector 
              variant="select" 
              className="w-full" 
              showFlag={true}
              showNativeName={true}
            />
          </div>
        </div>
      )}

    </nav>
  );
}