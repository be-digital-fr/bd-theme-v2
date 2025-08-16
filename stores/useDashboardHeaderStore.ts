import { create } from 'zustand';
import { ReactNode } from 'react';

export interface HeaderAction {
  id: string;
  label: string;
  variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  icon?: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export interface DashboardHeaderState {
  title: string;
  description?: string;
  actions: HeaderAction[];
  breadcrumbs?: Array<{ label: string; href?: string }>;
  showBackButton?: boolean;
  onBack?: () => void;
}

interface DashboardHeaderStore extends DashboardHeaderState {
  setTitle: (title: string) => void;
  setDescription: (description?: string) => void;
  setActions: (actions: HeaderAction[]) => void;
  addAction: (action: HeaderAction) => void;
  removeAction: (actionId: string) => void;
  updateAction: (actionId: string, updates: Partial<HeaderAction>) => void;
  setBreadcrumbs: (breadcrumbs?: Array<{ label: string; href?: string }>) => void;
  setBackButton: (show: boolean, onBack?: () => void) => void;
  reset: () => void;
  setHeader: (config: Partial<DashboardHeaderState>) => void;
}

const defaultState: DashboardHeaderState = {
  title: '',
  description: undefined,
  actions: [],
  breadcrumbs: undefined,
  showBackButton: false,
  onBack: undefined,
};

export const useDashboardHeaderStore = create<DashboardHeaderStore>((set, get) => ({
  ...defaultState,

  setTitle: (title: string) =>
    set((state) => ({ ...state, title })),

  setDescription: (description?: string) =>
    set((state) => ({ ...state, description })),

  setActions: (actions: HeaderAction[]) =>
    set((state) => ({ ...state, actions })),

  addAction: (action: HeaderAction) =>
    set((state) => ({
      ...state,
      actions: [...state.actions, action],
    })),

  removeAction: (actionId: string) =>
    set((state) => ({
      ...state,
      actions: state.actions.filter((action) => action.id !== actionId),
    })),

  updateAction: (actionId: string, updates: Partial<HeaderAction>) =>
    set((state) => ({
      ...state,
      actions: state.actions.map((action) =>
        action.id === actionId ? { ...action, ...updates } : action
      ),
    })),

  setBreadcrumbs: (breadcrumbs?: Array<{ label: string; href?: string }>) =>
    set((state) => ({ ...state, breadcrumbs })),

  setBackButton: (showBackButton: boolean, onBack?: () => void) =>
    set((state) => ({ ...state, showBackButton, onBack })),

  reset: () => set(defaultState),

  setHeader: (config: Partial<DashboardHeaderState>) =>
    set((state) => ({ ...state, ...config })),
}));