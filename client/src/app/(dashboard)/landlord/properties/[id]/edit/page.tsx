'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'sonner';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

import { PropertyForm } from '@/components/properties/PropertyForm';
import { apiClient } from '@/lib/api/api-client';

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;
  const { getToken } = useAuth();
  const [property, setProperty] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

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
      
      toast.success('Property updated successfully!');
      router.push(`/landlord/properties/${propertyId}`);
    } catch (error) {
      console.error('Failed to update property:', error);
      toast.error('Failed to update property. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link 
            href={`/landlord/properties/${propertyId}`}
            className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Property
          </Link>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-6">Edit Property</h1>
          <PropertyForm initialData={property} onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}