'use client';

import { useState, useEffect } from 'react';
import {  Map, Loader2, SlidersHorizontal, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { PropertyFilters } from '@/components/properties/PropertyFilters';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { SemanticSearch } from '@/components/search/SemanticSearch';
import { PropertyMapCluster } from '@/components/map/PropertyMapCluster';
import { apiClient } from '@/lib/api/api-client';
import { SearchFilters } from '@/types/property';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { toast } from 'sonner';
import { AntigravityBackground } from '@/components/common/AntigravityBackground';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProperties, setTotalProperties] = useState(0);
  const [isSemanticSearch, setIsSemanticSearch] = useState(false);

  // Load properties on mount
  useEffect(() => {
    loadProperties();
  }, [currentPage]);

  const loadProperties = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', '9'); // 3x3 grid
      
      const response: any = await apiClient.get(`/api/properties?${params.toString()}`);
      if (response.data) {
        setProperties(response.data);
        setTotalPages(response.totalPages);
        setTotalProperties(response.total);
      } else if (Array.isArray(response)) {
        setProperties(response);
      } else {
        setProperties([]);
      }
    } catch (error) {
      console.error('Failed to load properties:', error);
      toast.error('Failed to load properties');
      setProperties([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSemanticSearch = async (query: string) => {
    if (!query.trim()) {
      setIsSemanticSearch(false);
      setCurrentPage(1);
      loadProperties();
      return;
    }
    
    setIsLoading(true);
    setSearchQuery(query);
    setIsSemanticSearch(true);
    try {
      const response: any = await apiClient.get(`/api/properties/semantic?q=${encodeURIComponent(query)}`);
      setProperties(response.results || []);
      setTotalPages(1); // Semantic search returns all results on one page
      setTotalProperties(response.count || response.results?.length || 0);
    } catch (error) {
      console.error('Semantic search failed:', error);
      toast.error('Search failed, showing all properties');
      setIsSemanticSearch(false);
      loadProperties();
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterSearch = async (newFilters: SearchFilters) => {
    setIsLoading(true);
    setFilters(newFilters);
    setIsSemanticSearch(false);
    setCurrentPage(1);
    
    try {
      const params = new URLSearchParams();
      params.append('page', '1');
      params.append('limit', '9');
      
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
      
      const url = `/api/properties?${params.toString()}`;
      const response: any = await apiClient.get(url);
      setProperties(response.data || []);
      setTotalPages(response.totalPages || 1);
      setTotalProperties(response.total || 0);
      
      if (response.data?.length === 0) {
        toast.info('No properties found matching your criteria');
      }
    } catch (error) {
      console.error('Filter search failed:', error);
      toast.error('Failed to apply filters');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilters(defaultFilters);
    setIsSemanticSearch(false);
    setCurrentPage(1);
    loadProperties();
    toast.success('All filters cleared');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePropertyClick = (propertyId: string) => {
    window.location.href = `/properties/${propertyId}`;
  };

  const hasActiveFilters = searchQuery || filters.city || filters.bhk.length > 0 || filters.furnishing.length > 0 || 
    filters.hasWater247 || filters.hasPowerBackup || filters.hasIglPipeline || 
    filters.isDirectOwner || filters.nearbyMetro;

  return (
    <div className="min-h-screen">
      <AntigravityBackground/>
      
      {/* Hero Search Section */}
      <div className="py-12">
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
        {/* Toolbar */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div>
            <p className="text-purple-400">
              {totalProperties} properties found
              {searchQuery && ` for "${searchQuery}"`}
              {!isSemanticSearch && totalPages > 1 && ` - Page ${currentPage} of ${totalPages}`}
            </p>
          </div>
          <div className="flex gap-2">
            {/* Reset Filters Button */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="gap-2 text-red-600 border-red-200 hover:bg-red-50"
              >
                <RotateCcw className="h-4 w-4" />
                Reset Filters
              </Button>
            )}
            
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsMapOpen(true)}
              className="gap-1"
            >
              <Map className="h-4 w-4" />
              Map
            </Button>
            
            {/* Filter Button for Mobile */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[320px] p-0 overflow-y-auto">
                <SheetHeader className="px-4 py-3 border-b sticky top-0 bg-white z-10">
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>
                    Refine your property search by selecting filters below.
                  </SheetDescription>
                </SheetHeader>
                <PropertyFilters filters={filters} setFilters={handleFilterSearch} />
              </SheetContent>
            </Sheet>
            
            {/* Filter Toggle for Desktop */}
            <Button 
              variant="destructive"
              size="sm" 
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="hidden lg:flex gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {isFiltersOpen ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>
        </div>

        {/* Desktop Filters - Collapsible */}
        <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen} className="hidden lg:block mb-6">
          <CollapsibleContent>
            <PropertyFilters filters={filters} setFilters={handleFilterSearch} />
          </CollapsibleContent>
        </Collapsible>

        {/* Results Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No properties found matching your criteria</p>
            <Button variant="outline" onClick={handleResetFilters}>
              Clear all filters
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property: any) => (
                <PropertyCard key={property.id} property={property} showActions={true} />
              ))}
            </div>

            {/* Pagination */}
            {!isSemanticSearch && totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8 pt-6 border-t border-gray-700">
                <Button
                 
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className={currentPage === pageNum ? "bg-rose-500 font-bold":"bg-white"}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="gap-1"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            {/* Results count info */}
            {!isSemanticSearch && totalPages > 1 && (
              <p className="text-center text-sm text-gray-500 mt-4">
                Showing {(currentPage - 1) * 9 + 1} to {Math.min(currentPage * 9, totalProperties)} of {totalProperties} properties
              </p>
            )}
          </>
        )}
      </div>

      {/* Map Modal */}
      <PropertyMapCluster
        properties={properties.filter(p => p.latitude && p.longitude)}
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        onPropertyClick={handlePropertyClick}
      />
    </div>
  );
}