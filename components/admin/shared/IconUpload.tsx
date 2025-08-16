'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Eye, Trash2, Image as ImageIcon } from 'lucide-react';

interface IconUploadProps {
  currentIconUrl?: string;
  onIconChange: (iconUrl: string) => void;
  onRemove: () => void;
  className?: string;
}

export function IconUpload({
  currentIconUrl,
  onIconChange,
  onRemove,
  className = ""
}: IconUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const uploadId = `icon-upload-${Math.random().toString(36).substr(2, 9)}`;

  const handleIconUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Le fichier doit être une image (PNG, SVG, JPG, WebP)');
      }

      // Validate file size (max 2MB for icons)
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        throw new Error('La taille du fichier ne doit pas dépasser 2MB pour les icônes');
      }

      // Upload to Cloudinary via API
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'be-digital/service-icons');

      const response = await fetch('/api/admin/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'upload');
      }

      const result = await response.json();
      
      if (result.success && result.data?.url) {
        onIconChange(result.data.url);
      } else {
        throw new Error('Réponse invalide du serveur');
      }
      
    } catch (error) {
      console.error('Upload failed:', error);
      alert(error instanceof Error ? error.message : 'Erreur lors de l\'upload de l\'icône');
    } finally {
      setIsUploading(false);
    }

    // Reset input
    event.target.value = '';
  };

  const handlePreview = () => {
    if (currentIconUrl) {
      window.open(currentIconUrl, '_blank');
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Current Icon Preview */}
      {currentIconUrl ? (
        <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
          <div className="flex-shrink-0 p-2 border rounded-md bg-white">
            <img 
              src={currentIconUrl} 
              alt="Icône du service"
              className="w-6 h-6 object-contain"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">Icône actuelle</p>
            <p className="text-xs text-muted-foreground truncate">
              {currentIconUrl.split('/').pop()}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePreview}
            >
              <Eye className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
          <ImageIcon className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-1">
            Aucune icône sélectionnée
          </p>
          <p className="text-xs text-muted-foreground">
            Uploadez une icône pour votre service
          </p>
        </div>
      )}

      {/* Upload Button */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => document.getElementById(uploadId)?.click()}
          disabled={isUploading}
          className="flex-1"
        >
          <Upload className="h-3 w-3 mr-2" />
          {isUploading ? 'Upload...' : currentIconUrl ? 'Changer' : 'Uploader'}
        </Button>
        
        <input
          id={uploadId}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleIconUpload}
        />

        {currentIconUrl && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handlePreview}
          >
            <Eye className="h-3 w-3" />
          </Button>
        )}
      </div>
      
      <div className="text-xs text-muted-foreground space-y-1">
        <p>• Formats: PNG, SVG, JPG, WebP</p>
        <p>• Taille recommandée: 64x64px (max 2MB)</p>
        <p>• Pour une meilleure qualité, utilisez SVG ou PNG</p>
      </div>
    </div>
  );
}