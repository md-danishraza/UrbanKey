'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { PropertyForm } from '@/components/properties/PropertyForm';
import { apiClient } from '@/lib/api/api-client';
import { Property } from '@/types';

export default function CreatePropertyPage() {
  const router = useRouter();
  const { getToken } = useAuth();

  const handleSubmit = async (formData: any, images: File[]) => {
    try {
      const token = await getToken();
      
      // First, create the property
      const property:Property = await apiClient.post('/api/properties', formData, token);
      
      // Then, upload images if any
      if (images.length > 0) {
        const formDataWithImages = new FormData();
        images.forEach(image => {
          formDataWithImages.append('images', image);
        });
        
        await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/images/properties/${property.id}/images`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataWithImages,
        });
      }
      
      toast.success('Property created successfully!');
      router.push('/landlord/properties');
    } catch (error) {
      console.error('Failed to create property:', error);
      toast.error('Failed to create property. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link 
            href="/landlord/properties" 
            className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Properties
          </Link>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-6">List a New Property</h1>
          <PropertyForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}