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
import { AntigravityBackground } from '@/components/common/AntigravityBackground';

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
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
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
    <div className="min-h-screen bg-transparent py-8 px-4 relative text-gray-200">
      {/* Background layer */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <AntigravityBackground />
      </div>

      {/* Content Layer */}
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Back Button */}
        <Link href="/properties/search" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 font-medium">
          <ArrowLeft className="h-4 w-4" />
          Back to Search
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Image Gallery */}
            {images.length > 0 && (
              <div className="rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                <ImageGallery images={images} />
              </div>
            )}

            {/* Property Title & Actions */}
            <div className="flex justify-between items-start gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">{property.title}</h1>
                <div className="flex items-center gap-2 mt-2 text-gray-400">
                  <MapPin className="h-4 w-4 text-rose-500" />
                  <span>{property.addressLine1}, {property.city}</span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button variant="outline" size="icon" onClick={handleShare} className="bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white">
                  <Share2 className="h-4 w-4" />
                </Button>
                {isSignedIn && (
                  <WishlistButton 
                    propertyId={propertyId} 
                    variant="outline" 
                    size="icon" 
                    className="bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white"
                  />
                )}
              </div>
            </div>

            {/* Price & Specs */}
            <div className="bg-gray-900/60 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <p className="text-4xl font-bold text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.2)]">
                  ₹{formatCurrency(property.rent)}<span className="text-lg text-gray-400 font-normal">/month</span>
                </p>
                <Badge className={property.isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'}>
                  {property.isActive ? 'Available' : 'Not Available'}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-white/5 border border-white/10 rounded-xl transition-colors hover:bg-white/10">
                  <Home className="h-6 w-6 mx-auto text-blue-400 mb-2" />
                  <p className="font-medium text-white">{property.bhk.replace('_', ' ')}</p>
                  <p className="text-xs text-gray-400 mt-1">BHK</p>
                </div>
                <div className="text-center p-4 bg-white/5 border border-white/10 rounded-xl transition-colors hover:bg-white/10">
                  <Building2 className="h-6 w-6 mx-auto text-purple-400 mb-2" />
                  <p className="font-medium text-white capitalize">{property.furnishing.toLowerCase().replace('_', '-')}</p>
                  <p className="text-xs text-gray-400 mt-1">Furnishing</p>
                </div>
                <div className="text-center p-4 bg-white/5 border border-white/10 rounded-xl transition-colors hover:bg-white/10">
                  <Users className="h-6 w-6 mx-auto text-orange-400 mb-2" />
                  <p className="font-medium text-white capitalize">{property.tenantType.toLowerCase()}</p>
                  <p className="text-xs text-gray-400 mt-1">Tenant Type</p>
                </div>
                {property.nearestMetroStation && (
                  <div className="text-center p-4 bg-white/5 border border-white/10 rounded-xl transition-colors hover:bg-white/10">
                    <Train className="h-6 w-6 mx-auto text-emerald-400 mb-2" />
                    <p className="font-medium text-white text-sm truncate px-1" title={property.nearestMetroStation}>{property.nearestMetroStation}</p>
                    <p className="text-xs text-gray-400 mt-1">{property.distanceToMetroKm} km</p>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <Card className="bg-gray-900/60 border-white/10 backdrop-blur-md shadow-xl">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  Description
                </h2>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">{property.description}</p>
              </CardContent>
            </Card>

            {/* Amenities */}
            {amenities.length > 0 && (
              <Card className="bg-gray-900/60 border-white/10 backdrop-blur-md shadow-xl">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg">
                        {amenity.includes('Water') && <Droplet className="h-5 w-5 text-blue-400" />}
                        {amenity.includes('Power') && <Zap className="h-5 w-5 text-yellow-400" />}
                        {amenity.includes('IGL') && <Flame className="h-5 w-5 text-orange-500" />}
                        {amenity.includes('Parking') && <Car className="h-5 w-5 text-gray-400" />}
                        <span className="text-sm font-medium text-gray-200">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-6">
            <Card className="sticky top-24 bg-gray-900/80 border-white/10 backdrop-blur-xl shadow-2xl">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-white mb-6">Contact & Actions</h2>
                
                {/* Owner Info */}
                <div className="flex items-center gap-4 mb-6 p-4 bg-white/5 border border-white/10 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                    <Users className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{property.landlord?.fullName || 'Property Owner'}</p>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      {property.landlord?.isVerified ? (
                        <span className="text-emerald-400 flex items-center gap-1">✓ Verified Owner</span>
                      ) : (
                        <span>Verification pending</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                {isSignedIn ? (
                  <div className="space-y-3">
                    {/* WhatsApp Button */}
                    <WhatsAppButton
                      phoneNumber={property.landlord?.phone || '9876543210'}
                      propertyTitle={property.title}
                      variant="default"
                      className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white border-none"
                    />
                    
                    <VisitForm
                      propertyId={propertyId}
                      propertyTitle={property.title}
                      trigger={
                        <Button variant="outline" className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white transition-colors">
                          <Eye className="mr-2 h-4 w-4 text-blue-400" />
                          Schedule Visit
                        </Button>
                      }
                    />
                    
                    <EnquiryForm
                      propertyId={propertyId}
                      propertyTitle={property.title}
                      trigger={
                        <Button variant="outline" className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white transition-colors">
                          Send Enquiry
                        </Button>
                      }
                    />
                  </div>
                ) : (
                  <Link href={`/auth/login?redirect=/properties/${propertyId}`}>
                    <Button className="w-full bg-rose-500 hover:bg-rose-600 text-white border-none shadow-[0_0_15px_rgba(244,63,94,0.3)] transition-all">
                      Login to Contact
                    </Button>
                  </Link>
                )}

                <Separator className="my-6 bg-white/10" />
                
                {/* map */}
                <div className="rounded-xl overflow-hidden border border-white/10">
                  <PropertyMap
                    latitude={property.latitude}
                    longitude={property.longitude}
                    address={`${property.addressLine1}, ${property.city}`}
                    title={property.title}
                  />
                </div>
                
                <Separator className="my-6 bg-white/10" />

                {/* Broker Info */}
                {property.isBroker && property.brokerageFee && (
                  <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-xl mt-4">
                    <p className="text-sm text-orange-400 flex flex-col gap-1">
                      <span className="font-semibold text-orange-300">Brokerage Required:</span> 
                      <span>₹{formatCurrency(property.brokerageFee)} <span className="text-xs opacity-80">({(property.brokerageFee / property.rent).toFixed(1)} months rent)</span></span>
                    </p>
                  </div>
                )}

                <p className="text-xs text-gray-500 text-center mt-6">
                  Your contact details will be shared securely with the owner upon enquiry.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}