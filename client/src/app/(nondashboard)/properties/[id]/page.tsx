'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { 
  MapPin, Train, Home, Users, Building2, 
  Droplet, Zap, Flame, Car, ArrowLeft, 
  Loader2, Share2, Eye
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

import { ImageGallery } from '@/components/properties/ImageGallery';
import { EnquiryForm } from '@/components/tenant/EnquiryForm';
import { VisitForm } from '@/components/tenant/VisitForm';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';
import { WishlistButton } from '@/components/tenant/WishlistButton';
import { apiClient } from '@/lib/api/api-client';
import { formatCurrency } from '@/lib/utils';
import { PropertyMap } from '@/components/properties/PropertyMap';

export default function PropertyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id as string;
  const { getToken, isSignedIn } = useAuth();
  const [property, setProperty] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProperty();
  }, [propertyId]);

  const loadProperty = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      const data = await apiClient.get(`/api/properties/${propertyId}`, token);
      setProperty(data);
    } catch (error) {
      console.error('Failed to load property:', error);
      toast.error('Failed to load property details');
      router.push('/properties/search');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!property) return null;

  const images = property.images?.map((img: any) => ({
    id: img.id,
    url: img.imageUrl,
    isPrimary: img.isPrimary,
    sortOrder: img.sortOrder,
  })) || [];

  const amenities = [];
  if (property.hasWater247) amenities.push('24/7 Water Supply');
  if (property.hasPowerBackup) amenities.push('Power Backup');
  if (property.hasIglPipeline) amenities.push('IGL Gas Pipeline');
  if (property.parkingAvailable) amenities.push('Parking');
  if (property.petFriendly) amenities.push('Pet Friendly');

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link href="/properties/search" className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Search
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            {images.length > 0 && <ImageGallery images={images} />}

            {/* Property Title & Actions */}
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold">{property.title}</h1>
                <div className="flex items-center gap-2 mt-1 text-gray-500">
                  <MapPin className="h-4 w-4" />
                  <span>{property.addressLine1}, {property.city}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
                {isSignedIn && <WishlistButton propertyId={propertyId} variant="outline" size="icon" />}
              </div>
            </div>

            {/* Price & Specs */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <p className="text-3xl font-bold text-blue-600">
                  ₹{formatCurrency(property.rent)}<span className="text-sm text-gray-500">/month</span>
                </p>
                <Badge className={property.isActive ? 'bg-green-500' : 'bg-gray-500'}>
                  {property.isActive ? 'Available' : 'Not Available'}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Home className="h-5 w-5 mx-auto text-gray-600 mb-1" />
                  <p className="font-medium">{property.bhk.replace('_', ' ')}</p>
                  <p className="text-xs text-gray-500">BHK</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Building2 className="h-5 w-5 mx-auto text-gray-600 mb-1" />
                  <p className="font-medium capitalize">{property.furnishing.toLowerCase().replace('_', '-')}</p>
                  <p className="text-xs text-gray-500">Furnishing</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Users className="h-5 w-5 mx-auto text-gray-600 mb-1" />
                  <p className="font-medium capitalize">{property.tenantType.toLowerCase()}</p>
                  <p className="text-xs text-gray-500">Tenant Type</p>
                </div>
                {property.nearestMetroStation && (
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Train className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                    <p className="font-medium text-sm">{property.nearestMetroStation}</p>
                    <p className="text-xs text-gray-500">{property.distanceToMetroKm} km</p>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-3">Description</h2>
                <p className="text-gray-600 leading-relaxed">{property.description}</p>
              </CardContent>
            </Card>

            {/* Amenities */}
            {amenities.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-3">Amenities</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center gap-2">
                        {amenity.includes('Water') && <Droplet className="h-4 w-4 text-blue-500" />}
                        {amenity.includes('Power') && <Zap className="h-4 w-4 text-yellow-500" />}
                        {amenity.includes('IGL') && <Flame className="h-4 w-4 text-orange-500" />}
                        {amenity.includes('Parking') && <Car className="h-4 w-4 text-gray-500" />}
                        <span className="text-sm">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Contact & Actions</h2>
                
                {/* Owner Info */}
                <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{property.landlord?.fullName || 'Owner'}</p>
                    <p className="text-xs text-gray-500">
                      {property.landlord?.isVerified ? '✓ Verified Owner' : 'Verified pending'}
                    </p>
                  </div>
                </div>

                {/* WhatsApp Button */}
                <WhatsAppButton
                  phoneNumber={property.landlord?.phone || '9876543210'}
                  propertyTitle={property.title}
                  variant="default"
                  className="w-full mb-3"
                />

                {/* Action Buttons */}
                {isSignedIn ? (
                  <>
                    <VisitForm
                      propertyId={propertyId}
                      propertyTitle={property.title}
                      trigger={
                        <Button variant="outline" className="w-full mb-3">
                          <Eye className="mr-2 h-4 w-4" />
                          Schedule Visit
                        </Button>
                      }
                    />
                    <EnquiryForm
                      propertyId={propertyId}
                      propertyTitle={property.title}
                      trigger={
                        <Button variant="outline" className="w-full">
                          Send Enquiry
                        </Button>
                      }
                    />
                  </>
                ) : (
                  <Link href={`/auth/login?redirect=/properties/${propertyId}`}>
                    <Button className="w-full mb-3">
                      Login to Contact
                    </Button>
                  </Link>
                )}

                <Separator className="my-4" />
                {/* map */}
                <PropertyMap
                              latitude={property.latitude}
                              longitude={property.longitude}
                              address={`${property.addressLine1}, ${property.city}`}
                              title={property.title}
                />
                
                 <Separator className="my-4" />

                {/* Broker Info */}
                {property.isBroker && property.brokerageFee && (
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <p className="text-sm text-orange-800">
                      <span className="font-semibold">Brokerage:</span> ₹{formatCurrency(property.brokerageFee)}
                      <span className="text-xs ml-1">
                        ({(property.brokerageFee / property.rent).toFixed(1)} months rent)
                      </span>
                    </p>
                  </div>
                )}

                <p className="text-xs text-gray-500 text-center mt-4">
                  Your contact details will be shared with the owner upon enquiry
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}