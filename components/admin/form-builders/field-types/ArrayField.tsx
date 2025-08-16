'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FieldWrapper } from '../FieldWrapper';
import { DynamicField } from '../DynamicField';

import { UseFormReturn } from 'react-hook-form';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ArrayFieldProps {
  field: SanityFieldConfig;
  form: UseFormReturn<any>;
  disabled?: boolean;
}

export function ArrayField({ field, form, disabled }: ArrayFieldProps) {
  const { setValue, watch, formState: { errors } } = form;
  const value = watch(field.name) || [];
  const error = errors[field.name]?.message as string;
  const [collapsedItems, setCollapsedItems] = useState<Set<number>>(new Set());

  const addItem = () => {
    const newItem = field.of?.[0]?.initialValue || {};
    setValue(field.name, [...value, newItem]);
  };

  const removeItem = (index: number) => {
    const newValue = value.filter((_: any, i: number) => i !== index);
    setValue(field.name, newValue);
  };

  const moveItem = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= value.length) return;
    
    const newValue = [...value];
    const [movedItem] = newValue.splice(fromIndex, 1);
    newValue.splice(toIndex, 0, movedItem);
    setValue(field.name, newValue);
  };

  const toggleCollapsed = (index: number) => {
    const newCollapsed = new Set(collapsedItems);
    if (newCollapsed.has(index)) {
      newCollapsed.delete(index);
    } else {
      newCollapsed.add(index);
    }
    setCollapsedItems(newCollapsed);
  };

  const getItemPreview = (item: any, index: number): string => {
    if (!field.of?.[0]?.fields) return `Élément ${index + 1}`;
    
    // Chercher un champ titre ou label
    const titleField = field.of[0].fields.find(f => 
      f.name === 'title' || f.name === 'label' || f.name === 'name'
    );
    
    if (titleField && item[titleField.name]) {
      const title = item[titleField.name];
      if (typeof title === 'object' && title.fr) {
        return title.fr || title.en || Object.values(title)[0] || `Élément ${index + 1}`;
      }
      return title || `Élément ${index + 1}`;
    }
    
    return `Élément ${index + 1}`;
  };

  if (!field.of?.[0]) {
    return null;
  }

  return (
    <FieldWrapper
      name={field.name}
      title={field.title}
      description={field.description}
      error={error}
      required={field.validation?.required}
    >
      <div className="space-y-4">
        {/* Header avec compteur et bouton ajouter */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {value.length} élément{value.length !== 1 ? 's' : ''}
            </Badge>
            {field.validation?.min && value.length < field.validation.min && (
              <Badge variant="destructive" className="text-xs">
                Min: {field.validation.min}
              </Badge>
            )}
            {field.validation?.max && value.length > field.validation.max && (
              <Badge variant="destructive" className="text-xs">
                Max: {field.validation.max}
              </Badge>
            )}
          </div>
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addItem}
            disabled={disabled || (field.validation?.max && value.length >= field.validation.max)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Ajouter
          </Button>
        </div>

        {/* Liste des éléments */}
        <div className="space-y-3">
          {value.map((item: any, index: number) => {
            const isCollapsed = collapsedItems.has(index);
            
            return (
              <div key={index} className="bg-muted/5 rounded-lg">
                <Collapsible open={!isCollapsed} onOpenChange={() => toggleCollapsed(index)}>
                  {/* Header de l'item */}
                  <div className="flex items-center gap-2 p-3 bg-muted/20">
                    <GripVertical 
                      className="h-4 w-4 text-muted-foreground cursor-move" 
                      onMouseDown={(e) => e.preventDefault()}
                    />
                    
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="flex-1 justify-start">
                        {isCollapsed ? (
                          <ChevronRight className="h-4 w-4 mr-2" />
                        ) : (
                          <ChevronDown className="h-4 w-4 mr-2" />
                        )}
                        <span className="font-medium">{getItemPreview(item, index)}</span>
                      </Button>
                    </CollapsibleTrigger>
                    
                    <div className="flex items-center gap-1">
                      {/* Boutons de déplacement */}
                      {field.options?.sortable && (
                        <>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => moveItem(index, index - 1)}
                            disabled={disabled || index === 0}
                            className="h-8 w-8 p-0"
                          >
                            ↑
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => moveItem(index, index + 1)}
                            disabled={disabled || index === value.length - 1}
                            className="h-8 w-8 p-0"
                          >
                            ↓
                          </Button>
                        </>
                      )}
                      
                      {/* Bouton supprimer */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(index)}
                        disabled={disabled || (field.validation?.min && value.length <= field.validation.min)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Contenu de l'item */}
                  <CollapsibleContent>
                    <div className="p-4 space-y-4">
                      {field.of[0].fields?.map((subField) => (
                        <DynamicField
                          key={subField.name}
                          field={{
                            ...subField,
                            name: `${field.name}.${index}.${subField.name}`,
                          }}
                          form={form}
                          disabled={disabled}
                        />
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            );
          })}
        </div>

        {/* Message si vide */}
        {value.length === 0 && (
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
            <div className="text-muted-foreground mb-4">
              Aucun élément ajouté
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addItem}
              disabled={disabled}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Ajouter le premier élément
            </Button>
          </div>
        )}
      </div>
    </FieldWrapper>
  );
}