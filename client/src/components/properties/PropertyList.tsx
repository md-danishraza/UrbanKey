'use client';

import { useEffect, useState } from 'react';
import { PropertyCard } from './PropertyCard';
import { Property } from '@/types/property';
import { useAppSelector } from '@/state';
import { Skeleton } from '@/components/ui/skeleton';

interface PropertyListProps {
  filters: any; // Use your SearchFilters type here
}

export function PropertyList({ filters }: PropertyListProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        // Build query string from filters
        const queryParams = new URLSearchParams();
        if (filters.city) queryParams.append('city', filters.city);
        if (filters.minRent) queryParams.append('minRent', filters.minRent.toString());
        if (filters.maxRent) queryParams.append('maxRent', filters.maxRent.toString());
        if (filters.bhk.length) queryParams.append('bhk', filters.bhk.join(','));
        if (filters.furnishing.length) queryParams.append('furnishing', filters.furnishing.join(','));
        if (filters.tenantType) queryParams.append('tenantType', filters.tenantType);
        if (filters.hasWater247) queryParams.append('hasWater247', 'true');
        if (filters.hasPowerBackup) queryParams.append('hasPowerBackup', 'true');
        if (filters.hasIglPipeline) queryParams.append('hasIglPipeline', 'true');

        // Mock API call - replace with actual API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockProperties: Property[] = [
          {
            id: '1',
            title: 'Modern 2BHK in Whitefield',
            description: 'Spacious apartment with modern amenities',
            bhk: '2BHK',
            rent: 25000,
            furnishing: 'semi-furnished',
            tenant_type: 'family',
            is_active: true,
            is_broker: false,
            address_line1: '123 Main St',
            city: 'Bangalore',
            state: 'Karnataka',
            pincode: '560066',
            has_water_247: true,
            has_power_backup: true,
            has_igl_pipeline: false,
            nearest_metro_station: 'Baiyappanahalli',
            distance_to_metro_km: 1.2,
            images: [],
            landlord_id: 'l1',
            landlord_name: 'Rajesh Kumar',
            landlord_phone: '9876543210',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '2',
            title: 'Fully Furnished 1BHK near Metro',
            description: 'Perfect for bachelors',
            bhk: '1BHK',
            rent: 18000,
            furnishing: 'fully-furnished',
            tenant_type: 'bachelors',
            is_active: true,
            is_broker: true,
            brokerage_fee: 18000,
            address_line1: '456 Park Ave',
            city: 'Bangalore',
            state: 'Karnataka',
            pincode: '560037',
            has_water_247: true,
            has_power_backup: false,
            has_igl_pipeline: true,
            nearest_metro_station: 'Indiranagar',
            distance_to_metro_km: 0.8,
            images: [],
            landlord_id: 'l2',
            landlord_name: 'Priya Sharma',
            landlord_phone: '9876543211',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];

        setProperties(mockProperties);
      } catch (err) {
        setError('Failed to load properties');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [filters]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-semibold mb-2">No properties found</h3>
        <p className="text-gray-600">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}