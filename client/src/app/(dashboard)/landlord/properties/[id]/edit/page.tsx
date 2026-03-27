'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'sonner';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { PropertyForm } from '@/components/properties/PropertyForm';
import { apiClient } from '@/lib/api/api-client';
import { ImageManager } from '@/components/properties/ImageManager';

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;
  const { getToken } = useAuth();
  const [property, setProperty] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImageManagerReady, setIsImageManagerReady] = useState(false);

  useEffect(() => {
    loadProperty();
  }, [propertyId]);

  const loadProperty = async () => {
    try {
      const token = await getToken();
      const data = await apiClient.get(`/api/properties/${propertyId}`, token);
      setProperty(data);
    } catch (error) {
      console.error('Failed to load property:', error);
      toast.error('Failed to load property');
      router.push('/landlord/properties');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData: any, images: File[]) => {
    setIsSubmitting(true);
    
    // Show loading toast
    const loadingToast = toast.loading('Updating property...');
    
    try {
      const token = await getToken();
      
      // Update property
      await apiClient.put(`/api/properties/${propertyId}`, formData, token);
      
      // Upload new images if any
      if (images.length > 0) {
        const formDataWithImages = new FormData();
        images.forEach(image => {
          formDataWithImages.append('images', image);
        });
        
        await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/images/properties/${propertyId}/images`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataWithImages,
        });
      }
      
      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success('Property updated successfully!');
      
      // Small delay before redirect for better UX
      setTimeout(() => {
        router.push(`/landlord/properties/${propertyId}`);
      }, 500);
    } catch (error) {
      console.error('Failed to update property:', error);
      toast.dismiss(loadingToast);
      toast.error('Failed to update property. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Property not found</p>
          <Link href="/landlord/properties">
            <Button>Back to Properties</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with back button and status */}
        <div className="mb-6 flex items-center justify-between">
          <Link 
            href={`/landlord/properties/${propertyId}`}
            className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Property
          </Link>
          
          {/* Save Status Indicator */}
          {isSubmitting && (
            <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Saving changes...</span>
            </div>
          )}
        </div>
        
        {/* Main Form Card */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="border-b border-gray-100 px-6 py-4">
            <h1 className="text-2xl font-bold">Edit Property</h1>
            <p className="text-gray-500 text-sm mt-1">
              Update your property details and images
            </p>
          </div>
          
          <div className="p-6">
            <PropertyForm 
              initialData={property} 
              onSubmit={handleSubmit}
              isLoading={isSubmitting}
            />
          </div>
        </div>
        
        {/* Image Management Section */}
        <div className="mt-8 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-xl font-bold">Manage Images</h2>
            <p className="text-gray-500 text-sm mt-1">
              Add, remove, or reorder property photos
            </p>
          </div>
          <div className="p-6">
            <ImageManager 
              propertyId={propertyId} 
              onImagesChange={() => setIsImageManagerReady(true)}
            />
          </div>
        </div>
        
        {/* Unsaved Changes Warning (Optional) */}
        {isSubmitting && (
          <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-bottom-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Saving your changes...</span>
          </div>
        )}
      </div>
    </div>
  );
}