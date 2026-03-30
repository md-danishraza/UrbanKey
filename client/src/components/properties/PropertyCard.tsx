'use client';

import Link from 'next/link';
import { MapPin, Train, Heart, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { WishlistButton } from '@/components/tenant/WishlistButton';
import { formatCurrency } from '@/lib/utils';

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    rent: number;
    bhk: string;
    city: string;
    images: { imageUrl: string; isPrimary: boolean }[];
    nearestMetroStation?: string;
    distanceToMetroKm?: number;
    isBroker?: boolean;
    brokerageFee?: number;
  };
  showActions?: boolean;
  className?: string;
}

export function PropertyCard({ property, showActions = true, className }: PropertyCardProps) {
  const getPrimaryImage = () => {
    const primary = property.images?.find(img => img.isPrimary);
    return primary?.imageUrl || property.images?.[0]?.imageUrl;
  };

  return (
    <Card className={cn("overflow-hidden hover:shadow-lg transition-shadow group pt-0", className)}>
      <div className="relative h-48 overflow-hidden">
        <img
          src={getPrimaryImage() || '/images/property-placeholder.jpg'}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {showActions && (
          <div className="absolute top-2 right-2">
            <WishlistButton propertyId={property.id} variant="ghost" size="icon" />
          </div>
        )}
        
        <Badge className="absolute bottom-2 left-2 bg-black/70 text-white">
          {property.bhk}
        </Badge>
      </div>
      
      <CardContent className="p-4">
        <Link href={`/properties/${property.id}`}>
          <h3 className="font-semibold text-lg mb-1 hover:text-blue-600 line-clamp-1">
            {property.title}
          </h3>
        </Link>
        
        <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
          <MapPin className="h-4 w-4" />
          <span className="truncate">{property.city}</span>
        </div>
        
        {property.nearestMetroStation && (
          <div className="flex items-center gap-1 text-blue-600 text-xs mb-2">
            <Train className="h-3 w-3" />
            <span>{property.distanceToMetroKm} km from {property.nearestMetroStation}</span>
          </div>
        )}
        
        <div className="flex items-center justify-between mt-2">
          <p className="text-xl font-bold text-blue-600">
            ₹{formatCurrency(property.rent)}<span className="text-sm text-gray-500">/mo</span>
          </p>
          
          {showActions && (
            <Link href={`/properties/${property.id}`}>
              <Button variant="ghost" size="sm" className="gap-1">
                <Eye className="h-4 w-4" />
                View
              </Button>
            </Link>
          )}
        </div>
        
        {property.isBroker && property.brokerageFee && (
          <p className="text-xs text-orange-600 mt-1">
            Broker: ₹{formatCurrency(property.brokerageFee)}
          </p>
        )}
      </CardContent>
    </Card>
  );
}