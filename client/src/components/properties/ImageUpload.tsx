'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Loader2, Star, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ImageItem {
  id: string;
  file?: File;
  url: string;
  isPrimary: boolean;
  sortOrder: number;
  existingImage?: boolean;
  imageId?: string;
}

interface ImageUploadProps {
  images: ImageItem[];
  onImagesChange: (images: ImageItem[]) => void;
  onSetPrimary?: (imageId: string) => Promise<void>;
  onDelete?: (imageId: string) => Promise<void>;
  maxImages?: number;
  isLoading?: boolean;
  isEditMode?: boolean;
}

// Sortable Image Item Component
function SortableImageItem({ 
  image, 
  index, 
  onRemove, 
  onSetPrimary, 
  onDelete,
  isEditMode 
}: { 
  image: ImageItem; 
  index: number; 
  onRemove: (id: string) => void;
  onSetPrimary?: (id: string) => void;
  onDelete?: (id: string) => void;
  isEditMode?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDelete = () => {
    if (image.existingImage && onDelete) {
      onDelete(image.id);
    } else {
      onRemove(image.id);
    }
  };

  const handleSetPrimary = () => {
    if (onSetPrimary && !image.isPrimary) {
      onSetPrimary(image.id);
    }
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        "relative group rounded-lg overflow-hidden border-2",
        image.isPrimary ? "border-blue-500 shadow-lg shadow-blue-100" : "border-gray-200",
        isDragging && "opacity-50 z-50"
      )}
    >
      <img
        src={image.url}
        alt={`Property image ${index + 1}`}
        className="w-full h-40 object-cover"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        {isEditMode && onSetPrimary && (
          <Button
            type="button"
            size="sm"
            variant={image.isPrimary ? "default" : "secondary"}
            onClick={handleSetPrimary}
            className="gap-1"
          >
            {image.isPrimary ? (
              <Star className="h-4 w-4 fill-current" />
            ) : (
              <Star className="h-4 w-4" />
            )}
            {image.isPrimary ? 'Primary' : 'Set Primary'}
          </Button>
        )}
        
        <Button
          type="button"
          size="sm"
          variant="destructive"
          onClick={handleDelete}
          className="gap-1"
        >
          <X className="h-4 w-4" />
          Delete
        </Button>
      </div>

      {/* Drag Handle */}
      {isEditMode && (
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 left-2 cursor-grab active:cursor-grabbing bg-black/50 rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="h-4 w-4 text-white" />
        </div>
      )}

      {/* Primary Badge */}
      {image.isPrimary && (
        <Badge className="absolute top-2 right-2 bg-blue-500 text-white border-0">
          Primary
        </Badge>
      )}

      {/* New Badge for new uploads */}
      {!image.existingImage && (
        <Badge variant="secondary" className="absolute bottom-2 left-2">
          New
        </Badge>
      )}
    </motion.div>
  );
}

export function ImageUpload({ 
  images, 
  onImagesChange, 
  onSetPrimary, 
  onDelete,
  maxImages = 10,
  isLoading = false,
  isEditMode = false
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (images.length + acceptedFiles.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    setError(null);
    setUploading(true);

    // Process each file
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImage: ImageItem = {
          id: `temp-${Date.now()}-${Math.random()}`,
          file,
          url: reader.result as string,
          isPrimary: images.length === 0, // First image becomes primary
          sortOrder: images.length,
        };
        onImagesChange([...images, newImage]);
        setUploading(false);
      };
      reader.readAsDataURL(file);
    });
  }, [images, maxImages, onImagesChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxSize: 5 * 1024 * 1024,
    disabled: isLoading || uploading || images.length >= maxImages,
  });

  const handleRemoveImage = (id: string) => {
    onImagesChange(images.filter(img => img.id !== id));
  };

  const handleSetPrimaryLocal = (id: string) => {
    if (onSetPrimary) {
      onSetPrimary(id);
    } else {
      // Local handling for create mode
      onImagesChange(images.map(img => ({
        ...img,
        isPrimary: img.id === id
      })));
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      const oldIndex = images.findIndex(img => img.id === active.id);
      const newIndex = images.findIndex(img => img.id === over?.id);
      
      const newImages = arrayMove(images, oldIndex, newIndex);
      // Update sort orders
      newImages.forEach((img, idx) => {
        img.sortOrder = idx;
      });
      onImagesChange(newImages);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400",
          (isLoading || uploading || images.length >= maxImages) && "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="h-10 w-10 text-gray-400 animate-spin mb-3" />
            <p className="text-gray-600">Processing images...</p>
          </div>
        ) : (
          <>
            <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">
              {isDragActive ? "Drop images here" : "Drag & drop images here, or click to select"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Up to {maxImages} images, max 5MB each (JPG, PNG, GIF, WebP)
            </p>
            <p className="text-xs text-gray-400 mt-2">
              First image will be set as primary. You can change it later.
            </p>
          </>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">Images ({images.length}/{maxImages})</h3>
            {isEditMode && images.length > 1 && (
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <GripVertical className="h-3 w-3" />
                Drag to reorder
              </p>
            )}
          </div>
          
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={images.map(img => img.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <AnimatePresence>
                  {images.map((image, index) => (
                    <SortableImageItem
                      key={image.id}
                      image={image}
                      index={index}
                      onRemove={handleRemoveImage}
                      onSetPrimary={handleSetPrimaryLocal}
                      onDelete={onDelete}
                      isEditMode={isEditMode}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
}