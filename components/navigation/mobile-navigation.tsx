"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from '@/components/providers/locale-provider';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/language-selector';

import { MenuItem } from '@/hooks/useNavigation';

interface MobileNavigationProps {
  menuItems: MenuItem[];
  showLanguageSelector?: boolean;
  onItemClick?: () => void;
  className?: string;
}

export function MobileNavigation({ 
  menuItems, 
  showLanguageSelector = false,
  onItemClick, 
  className 
}: MobileNavigationProps) {
  const pathname = usePathname();
  const { resolveMultilingualValue } = useLocale();

  return (
    <nav className={cn("flex flex-col space-y-2 pt-4", className)}>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground">Menu</h2>
      </div>
      
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
      
      {/* Language Selector */}
      {showLanguageSelector && (
        <div className="border-t border-border pt-4 mt-6">
          <div className="mb-3">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Langue</h3>
            <LanguageSelector variant="select" className="w-full" />
          </div>
        </div>
      )}

      {/* Additional mobile menu items */}
      <div className="border-t border-border pt-4 mt-6">
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-base font-medium"
            onClick={onItemClick}
          >
            Search
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-base font-medium"
            onClick={onItemClick}
          >
            Account
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-base font-medium"
            onClick={onItemClick}
          >
            Cart
          </Button>
        </div>
      </div>
    </nav>
  );
}