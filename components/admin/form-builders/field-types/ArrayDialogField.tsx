'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FieldWrapper } from '../FieldWrapper';
import { DynamicField } from '../DynamicField';

import { UseFormReturn, useForm } from 'react-hook-form';
import { Plus, Trash2, Edit2, GripVertical } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface ArrayDialogFieldProps {
  field: SanityFieldConfig;
  form: UseFormReturn<any>;
  disabled?: boolean;
}

export function ArrayDialogField({ field, form, disabled }: ArrayDialogFieldProps) {
  const { setValue, watch, formState: { errors } } = form;
  const value = watch(field.name) || [];
  const error = errors[field.name]?.message as string;
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Formulaire temporaire pour le dialogue
  const dialogForm = useForm({
    defaultValues: editingIndex !== null ? value[editingIndex] : field.of?.[0]?.initialValue || {},
  });

  if (!field.of?.[0]) {
    return null;
  }

  const itemConfig = field.of[0];

  const openDialog = (index?: number) => {
    if (index !== undefined) {
      setEditingIndex(index);
      dialogForm.reset(value[index]);
    } else {
      setEditingIndex(null);
      dialogForm.reset(itemConfig.initialValue || {});
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingIndex(null);
    dialogForm.reset();
  };

  const handleSave = () => {
    const formData = dialogForm.getValues();
    const newValue = [...value];
    
    if (editingIndex !== null) {
      newValue[editingIndex] = formData;
    } else {
      newValue.push(formData);
    }
    
    setValue(field.name, newValue);
    closeDialog();
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

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      moveItem(draggedIndex, index);
      setDraggedIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const getItemPreview = (item: any, index: number): string => {
    if (!itemConfig.fields) return `Élément ${index + 1}`;
    
    // Chercher un champ titre ou label
    const titleField = itemConfig.fields.find(f => 
      f.name === 'title' || f.name === 'label' || f.name === 'name' || f.name === 'text'
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

  // Déterminer les colonnes à afficher dans le tableau
  const displayColumns = itemConfig.fields?.slice(0, 3) || [];

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
            onClick={() => openDialog()}
            disabled={disabled || (field.validation?.max && value.length >= field.validation.max)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Ajouter
          </Button>
        </div>

        {/* Tableau des éléments */}
        {value.length > 0 ? (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10"></TableHead>
                  {displayColumns.map(col => (
                    <TableHead key={col.name}>{col.title}</TableHead>
                  ))}
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {value.map((item: any, index: number) => (
                  <TableRow
                    key={index}
                    draggable={!disabled && field.options?.sortable}
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={cn(
                      "cursor-move",
                      draggedIndex === index && "opacity-50"
                    )}
                  >
                    <TableCell>
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                    </TableCell>
                    {displayColumns.map(col => (
                      <TableCell key={col.name}>
                        {(() => {
                          const value = item[col.name];
                          // Gérer les objets slug
                          if (typeof value === 'object' && value?.current && value?._type === 'slug') {
                            return value.current;
                          }
                          // Gérer les objets multilingues
                          if (typeof value === 'object' && value?.fr) {
                            return value.fr;
                          }
                          // Gérer les images
                          if (typeof value === 'object' && value?.url) {
                            return '🖼️ Image';
                          }
                          // Gérer les booléens
                          if (typeof value === 'boolean') {
                            return value ? '✓' : '✗';
                          }
                          // Gérer les tableaux
                          if (Array.isArray(value)) {
                            return `[${value.length} éléments]`;
                          }
                          // Gérer les objets génériques
                          if (typeof value === 'object' && value !== null) {
                            return '[Objet]';
                          }
                          return value || '-';
                        })()}
                      </TableCell>
                    ))}
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => openDialog(index)}
                          disabled={disabled}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(index)}
                          disabled={disabled || (field.validation?.min && value.length <= field.validation.min)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
            <div className="text-muted-foreground mb-4">
              Aucun élément ajouté
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => openDialog()}
              disabled={disabled}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Ajouter le premier élément
            </Button>
          </div>
        )}

        {/* Dialogue pour ajouter/éditer */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingIndex !== null ? 'Modifier' : 'Ajouter'} {itemConfig.title || 'un élément'}
              </DialogTitle>
              <DialogDescription>
                {itemConfig.description || 'Remplissez les champs ci-dessous'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              {itemConfig.fields?.map((subField) => (
                <DynamicField
                  key={subField.name}
                  field={subField}
                  form={dialogForm}
                  disabled={disabled}
                />
              ))}
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={closeDialog}
              >
                Annuler
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                disabled={disabled}
              >
                {editingIndex !== null ? 'Modifier' : 'Ajouter'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </FieldWrapper>
  );
}