'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useDashboardHeaderStore } from '@/stores/useDashboardHeaderStore';
import { useRouter } from 'next/navigation';

export function DashboardHeader() {
  const router = useRouter();
  const {
    title,
    description,
    actions,
    showBackButton,
    onBack,
  } = useDashboardHeaderStore();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  // Don't render if no title is set
  if (!title) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 w-full">
      <div className="flex items-start space-x-4 flex-1 min-w-0">
        {/* Back Button */}
        {showBackButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="h-8 w-8 p-0 flex-shrink-0 mt-1"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}

        {/* Title and Description */}
        <div className="flex flex-col min-w-0">
          <h1 className="text-lg font-semibold tracking-tight truncate">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      {actions.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {actions.map((action) => (
            <Button
              key={action.id}
              variant={action.variant || 'default'}
              size={action.size || 'sm'}
              onClick={action.onClick}
              disabled={action.disabled || action.loading}
              className="w-full sm:w-auto whitespace-nowrap justify-start sm:justify-center"
            >
              {action.loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
              ) : action.icon ? (
                <span className="mr-1.5 sm:mr-2">{action.icon}</span>
              ) : null}
              <span className="hidden sm:inline">{action.label}</span>
              <span className="sm:hidden">{action.label.split(' ')[0]}</span>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

// Hook for easy header management in pages
export function usePageHeader() {
  const store = useDashboardHeaderStore();

  return {
    setHeader: store.setHeader,
    setTitle: store.setTitle,
    setDescription: store.setDescription,
    setActions: store.setActions,
    addAction: store.addAction,
    removeAction: store.removeAction,
    updateAction: store.updateAction,
    setBreadcrumbs: store.setBreadcrumbs,
    setBackButton: store.setBackButton,
    reset: store.reset,
  };
}