'use client';

import { useState, useRef, useEffect } from 'react';
import { FieldWrapper } from '../FieldWrapper';

import { UseFormReturn } from 'react-hook-form';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { AVAILABLE_LANGUAGES } from '@/lib/constants/languages';

interface MultiSelectFieldProps {
  field: SanityFieldConfig;
  form: UseFormReturn<any>;
  disabled?: boolean;
}

export function MultiSelectField({ field, form, disabled }: MultiSelectFieldProps) {
  const { setValue, watch, formState: { errors } } = form;
  const value = watch(field.name) || [];
  const error = errors[field.name]?.message as string;
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Pour les langues, utiliser notre liste complète
  const isLanguageField = field.name.includes('Language');
  const options = isLanguageField 
    ? AVAILABLE_LANGUAGES 
    : (field.options?.list || []);

  const selectedItems = isLanguageField
    ? AVAILABLE_LANGUAGES.filter(lang => value.includes(lang.code))
    : value;

  const filteredOptions = isLanguageField
    ? AVAILABLE_LANGUAGES.filter(lang => 
        lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lang.code.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  const handleSelect = (selectedValue: string) => {
    const currentValues = value || [];
    const newValues = currentValues.includes(selectedValue)
      ? currentValues.filter((v: string) => v !== selectedValue)
      : [...currentValues, selectedValue];
    
    setValue(field.name, newValues);
  };

  const handleRemove = (valueToRemove: string) => {
    const newValues = value.filter((v: string) => v !== valueToRemove);
    setValue(field.name, newValues);
  };

  const getDisplayLabel = (val: string) => {
    if (isLanguageField) {
      const lang = AVAILABLE_LANGUAGES.find(l => l.code === val);
      return lang ? `${lang.flag} ${lang.name}` : val;
    }
    const option = options.find((opt: any) => opt.value === val);
    return option?.title || val;
  };

  return (
    <FieldWrapper
      name={field.name}
      title={field.title}
      description={field.description}
      error={error}
      required={field.validation?.required}
    >
      <div className="space-y-2">
        {/* Badges des éléments sélectionnés */}
        {value.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {value.map((val: string) => (
              <Badge
                key={val}
                variant="secondary"
                className="flex items-center gap-1 pr-1"
              >
                <span className="text-xs">{getDisplayLabel(val)}</span>
                <button
                  type="button"
                  onClick={() => handleRemove(val)}
                  className="ml-1 rounded-full hover:bg-muted"
                  disabled={disabled}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {/* Popover avec le sélecteur */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
              disabled={disabled}
            >
              <span className="text-left truncate">
                {value.length === 0 
                  ? `Sélectionner ${field.title?.toLowerCase() || 'des éléments'}...`
                  : `${value.length} élément${value.length > 1 ? 's' : ''} sélectionné${value.length > 1 ? 's' : ''}`
                }
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput 
                placeholder={`Rechercher ${field.title?.toLowerCase() || 'un élément'}...`}
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
              <CommandList>
                <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
                <CommandGroup>
                  {filteredOptions.map((option: any) => {
                    const optionValue = isLanguageField ? option.code : option.value;
                    const isSelected = value.includes(optionValue);
                    
                    return (
                      <CommandItem
                        key={optionValue}
                        value={optionValue}
                        onSelect={() => handleSelect(optionValue)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            isSelected ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {isLanguageField ? (
                          <span className="flex items-center gap-2">
                            <span className="text-lg">{option.flag}</span>
                            <span>{option.name}</span>
                            <span className="text-muted-foreground text-sm">
                              ({option.nativeName})
                            </span>
                          </span>
                        ) : (
                          <span>{option.title || option.value}</span>
                        )}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Informations sur les limites */}
        {field.validation && (
          <div className="text-xs text-muted-foreground">
            {field.validation.min && (
              <span>Min: {field.validation.min} élément{field.validation.min > 1 ? 's' : ''}</span>
            )}
            {field.validation.min && field.validation.max && <span> • </span>}
            {field.validation.max && (
              <span>Max: {field.validation.max} élément{field.validation.max > 1 ? 's' : ''}</span>
            )}
          </div>
        )}
      </div>
    </FieldWrapper>
  );
}