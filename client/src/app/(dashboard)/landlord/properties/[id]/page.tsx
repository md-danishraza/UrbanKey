'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { ImageGallery } from '@/components/properties/ImageGallery';
import { PropertyDetails } from '@/components/properties/PropertyDetails';
import { PropertyAnalytics } from '@/components/properties/PropertyAnalytics';
import { PropertyMap } from '@/components/properties/PropertyMap';
import { PropertyActions } from '@/components/properties/PropertyActions';
import { apiClient } from '@/lib/api/api-client';

export default function PropertyPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id as string;
  const { getToken } = useAuth();
  const [property, setProperty] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    loadProperty();
  }, [propertyId]);

  const loadProperty = async () => {
    try {
      const token = await getToken();
      setToken(token);
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

  const handleStatusChange = () => {
    loadProperty();
  };

  const handleDelete = () => {
    router.push('/landlord/properties');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
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

  const images = property.images?.map((img: any) => ({
    id: img.id,
    url: img.imageUrl,
    isPrimary: img.isPrimary,
    sortOrder: img.sortOrder,
  })) || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link 
            href="/landlord/properties" 
            className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Properties
          </Link>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            {images.length > 0 && (
              <ImageGallery images={images} />
            )}

            {/* Property Details */}
            <PropertyDetails property={property} />
          </div>

          {/* Right Column - Actions and Analytics */}
          <div className="space-y-6">
            {/* Actions Card */}
            <PropertyActions
              propertyId={propertyId}
              isActive={property.isActive}
              token={token}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />

            {/* Analytics Card */}
            <PropertyAnalytics
              propertyId={propertyId}
              token={token}
            />

            {/* Map Card */}
            <PropertyMap
              latitude={property.latitude}
              longitude={property.longitude}
              address={`${property.addressLine1}, ${property.city}`}
              title={property.title}
            />
          </div>
        </div>
      </div>
    </div>
  );
}