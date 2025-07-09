'use client';

import { useCurrentLocale, useLocaleChange, SUPPORTED_LOCALES, getLocaleInfo } from '@/lib/locale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Languages, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LanguageSelectorProps {
  variant?: 'select' | 'dropdown';
  className?: string;
  showFlag?: boolean;
  showNativeName?: boolean;
}

export function LanguageSelector({
  variant = 'dropdown',
  className,
  showFlag = true,
  showNativeName = true,
}: LanguageSelectorProps) {
  const currentLocale = useCurrentLocale();
  const { changeLocale } = useLocaleChange();
  const currentLocaleInfo = getLocaleInfo(currentLocale);

  if (variant === 'select') {
    return (
      <Select value={currentLocale} onValueChange={changeLocale}>
        <SelectTrigger className={cn('w-40', className)}>
          <SelectValue>
            {currentLocaleInfo && (
              <div className="flex items-center gap-2">
                {showFlag && <span>{currentLocaleInfo.flag}</span>}
                <span>
                  {showNativeName ? currentLocaleInfo.nativeName : currentLocaleInfo.name}
                </span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {SUPPORTED_LOCALES.map((locale) => (
            <SelectItem key={locale.code} value={locale.code}>
              <div className="flex items-center gap-2">
                {showFlag && <span>{locale.flag}</span>}
                <span>
                  {showNativeName ? locale.nativeName : locale.name}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn('flex items-center gap-2', className)}
        >
          <Languages className="h-4 w-4" />
          {currentLocaleInfo && (
            <>
              {showFlag && <span>{currentLocaleInfo.flag}</span>}
              <span>
                {showNativeName ? currentLocaleInfo.nativeName : currentLocaleInfo.name}
              </span>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0" align="end">
        <div className="p-2">
          <div className="text-xs font-medium text-muted-foreground mb-2 px-2">
            Choisir une langue
          </div>
          {SUPPORTED_LOCALES.map((locale) => (
            <Button
              key={locale.code}
              variant="ghost"
              size="sm"
              className={cn(
                'w-full justify-start gap-2 text-sm',
                currentLocale === locale.code && 'bg-accent'
              )}
              onClick={() => changeLocale(locale.code)}
            >
              {showFlag && <span>{locale.flag}</span>}
              <span className="flex-1 text-left">
                {showNativeName ? locale.nativeName : locale.name}
              </span>
              {currentLocale === locale.code && (
                <Check className="h-4 w-4" />
              )}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

/**
 * Composant simplifié pour afficher la langue actuelle
 */
export function CurrentLanguageDisplay({ className }: { className?: string }) {
  const currentLocale = useCurrentLocale();
  const currentLocaleInfo = getLocaleInfo(currentLocale);

  if (!currentLocaleInfo) {
    return null;
  }

  return (
    <div className={cn('flex items-center gap-2 text-sm text-muted-foreground', className)}>
      <span>{currentLocaleInfo.flag}</span>
      <span>{currentLocaleInfo.nativeName}</span>
    </div>
  );
}

/**
 * Composant pour afficher toutes les langues disponibles
 */
export function AvailableLanguages({ className }: { className?: string }) {
  const currentLocale = useCurrentLocale();
  const { changeLocale } = useLocaleChange();

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {SUPPORTED_LOCALES.map((locale) => (
        <Button
          key={locale.code}
          variant={currentLocale === locale.code ? 'default' : 'outline'}
          size="sm"
          className="flex items-center gap-1"
          onClick={() => changeLocale(locale.code)}
        >
          <span>{locale.flag}</span>
          <span className="text-xs">{locale.code.toUpperCase()}</span>
        </Button>
      ))}
    </div>
  );
} 