'use client';

import { MapPin, Home, Users, Building2, Droplet, Zap, Flame, Car, Briefcase, Train } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

import { cn } from '@/lib/utils';

interface PropertyDetailsProps {
  property: any;
  className?: string;
}

export function PropertyDetails({ property, className }: PropertyDetailsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN').format(amount);
  };

  const getBHKLabel = (bhk: string) => {
    const map: Record<string, string> = {
      ONE_BHK: '1 BHK',
      TWO_BHK: '2 BHK',
      THREE_BHK: '3 BHK',
      FOUR_BHK_PLUS: '4 BHK+',
    };
    return map[bhk] || bhk;
  };

  const getFurnishingLabel = (furnishing: string) => {
    const map: Record<string, string> = {
      UNFURNISHED: 'Unfurnished',
      SEMI_FURNISHED: 'Semi-Furnished',
      FULLY_FURNISHED: 'Fully Furnished',
    };
    return map[furnishing] || furnishing;
  };

  const getTenantTypeLabel = (type: string) => {
    const map: Record<string, string> = {
      FAMILY: 'Family',
      BACHELORS: 'Bachelors',
      BOTH: 'Both',
    };
    return map[type] || type;
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Title and Price */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{property.title}</h1>
          <div className="flex items-center gap-2 mt-1 text-gray-500">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{property.addressLine1}, {property.city}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-blue-600">₹{formatCurrency(property.rent)}</p>
          <p className="text-sm text-gray-500">per month</p>
        </div>
      </div>

      {/* Key Specs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <Home className="h-5 w-5 mx-auto text-gray-600 mb-1" />
          <p className="text-sm font-medium">{getBHKLabel(property.bhk)}</p>
          <p className="text-xs text-gray-500">BHK</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <Building2 className="h-5 w-5 mx-auto text-gray-600 mb-1" />
          <p className="text-sm font-medium">{getFurnishingLabel(property.furnishing)}</p>
          <p className="text-xs text-gray-500">Furnishing</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <Users className="h-5 w-5 mx-auto text-gray-600 mb-1" />
          <p className="text-sm font-medium">{getTenantTypeLabel(property.tenantType)}</p>
          <p className="text-xs text-gray-500">Tenant Type</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <Briefcase className="h-5 w-5 mx-auto text-gray-600 mb-1" />
          <p className="text-sm font-medium">{property.isBroker ? 'Broker' : 'Direct Owner'}</p>
          <p className="text-xs text-gray-500">Listing Type</p>
        </div>
      </div>

      {/* Description */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-2">Description</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{property.description}</p>
        </CardContent>
      </Card>

      {/* Amenities */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-3">Amenities</h3>
          <div className="grid grid-cols-2 gap-2">
            {property.hasWater247 && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Droplet className="h-4 w-4 text-blue-500" />
                <span>24/7 Water Supply</span>
              </div>
            )}
            {property.hasPowerBackup && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span>Power Backup</span>
              </div>
            )}
            {property.hasIglPipeline && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Flame className="h-4 w-4 text-orange-500" />
                <span>IGL Gas Pipeline</span>
              </div>
            )}
            {property.parkingAvailable && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Car className="h-4 w-4 text-gray-500" />
                <span>Parking Available</span>
              </div>
            )}
            {property.petFriendly && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="h-4 w-4 text-purple-500" />
                <span>Pet Friendly</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Metro Info */}
      {property.nearestMetroStation && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Train className="h-4 w-4" />
              Nearest Metro
            </h3>
            <p className="text-gray-700">{property.nearestMetroStation}</p>
            <p className="text-sm text-blue-600 mt-1">{property.distanceToMetroKm} km away</p>
          </CardContent>
        </Card>
      )}

      {/* Broker Info */}
      {property.isBroker && property.brokerageFee && (
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4">
            <h3 className="font-semibold text-orange-800 mb-1">Broker Information</h3>
            <p className="text-sm text-orange-700">
              Brokerage Fee: ₹{formatCurrency(property.brokerageFee)}
              <span className="text-xs ml-1">
                ({(property.brokerageFee / property.rent).toFixed(1)} months rent)
              </span>
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}