'use client';

import { useState, useEffect } from 'react';
import { ImageUpload } from './ImageUpload';
import { ImageGallery } from './ImageGallery';
import { apiClient } from '@/lib/api/api-client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Property } from '@/types';
import { cn } from '@/lib/utils';

interface ImageItem {
  id: string;
  url: string;
  isPrimary: boolean;
  sortOrder: number;
  existingImage?: boolean;
  file?: File;
}

interface ImageManagerProps {
  propertyId: string;
  onImagesChange?: (images: ImageItem[]) => void;
  readOnly?: boolean;
}

export function ImageManager({ propertyId, onImagesChange, readOnly = false }: ImageManagerProps) {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // Get token from Clerk
  useEffect(() => {
    const getToken = async () => {
      const { getToken: getClerkToken } = await import('@clerk/nextjs');
      const token = await getClerkToken();
      setToken(token);
    };
    getToken();
  }, []);

  // Load existing images
  useEffect(() => {
    if (!propertyId || !token) return;
    loadImages();
  }, [propertyId, token]);

  const loadImages = async () => {
    try {
      const property:Property = await apiClient.get(`/api/properties/${propertyId}`, token);
      if (property.images && property.images.length > 0) {
        const loadedImages: ImageItem[] = property.images.map((img: any, index: number) => ({
          id: img.id,
          url: img.imageUrl,
          isPrimary: img.isPrimary,
          sortOrder: img.sortOrder || index,
          existingImage: true,
        }));
        setImages(loadedImages);
        if (onImagesChange) onImagesChange(loadedImages);
      }
    } catch (error) {
      console.error('Failed to load images:', error);
      toast.error('Failed to load property images');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetPrimary = async (imageId: string) => {
    if (!token) return;
    
    setIsSaving(true);
    try {
      await apiClient.put(`/api/images/properties/${propertyId}/images/${imageId}/primary`, {}, token);
      
      // Update local state
      const updatedImages = images.map(img => ({
        ...img,
        isPrimary: img.id === imageId
      }));
      setImages(updatedImages);
      if (onImagesChange) onImagesChange(updatedImages);
      
      toast.success('Primary image updated');
    } catch (error) {
      console.error('Failed to set primary image:', error);
      toast.error('Failed to update primary image');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!token) return;
    
    setIsSaving(true);
    try {
      await apiClient.delete(`/api/images/properties/${propertyId}/images/${imageId}`, token);
      
      // Update local state
      const updatedImages = images.filter(img => img.id !== imageId);
      setImages(updatedImages);
      if (onImagesChange) onImagesChange(updatedImages);
      
      toast.success('Image deleted');
    } catch (error) {
      console.error('Failed to delete image:', error);
      toast.error('Failed to delete image');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImagesChange = (newImages: ImageItem[]) => {
    setImages(newImages);
    if (onImagesChange) onImagesChange(newImages);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (readOnly) {
    return <ImageGallery images={images} />;
  }

  return (
    <div className="space-y-6">
      {/* Existing Images Gallery */}
      {images.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold">Current Images</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((image) => (
              <div key={image.id} className="relative group">
                <div className={cn(
                  "relative rounded-lg overflow-hidden border-2",
                  image.isPrimary ? "border-blue-500" : "border-gray-200"
                )}>
                  <img
                    src={image.url}
                    alt="Property"
                    className="w-full h-32 object-cover"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {!image.isPrimary && (
                      <button
                        onClick={() => handleSetPrimary(image.id)}
                        disabled={isSaving}
                        className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                      >
                        Set Primary
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteImage(image.id)}
                      disabled={isSaving}
                      className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {image.isPrimary && (
                  <span className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                    Primary
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload New Images */}
      <div className="space-y-4">
        <h3 className="font-semibold">Add New Images</h3>
        <ImageUpload
          images={images.filter(img => !img.existingImage)}
          onImagesChange={handleImagesChange}
          onSetPrimary={handleSetPrimary}
          onDelete={handleDeleteImage}
          maxImages={10 - images.length}
          isLoading={isSaving}
          isEditMode={true}
        />
      </div>
    </div>
  );
}