'use client';

import { useState } from 'react';
import { Filter, Grid, Map, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { PropertyFilters } from '@/components/properties/PropertyFilters';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { SemanticSearch } from '@/components/search/SemanticSearch';
import { apiClient } from '@/lib/api/api-client';
import { SearchFilters } from '@/types/property';

// Default filter values
const defaultFilters: SearchFilters = {
  minRent: 0,
  maxRent: 100000,
  bhk: [],
  furnishing: [],
  tenantType: 'both',
  hasWater247: false,
  hasPowerBackup: false,
  hasIglPipeline: false,
  isDirectOwner: false,
  nearbyMetro: false,
  city: '',
};

export default function PropertiesSearchPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);

  const handleSemanticSearch = async (query: string) => {
    setIsLoading(true);
    setSearchQuery(query);
    try {
      const response: any = await apiClient.get(`/api/properties/semantic?q=${encodeURIComponent(query)}`);
      setProperties(response.results || []);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterSearch = async (newFilters: SearchFilters) => {
    setIsLoading(true);
    setFilters(newFilters);
    try {
      // Build query string
      const params = new URLSearchParams();
      
      // Add filters only if they have values
      if (newFilters.city) params.append('city', newFilters.city);
      if (newFilters.minRent > 0) params.append('minRent', newFilters.minRent.toString());
      if (newFilters.maxRent < 100000) params.append('maxRent', newFilters.maxRent.toString());
      if (newFilters.bhk.length) params.append('bhk', newFilters.bhk.join(','));
      if (newFilters.furnishing.length) params.append('furnishing', newFilters.furnishing.join(','));
      if (newFilters.tenantType !== 'both') params.append('tenantType', newFilters.tenantType);
      if (newFilters.hasWater247) params.append('hasWater247', 'true');
      if (newFilters.hasPowerBackup) params.append('hasPowerBackup', 'true');
      if (newFilters.hasIglPipeline) params.append('hasIglPipeline', 'true');
      if (newFilters.isDirectOwner) params.append('isDirectOwner', 'true');
      if (newFilters.nearbyMetro) params.append('nearbyMetro', 'true');
      
      const response: any = await apiClient.get(`/api/properties?${params.toString()}`);
      setProperties(response.data || []);
    } catch (error) {
      console.error('Filter search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    handleFilterSearch(defaultFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Search Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            Find Your Perfect Home
          </h1>
          <p className="text-white/80 text-center mb-8">
            Search with AI - describe what you're looking for in natural language
          </p>
          <div className="max-w-3xl mx-auto">
            <SemanticSearch
              onSearch={handleSemanticSearch}
              isLoading={isLoading}
              placeholder="e.g., 'Spacious 2BHK near metro with power backup and 24/7 water'"
            />
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-gray-600">
              {properties.length} properties found
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'map' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('map')}
            >
              <Map className="h-4 w-4" />
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <PropertyFilters filters={filters} setFilters={handleFilterSearch} />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Desktop Filters */}
        <div className="hidden lg:block mb-6">
          <PropertyFilters filters={filters} setFilters={handleFilterSearch} />
        </div>

        {/* Results Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No properties found matching your criteria</p>
            <Button variant="outline" onClick={handleClearSearch}>
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property: any) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}