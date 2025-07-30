"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, User, ShoppingCart, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DesktopNavigation } from './desktop-navigation';
import { MobileNavigation } from './mobile-navigation';
import { useLocale } from '@/components/providers/locale-provider';
import { LanguageSelector } from '@/components/language-selector-v2';
import { cn } from '@/lib/utils';

import { useHeaderData } from '@/hooks/useNavigation';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  // Tous les hooks doivent être appelés en premier
  const { data, isLoading } = useHeaderData();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { resolveMultilingualValue } = useLocale();

  console.log('Header data:', { data, isLoading });

  // useEffect doit aussi être appelé avant tout retour conditionnel
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="h-16 bg-white shadow-sm animate-pulse">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <div className="h-8 w-32 bg-gray-200 rounded"></div>
          <div className="h-8 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Utiliser des valeurs par défaut si pas de données
  const settings = data?.settings || null;
  const navigation = settings?.navigation || { menuItems: [], footerMenuItems: [] };
  const headerSettings = settings?.headerSettings || {};
  const menuItems = navigation.menuItems || [];

  console.log('Header data full:', data);
  console.log('Settings:', settings);
  console.log('Navigation:', navigation);
  console.log('Menu items:', menuItems);

  const logoText = headerSettings.logoText || 'BD Theme';
  const logoAlt = headerSettings.logoImage?.alt 
    ? resolveMultilingualValue(headerSettings.logoImage.alt)
    : 'Logo';

  const logoImage = headerSettings.logoImage;
  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-background/95 backdrop-blur-md shadow-sm border-b" 
          : "bg-background/80 backdrop-blur-sm border-b",
        className
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 z-10">
            {logoImage ? (
              <Image
                src={logoImage.asset.url}
                alt={logoAlt}
                width={40}
                height={40}
                className="h-8 w-auto lg:h-10"
                priority
              />
            ) : (
              <span className="text-xl lg:text-2xl font-bold text-primary">
                {logoText}
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <DesktopNavigation 
            menuItems={menuItems} 
            showLanguageSelector={false}
            className="hidden lg:flex"
          />

          {/* Right Side Icons */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            {/* Search Icon */}
            {(headerSettings?.showSearchIcon ?? true) && (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-foreground hover:text-primary"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </Button>
            )}

            {/* User Icon */}
            {(headerSettings?.showUserIcon ?? true) && (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-foreground hover:text-primary"
                aria-label="User account"
              >
                <User className="h-5 w-5" />
              </Button>
            )}

            {/* Cart Icon */}
            {(headerSettings?.showCartIcon ?? true) && (
              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9 text-foreground hover:text-primary"
                aria-label="Shopping cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {/* Cart badge - configurable from settings */}
                {(headerSettings?.cartBadgeCount ?? 0) > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    {headerSettings?.cartBadgeCount}
                  </span>
                )}
              </Button>
            )}

            {/* Language Selector - Desktop only */}
            {settings?.isMultilingual && (
              <div className="hidden lg:block border-l pl-4 ml-2">
                <LanguageSelector showFlag={true} showNativeName={false} />
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden h-9 w-9"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-80">
                <MobileNavigation 
                  menuItems={menuItems}
                  showLanguageSelector={settings?.isMultilingual || false}
                  onItemClick={() => setIsMobileMenuOpen(false)}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}