import { v2 as cloudinary } from 'cloudinary';

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResult {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  folder: string;
  original_filename: string;
}

/**
 * Upload une image vers Cloudinary
 */
export async function uploadToCloudinary(
  file: File,
  folder: string = 'be-digital'
): Promise<CloudinaryUploadResult> {
  try {
    // Convertir le fichier en base64
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const dataURI = `data:${file.type};base64,${base64}`;

    // Upload vers Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder,
      resource_type: 'auto',
      transformation: [
        { width: 1920, height: 1080, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });

    return result as CloudinaryUploadResult;
  } catch (error) {
    console.error('Erreur lors de l\'upload vers Cloudinary:', error);
    throw new Error('Échec de l\'upload de l\'image');
  }
}

/**
 * Supprime une image de Cloudinary
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'image:', error);
    throw new Error('Échec de la suppression de l\'image');
  }
}

/**
 * Génère une URL optimisée pour une image Cloudinary
 */
export function getOptimizedImageUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: string | number;
    format?: string;
  } = {}
): string {
  const { width = 800, height, quality = 'auto', format = 'auto' } = options;

  return cloudinary.url(publicId, {
    transformation: [
      { width, height, crop: 'fill' },
      { quality },
      { fetch_format: format }
    ],
    secure: true,
  });
}

export default cloudinary;