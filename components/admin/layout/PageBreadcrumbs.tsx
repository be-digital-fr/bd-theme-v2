'use client';

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useDashboardHeaderStore } from '@/stores/useDashboardHeaderStore';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageBreadcrumbsProps {
  items?: BreadcrumbItem[];
}

export function PageBreadcrumbs({ items }: PageBreadcrumbsProps) {
  const { breadcrumbs: storeBreadcrumbs } = useDashboardHeaderStore();

  // Use passed items or fallback to store breadcrumbs
  const breadcrumbs = items || storeBreadcrumbs;

  // Don't render if no breadcrumbs are set
  if (!breadcrumbs || breadcrumbs.length === 0) {
    return null;
  }

  // Show only last 2 items on mobile, all on desktop
  const displayBreadcrumbs = breadcrumbs.length > 2 
    ? breadcrumbs.slice(-2)
    : breadcrumbs;

  const showEllipsis = breadcrumbs.length > 2;

  return (
    <div className="mb-4 md:mb-6">
      <Breadcrumb>
        <BreadcrumbList>
          {/* Ellipsis for mobile when there are more than 2 items */}
          {showEllipsis && (
            <div className="flex items-center md:hidden">
              <BreadcrumbItem>
                <BreadcrumbEllipsis />
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </div>
          )}
          
          {/* Full breadcrumbs on desktop */}
          <div className="hidden md:flex md:items-center">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center">
                <BreadcrumbItem>
                  {crumb.href ? (
                    <BreadcrumbLink href={crumb.href}>
                      {crumb.label}
                    </BreadcrumbLink>
                  ) : index === breadcrumbs.length - 1 ? (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  ) : (
                    <span>{crumb.label}</span>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </div>
            ))}
          </div>

          {/* Limited breadcrumbs on mobile */}
          <div className="flex items-center md:hidden">
            {displayBreadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center">
                <BreadcrumbItem>
                  {crumb.href ? (
                    <BreadcrumbLink href={crumb.href} className="max-w-[120px] truncate">
                      {crumb.label}
                    </BreadcrumbLink>
                  ) : index === displayBreadcrumbs.length - 1 ? (
                    <BreadcrumbPage className="max-w-[120px] truncate">{crumb.label}</BreadcrumbPage>
                  ) : (
                    <span className="max-w-[120px] truncate">{crumb.label}</span>
                  )}
                </BreadcrumbItem>
                {index < displayBreadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </div>
            ))}
          </div>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}