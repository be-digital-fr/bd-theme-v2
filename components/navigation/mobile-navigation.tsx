"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from '@/components/providers/locale-provider';
import { cn } from '@/lib/utils';

import { MenuItem } from '@/hooks/useNavigation';

interface MobileNavigationProps {
  menuItems: MenuItem[];
  onItemClick?: () => void;
  className?: string;
}

export function MobileNavigation({ 
  menuItems, 
  onItemClick, 
  className
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

    </nav>
  );
}