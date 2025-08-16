import { ReactNode } from 'react';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FieldWrapperProps {
  name: string;
  title: string;
  description?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

export function FieldWrapper({
  name,
  title,
  description,
  error,
  required,
  children,
  className
}: FieldWrapperProps) {
  return (
    <div className={cn(
      'space-y-2 p-3 rounded-md border transition-colors',
      error 
        ? 'border-red-300 bg-red-50/50' 
        : 'border-transparent bg-transparent',
      className
    )}>
      <div className="flex items-center gap-2">
        <Label 
          htmlFor={name} 
          className={cn(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2",
            error ? "text-red-700" : ""
          )}
        >
          {error && <AlertTriangle className="h-4 w-4 text-red-500" />}
          {title}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        
        {description && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-xs">
                <p className="text-sm">{description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      <div className={cn(error && 'animate-pulse')}>
        {children}
      </div>
      
      {error && (
        <p className="text-sm text-red-600 mt-1 font-medium flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  );
}