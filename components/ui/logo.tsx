"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { useLocale } from '@/components/providers/locale-provider';
import { cn } from '@/lib/utils';
import { HeaderSettings } from '@/hooks/useHeaderData';

interface LogoProps {
  className?: string;
  textClassName?: string;
  imageClassName?: string;
  href?: string | null;
  priority?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showSkeleton?: boolean;
  headerSettings?: HeaderSettings;
  isHeaderLoading?: boolean;
}

const sizeClasses = {
  sm: {
    text: 'text-lg font-bold',
    image: 'h-6 w-auto',
    skeleton: 'h-6 w-24'
  },
  md: {
    text: 'text-xl font-bold',
    image: 'h-8 w-auto',
    skeleton: 'h-8 w-32'
  },
  lg: {
    text: 'text-xl lg:text-2xl font-bold',
    image: 'h-8 w-auto lg:h-10',
    skeleton: 'h-8 w-32 lg:h-10 lg:w-40'
  }
};

export function Logo({ 
  className, 
  textClassName,
  imageClassName,
  href = "/", 
  priority = false, 
  size = 'md',
  showSkeleton = true,
  headerSettings,
  isHeaderLoading = false
}: LogoProps) {
  const { resolveMultilingualValue } = useLocale();

  // Utiliser les headerSettings passés en props ou valeurs par défaut
  const logoSettings = headerSettings || {};

  const logoText = logoSettings.logoText || 'BD Theme';
  const logoAlt = logoSettings.logoImage?.alt 
    ? resolveMultilingualValue(logoSettings.logoImage.alt)
    : 'Logo';
  const logoImage = logoSettings.logoImage;

  // Afficher skeleton pendant le chargement (utiliser isHeaderLoading si fourni)
  if ((isHeaderLoading || false) && showSkeleton) {
    return (
      <div className={cn("flex items-center", className)}>
        <Skeleton className={sizeClasses[size].skeleton} />
      </div>
    );
  }

  const LogoContent = () => (
    <div className={cn("flex items-center space-x-2", className)}>
      {logoImage ? (
        <Image
          src={logoImage.asset.url}
          alt={logoAlt}
          width={40}
          height={40}
          className={cn(
            sizeClasses[size].image,
            imageClassName
          )}
          priority={priority}
        />
      ) : (
        <span className={cn(
          sizeClasses[size].text,
          "text-primary",
          textClassName
        )}>
          {logoText}
        </span>
      )}
    </div>
  );

  // Avec lien par défaut
  if (href) {
    return (
      <Link href={href} className="z-10">
        <LogoContent />
      </Link>
    );
  }

  // Sans lien
  return <LogoContent />;
}