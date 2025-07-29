"use client";

import { Header } from './header';

interface NavigationWrapperProps {
  className?: string;
}

export function NavigationWrapper({ className }: NavigationWrapperProps) {
  return (
    <Header 
      className={className}
    />
  );
}