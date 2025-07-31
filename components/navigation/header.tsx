"use client";

import { useState, useEffect } from 'react';
import { Search, ShoppingCart, AlignRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DesktopNavigation } from './desktop-navigation';
import { MobileNavigation } from './mobile-navigation';
import { MenuItem } from '@/hooks/useHeaderData';
import { LanguageSelector } from '@/components/language-selector-v2';
import { UserMenu } from '@/components/auth/user-menu';
import { AuthButton } from '@/components/auth/auth-button';
import { Skeleton } from '@/components/ui/skeleton';
import { Logo } from '@/components/ui/logo';
import { cn } from '@/lib/utils';

import { useHeaderData } from '@/hooks/useHeaderData';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  // Tous les hooks doivent être appelés en premier
  const { data, isLoading } = useHeaderData();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  

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

  // Utiliser des valeurs par défaut si pas de données (même pendant le loading)
  const settings = data?.settings || null;
  const authSettings = data?.authSettings || null;
  const navigation = data?.navigation || { menuItems: [], footerMenuItems: [] };
  const headerSettings = settings?.headerSettings || {};
  const menuItems: MenuItem[] = navigation.menuItems || [];


  if (isLoading) {
    return (
      <header 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md shadow-sm border-b",
          className
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo Skeleton */}
            <Skeleton className="h-8 w-32 lg:h-10 lg:w-40" />

            {/* Desktop Navigation Skeleton */}
            <div className="hidden lg:flex items-center space-x-6">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-18" />
              <Skeleton className="h-6 w-14" />
            </div>

            {/* Right Side Icons Skeleton */}
            <div className="flex items-center space-x-2 lg:space-x-4">
              {/* Icons Skeleton */}
              <Skeleton className="h-9 w-9 rounded-md" />
              <Skeleton className="h-9 w-9 rounded-md" />
              <Skeleton className="h-9 w-9 rounded-md" />

              {/* Language Selector Skeleton - Desktop */}
              <div className="hidden lg:block border-l pl-4 ml-2">
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>

              {/* User Menu Skeleton - Desktop */}
              <div className="hidden lg:block border-l pl-4 ml-2">
                <Skeleton className="h-9 w-24 rounded-md" />
              </div>

              {/* Mobile Menu Toggle Skeleton */}
              <Skeleton className="lg:hidden h-9 w-9 rounded-full" />
            </div>
          </div>
        </div>
      </header>
    );
  }


  
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
          <Logo 
            size="lg" 
            priority 
            showSkeleton={false}
            headerSettings={headerSettings}
            isHeaderLoading={isLoading}
          />

          {/* Desktop Navigation */}
          <DesktopNavigation 
            menuItems={menuItems} 
            showLanguageSelector={false}
            className="hidden lg:flex"
            isLoading={isLoading}
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

            {/* User/Auth Icon - Desktop */}
            <div className="hidden lg:block">
              {(headerSettings?.showUserIcon ?? true) && authSettings && (
                <AuthButton 
                  authSettings={authSettings}
                  isHeaderLoading={isLoading} 
                />
              )}
              <UserMenu />
            </div>

            {/* Language Selector - Desktop only */}
            {settings?.isMultilingual && (
              <div className="hidden lg:block border-l pl-4 ml-2">
                <LanguageSelector showFlag={true} showNativeName={false} />
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <div className="lg:hidden bg-primary rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors">
                  <AlignRight className="h-5 w-5 text-primary-foreground" />
                </div>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:w-80 flex flex-col">
                {/* Logo/Header in mobile menu */}
                <div className="flex items-center mb-6 pt-4">
                  <Logo 
                    size="md" 
                    href={null} 
                    showSkeleton={false}
                    headerSettings={headerSettings}
                    isHeaderLoading={isLoading}
                  />
                </div>
                
                <div className="flex-1">
                  <MobileNavigation 
                    menuItems={menuItems}
                    onItemClick={() => setIsMobileMenuOpen(false)}
                  />
                </div>
                
                {/* Bottom Section with Icons and Language Selector */}
                <div className="border-t border-border pt-4 mt-auto">
                  {/* Header Icons and Language Selector - Only icons */}
                  <div className="flex justify-center items-center gap-4">
                    {(headerSettings?.showSearchIcon ?? true) && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-12 w-12 text-foreground hover:text-primary"
                        onClick={() => setIsMobileMenuOpen(false)}
                        aria-label="Search"
                      >
                        <Search className="h-6 w-6" />
                      </Button>
                    )}
                    {(headerSettings?.showCartIcon ?? true) && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="relative h-12 w-12 text-foreground hover:text-primary"
                        onClick={() => setIsMobileMenuOpen(false)}
                        aria-label="Shopping cart"
                      >
                        <ShoppingCart className="h-6 w-6" />
                        {/* Cart badge for mobile */}
                        {(headerSettings?.cartBadgeCount ?? 0) > 0 && (
                          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                            {headerSettings?.cartBadgeCount}
                          </span>
                        )}
                      </Button>
                    )}
                    
                    {/* User/Auth Icon - Mobile */}
                    <div onClick={() => setIsMobileMenuOpen(false)}>
                      {(headerSettings?.showUserIcon ?? true) && authSettings && (
                        <AuthButton 
                          className="h-12 w-12 text-foreground hover:text-primary"
                          ariaLabel="User account"
                          iconSize="sm"
                          authSettings={authSettings}
                          isHeaderLoading={isLoading}
                        />
                      )}
                      <UserMenu />
                    </div>
                    
                    {/* Language Selector - Flag only version */}
                    {settings?.isMultilingual && (
                      <LanguageSelector showFlag={true} showNativeName={false} />
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}