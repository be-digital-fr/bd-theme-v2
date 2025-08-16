'use client';

import { usePaginationStore } from '@/stores/usePaginationStore';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationControlsProps {
  showPageSizeSelector?: boolean;
  pageSizeOptions?: number[];
}

export function PaginationControls({ 
  showPageSizeSelector = true,
  pageSizeOptions = [10, 20, 50] 
}: PaginationControlsProps) {
  const {
    currentPage,
    totalPages,
    pageSize,
    setCurrentPage,
    setPageSize,
    canGoNext,
    canGoPrevious,
    getPageInfo,
  } = usePaginationStore();

  const { from, to, total } = getPageInfo();

  // Générer les numéros de pages à afficher
  const getVisiblePages = () => {
    const pages: (number | 'ellipsis')[] = [];
    const delta = 2; // Nombre de pages à afficher de chaque côté de la page courante

    if (totalPages <= 7) {
      // Si le nombre total de pages est petit, afficher toutes les pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Toujours afficher la première page
      pages.push(1);

      if (currentPage > delta + 2) {
        pages.push('ellipsis');
      }

      // Pages autour de la page courante
      const start = Math.max(2, currentPage - delta);
      const end = Math.min(totalPages - 1, currentPage + delta);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - delta - 1) {
        pages.push('ellipsis');
      }

      // Toujours afficher la dernière page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  if (totalPages <= 1 && !showPageSizeSelector) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
      {showPageSizeSelector ? (
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium whitespace-nowrap hidden sm:inline">Lignes par page</p>
          <p className="text-sm font-medium sm:hidden">Par page</p>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              setPageSize(Number(value));
              setCurrentPage(1); // Reset to first page when changing page size
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : (
        <div className="hidden sm:block" />
      )}

      <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-8">
        <div className="text-sm font-medium order-2 sm:order-1">
          {total > 0 ? (
            <>
              {from}-{to} sur {total}
            </>
          ) : (
            'Aucun élément'
          )}
        </div>

        {totalPages > 1 ? (
          <Pagination className='order-1 sm:order-2'>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink
                size="icon"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (canGoPrevious()) {
                    setCurrentPage(currentPage - 1);
                  }
                }}
                className={!canGoPrevious() ? 'pointer-events-none opacity-50' : ''}
                aria-label="Go to previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </PaginationLink>
            </PaginationItem>

            {visiblePages.map((page, index) => (
              <PaginationItem key={index}>
                {page === 'ellipsis' ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    size="icon"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(page);
                    }}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationLink
                size="icon"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (canGoNext()) {
                    setCurrentPage(currentPage + 1);
                  }
                }}
                className={!canGoNext() ? 'pointer-events-none opacity-50' : ''}
                aria-label="Go to next page"
              >
                <ChevronRight className="h-4 w-4" />
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      ) : (
        <div className="order-1 sm:order-2" />
      )}
      </div>
    </div>
  );
}