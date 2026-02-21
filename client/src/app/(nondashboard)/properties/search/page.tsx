'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PropertyList } from '@/components/properties/PropertyList';
import { PropertyFilters } from '@/components/properties/PropertyFilters';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SlidersHorizontal, Map, List } from 'lucide-react';
import { SearchFilters } from '@/types/property';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [filters, setFilters] = useState<SearchFilters>({
    city: searchParams.get('city') || '',
    minRent: Number(searchParams.get('minRent')) || 0,
    maxRent: Number(searchParams.get('maxRent')) || 100000,
    bhk: searchParams.getAll('bhk') || [],
    furnishing: searchParams.getAll('furnishing') || [],
    tenantType: (searchParams.get('tenantType') as any) || 'both',
    hasWater247: searchParams.get('hasWater247') === 'true',
    hasPowerBackup: searchParams.get('hasPowerBackup') === 'true',
    hasIglPipeline: searchParams.get('hasIglPipeline') === 'true',
    isDirectOwner: searchParams.get('isDirectOwner') === 'true',
    nearbyMetro: searchParams.get('nearbyMetro') === 'true',
  });

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.city) params.set('city', filters.city);
    if (filters.minRent > 0) params.set('minRent', filters.minRent.toString());
    if (filters.maxRent < 100000) params.set('maxRent', filters.maxRent.toString());
    if (filters.bhk.length) params.set('bhk', filters.bhk.join(','));
    if (filters.furnishing.length) params.set('furnishing', filters.furnishing.join(','));
    if (filters.tenantType !== 'both') params.set('tenantType', filters.tenantType);
    if (filters.hasWater247) params.set('hasWater247', 'true');
    if (filters.hasPowerBackup) params.set('hasPowerBackup', 'true');
    if (filters.hasIglPipeline) params.set('hasIglPipeline', 'true');
    if (filters.isDirectOwner) params.set('isDirectOwner', 'true');
    if (filters.nearbyMetro) params.set('nearbyMetro', 'true');

    window.history.replaceState({}, '', `?${params.toString()}`);
  }, [filters]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Find Your Perfect Rental</h1>
              <p className="text-gray-600 mt-1">
                Discover homes that match your lifestyle
              </p>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="gap-2"
              >
                <List className="h-4 w-4" />
                Grid
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('map')}
                className="gap-2"
              >
                <Map className="h-4 w-4" />
                Map
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Show Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
              <PropertyFilters filters={filters} setFilters={setFilters} />
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex gap-6">
          {/* Desktop Filters */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <PropertyFilters filters={filters} setFilters={setFilters} />
          </div>

          {/* Property List/Map */}
          <div className="flex-1">
            {viewMode === 'grid' ? (
              <PropertyList filters={filters} />
            ) : (
              <div className="bg-white rounded-lg p-4 h-[600px] flex items-center justify-center border">
                <p className="text-gray-500">Map view coming soon with Mapbox integration</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}