'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Maximize2, Minimize2 } from 'lucide-react';

import { cn } from '@/lib/utils';

interface ImageItem {
  id: string;
  url: string;
  isPrimary: boolean;
  sortOrder: number;
}

interface ImageGalleryProps {
  images: ImageItem[];
  className?: string;
}

export function ImageGallery({ images, className }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const sortedImages = [...images].sort((a, b) => a.sortOrder - b.sortOrder);
  const primaryImage = sortedImages.find(img => img.isPrimary) || sortedImages[0];

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    }
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
    document.body.style.overflow = 'auto';
  };

  const nextImage = () => {
    if (selectedIndex !== null && selectedIndex < sortedImages.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const prevImage = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Keyboard navigation
  useState(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex !== null) {
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'Escape') closeLightbox();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  if (!primaryImage) {
    return (
      <div className={cn("bg-gray-100 rounded-lg flex items-center justify-center h-96", className)}>
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <>
      {/* Main Image */}
      <div className={cn("relative group", className)}>
        <div className="relative h-96 md:h-[500px] rounded-xl overflow-hidden bg-gray-100">
          <img
            src={primaryImage.url}
            alt="Primary property image"
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => openLightbox(sortedImages.findIndex(img => img.id === primaryImage.id))}
          />
          
          {/* Thumbnail Strip */}
          {sortedImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {sortedImages.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => openLightbox(idx)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    img.id === primaryImage.id ? "w-6 bg-white" : "bg-white/60 hover:bg-white/80"
                  )}
                />
              ))}
            </div>
          )}

          {/* Image Counter */}
          {sortedImages.length > 1 && (
            <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
              {sortedImages.findIndex(img => img.id === primaryImage.id) + 1} / {sortedImages.length}
            </div>
          )}
        </div>

        {/* Thumbnail Gallery */}
        {sortedImages.length > 1 && (
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2 mt-4">
            {sortedImages.map((img, idx) => (
              <button
                key={img.id}
                onClick={() => openLightbox(idx)}
                className={cn(
                  "relative h-20 rounded-lg overflow-hidden border-2 transition-all",
                  img.id === primaryImage.id ? "border-blue-500" : "border-transparent hover:border-gray-300"
                )}
              >
                <img
                  src={img.url}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-10 p-2 text-white hover:text-gray-300 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>

              {/* Fullscreen Toggle */}
              <button
                onClick={toggleFullscreen}
                className="absolute top-4 right-16 z-10 p-2 text-white hover:text-gray-300 transition-colors"
              >
                {isFullscreen ? <Minimize2 className="h-6 w-6" /> : <Maximize2 className="h-6 w-6" />}
              </button>

              {/* Navigation Buttons */}
              {selectedIndex > 0 && (
                <button
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="absolute left-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                >
                  <ChevronLeft className="h-8 w-8 text-white" />
                </button>
              )}
              
              {selectedIndex < sortedImages.length - 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                >
                  <ChevronRight className="h-8 w-8 text-white" />
                </button>
              )}

              {/* Current Image */}
              <img
                src={sortedImages[selectedIndex].url}
                alt={`Property image ${selectedIndex + 1}`}
                className="max-w-full max-h-full object-contain p-4"
                onClick={(e) => e.stopPropagation()}
              />

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {selectedIndex + 1} / {sortedImages.length}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}