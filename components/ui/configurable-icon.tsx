'use client';

import { Icon } from '@iconify/react';
import { Search, User, ShoppingCart, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mapping des icônes par défaut Lucide
const FALLBACK_ICONS: Record<string, LucideIcon> = {
  search: Search,
  user: User,
  cart: ShoppingCart,
  shoppingCart: ShoppingCart,
};

interface ConfigurableIconProps {
  /** Nom de l'icône Iconify depuis Sanity (peut être string ou objet avec propriété name) */
  iconName?: string | { name: string } | null | undefined;
  /** Type d'icône par défaut pour le fallback */
  fallbackType: 'search' | 'user' | 'cart';
  /** Classes CSS supplémentaires */
  className?: string;
  /** Taille de l'icône (appliquée aux deux types) */
  size?: number;
}

/**
 * Composant qui affiche une icône configurable depuis Sanity avec fallback vers Lucide
 */
export function ConfigurableIcon({
  iconName,
  fallbackType,
  className,
  size,
}: ConfigurableIconProps) {
  // Debug logging pour diagnostiquer les problèmes
  if (process.env.NODE_ENV === 'development' && iconName) {
    console.log(`ConfigurableIcon - iconName:`, iconName, `type:`, typeof iconName);
  }
  
  // Normaliser l'iconName - Sanity peut retourner un objet avec une propriété name
  let normalizedIconName: string | null = null;
  
  if (iconName) {
    if (typeof iconName === 'string') {
      normalizedIconName = iconName.trim();
    } else if (typeof iconName === 'object' && iconName !== null) {
      // Sanity iconify plugin retourne parfois { name: "icon-name" }
      const iconObj = iconName as { name?: string };
      if (iconObj.name && typeof iconObj.name === 'string') {
        normalizedIconName = iconObj.name.trim();
      }
    }
  }
  
  // Si une icône Iconify est configurée, l'utiliser
  if (normalizedIconName) {
    return (
      <Icon
        icon={normalizedIconName}
        width={size}
        height={size}
        className={cn('flex-shrink-0', className)}
      />
    );
  }

  // Sinon, utiliser l'icône Lucide par défaut
  const FallbackIcon = FALLBACK_ICONS[fallbackType];
  
  if (!FallbackIcon) {
    console.warn(`No fallback icon found for type: ${fallbackType}`);
    return null;
  }

  return (
    <FallbackIcon 
      className={cn('flex-shrink-0', className)} 
      size={size}
    />
  );
}

/**
 * Hook pour simplifier l'utilisation des icônes configurables
 */
export function useConfigurableIcons(headerSettings?: {
  searchIcon?: string | { name: string };
  userIcon?: string | { name: string };
  cartIcon?: string | { name: string };
}) {
  return {
    SearchIcon: ({ className, size }: { className?: string; size?: number }) => (
      <ConfigurableIcon
        iconName={headerSettings?.searchIcon}
        fallbackType="search"
        className={className}
        size={size}
      />
    ),
    UserIcon: ({ className, size }: { className?: string; size?: number }) => (
      <ConfigurableIcon
        iconName={headerSettings?.userIcon}
        fallbackType="user"
        className={className}
        size={size}
      />
    ),
    CartIcon: ({ className, size }: { className?: string; size?: number }) => (
      <ConfigurableIcon
        iconName={headerSettings?.cartIcon}
        fallbackType="cart"
        className={className}
        size={size}
      />
    ),
  };
}