'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, Train, Building, Users } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { WaterBackupTags } from '../features/WaterBackupTags';
import { BrokerageBadge } from '../features/BrokerageBadge';
import { Property } from '@/types/property';
import { formatCurrency } from '@/lib/utils';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const { isInWishlist, toggleWishlist, loading } = useWishlist(property.id);

  const getTenantTypeIcon = (type: string) => {
    switch (type) {
      case 'family':
        return <Users className="h-3 w-3 mr-1" />;
      case 'bachelors':
        return <Users className="h-3 w-3 mr-1" />;
      default:
        return <Users className="h-3 w-3 mr-1" />;
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group p-0">
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={property.images?.[0] || '/images/property-placeholder.jpg'}
          alt={property.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/90 hover:bg-white shadow-md"
          onClick={toggleWishlist}
          disabled={loading}
        >
          <Heart 
            className={`h-5 w-5 transition-colors ${
              isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`} 
          />
        </Button>
        
        {/* Owner/Broker Badge */}
        <div className="absolute top-2 left-2">
          {property.is_broker ? (
            <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
              Broker
            </Badge>
          ) : (
            <Badge className="bg-green-600 text-white border-none">
              Direct Owner
            </Badge>
          )}
        </div>

        {/* Price on image */}
        <div className="absolute bottom-2 left-2 text-white">
          <p className="text-2xl font-bold">₹{formatCurrency(property.rent)}</p>
          <p className="text-sm opacity-90">per month</p>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Title and Basic Info */}
        <div className="mb-3">
          <h3 className="font-semibold text-lg line-clamp-1 mb-1">{property.title}</h3>
          <div className="flex items-center gap-1 text-gray-600">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm truncate">{property.address_line1}, {property.city}</span>
          </div>
        </div>

        {/* Metro Distance - Key Feature */}
        {property.distance_to_metro_km && (
          <div className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded-md mb-3">
            <Train className="h-4 w-4" />
            <span className="text-sm font-medium">
              {property.distance_to_metro_km} km from {property.nearest_metro_station}
            </span>
          </div>
        )}

        {/* Property Specs */}
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="outline" className="bg-gray-50">
            <Building className="h-3 w-3 mr-1" />
            {property.bhk}
          </Badge>
          <Badge variant="outline" className="bg-gray-50 capitalize">
            {property.furnishing.replace('-', ' ')}
          </Badge>
          <Badge variant="outline" className="bg-gray-50 capitalize">
            {getTenantTypeIcon(property.tenant_type)}
            {property.tenant_type}
          </Badge>
        </div>

        {/* Indian Amenities Tags */}
        <WaterBackupTags property={property} className="mb-3" />

        {/* Brokerage Info */}
        {property.is_broker && property.brokerage_fee && (
          <div className="mb-3">
            <BrokerageBadge fee={property.brokerage_fee} rent={property.rent} />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <Link href={`/properties/${property.id}`} className="flex-1">
            <Button variant="default" className="w-full bg-blue-600 hover:bg-blue-700">
              View Details
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className="flex-1 border-green-600 text-green-600 hover:bg-green-50"
            onClick={() => window.open(`https://wa.me/${property.landlord_phone}?text=${encodeURIComponent(`Hi, I'm interested in your property "${property.title}"`)}`, '_blank')}
          >
            <Image src="/whatsapp-icon.png" alt="WhatsApp" width={16} height={16} className="mr-2" />
            WhatsApp
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}