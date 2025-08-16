import { create } from 'zustand';

interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

interface PaginationActions {
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setTotalItems: (total: number) => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  canGoNext: () => boolean;
  canGoPrevious: () => boolean;
  getPageInfo: () => {
    from: number;
    to: number;
    total: number;
  };
  getPaginationParams: () => {
    page: number;
    limit: number;
    skip: number;
    take: number;
  };
  reset: (initialPageSize?: number) => void;
}

interface PaginationStore extends PaginationState, PaginationActions {}

const defaultState: PaginationState = {
  currentPage: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 0,
};

export const usePaginationStore = create<PaginationStore>((set, get) => ({
  ...defaultState,

  setCurrentPage: (page: number) => {
    const { totalPages } = get();
    if (page >= 1 && page <= totalPages) {
      set({ currentPage: page });
    }
  },

  setPageSize: (size: number) => {
    const { totalItems } = get();
    const newTotalPages = Math.ceil(totalItems / size);
    set({ 
      pageSize: size, 
      totalPages: newTotalPages,
      currentPage: 1 // Reset to first page when changing page size
    });
  },

  setTotalItems: (total: number) => {
    const { pageSize } = get();
    const newTotalPages = Math.ceil(total / pageSize);
    set({ 
      totalItems: total, 
      totalPages: newTotalPages 
    });
  },

  goToFirstPage: () => {
    set({ currentPage: 1 });
  },

  goToLastPage: () => {
    const { totalPages } = get();
    set({ currentPage: totalPages });
  },

  goToNextPage: () => {
    const { currentPage, totalPages } = get();
    if (currentPage < totalPages) {
      set({ currentPage: currentPage + 1 });
    }
  },

  goToPreviousPage: () => {
    const { currentPage } = get();
    if (currentPage > 1) {
      set({ currentPage: currentPage - 1 });
    }
  },

  canGoNext: () => {
    const { currentPage, totalPages } = get();
    return currentPage < totalPages;
  },

  canGoPrevious: () => {
    const { currentPage } = get();
    return currentPage > 1;
  },

  getPageInfo: () => {
    const { currentPage, pageSize, totalItems } = get();
    const from = (currentPage - 1) * pageSize + 1;
    const to = Math.min(currentPage * pageSize, totalItems);
    return { from, to, total: totalItems };
  },

  getPaginationParams: () => {
    const { currentPage, pageSize } = get();
    return {
      page: currentPage,
      limit: pageSize,
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    };
  },

  reset: (initialPageSize = 10) => {
    set({
      ...defaultState,
      pageSize: initialPageSize,
    });
  },
}));