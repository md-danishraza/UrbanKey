'use client';

import { useState } from 'react';
import { Map, Loader2, SlidersHorizontal, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { PropertyFilters } from '@/components/properties/PropertyFilters';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { SemanticSearch } from '@/components/search/SemanticSearch';
import { PropertyMapCluster } from '@/components/map/PropertyMapCluster';
import { SearchFilters } from '@/types/property';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { toast } from 'sonner';
import { AntigravityBackground } from '@/components/common/AntigravityBackground';
import { cn } from '@/lib/utils';
import { 
  useGetAllPropertiesForMapQuery,
  useGetPropertiesQuery, 
  useLazyGetPropertiesQuery,
  useLazySemanticSearchQuery 
} from '@/state/apis/propertyApi';

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
  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSemanticSearch, setIsSemanticSearch] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);

  // RTK Query hooks
  const { 
    data: propertiesData, 
    isLoading: isLoadingProperties,
    refetch 
  } = useGetPropertiesQuery({
    page: currentPage,
    limit: 9,
    filters: isSemanticSearch ? undefined : filters,
  }, {
    skip: isSemanticSearch,
  });

  const [triggerSemanticSearch, { data: semanticData, isLoading: isSemanticLoading }] = useLazySemanticSearchQuery();
  const [triggerFilteredSearch] = useLazyGetPropertiesQuery();
  
  // entire data for map
  const { data: allProperties = [] } = useGetAllPropertiesForMapQuery();


  // Get data from either regular or semantic search
  const properties = isSemanticSearch ? (semanticData?.results || []) : (propertiesData?.data || []);
  const totalPages = isSemanticSearch ? 1 : (propertiesData?.totalPages || 1);
  const totalProperties = isSemanticSearch ? (semanticData?.count || 0) : (propertiesData?.total || 0);
  const isLoading = isSemanticSearch ? isSemanticLoading : isLoadingProperties;

  // Handle filter search
  const handleFilterSearch = async (newFilters: SearchFilters) => {
    setIsSemanticSearch(false);
    setFilters(newFilters);
    setCurrentPage(1);
    
    try {
      const result = await triggerFilteredSearch({
        page: 1,
        limit: 9,
        filters: newFilters,
      }).unwrap();
      
      if (result.total === 0) {
        toast.info('No properties found matching your criteria');
      }
    } catch (error) {
      console.error('Filter search failed:', error);
      toast.error('Failed to apply filters');
    }
  };

  // Handle semantic search
  const handleSemanticSearch = async (query: string) => {
    if (!query.trim()) {
      setIsSemanticSearch(false);
      setCurrentPage(1);
      setFilters(defaultFilters);
      setSearchQuery('');
      refetch();
      return;
    }
    
    setSearchQuery(query);
    setIsSemanticSearch(true);
    
    try {
      const result = await triggerSemanticSearch(query).unwrap();
      if (result.count === 0) {
        toast.info('No properties found matching your description');
      }
    } catch (error) {
      console.error('Semantic search failed:', error);
      toast.error('Search failed, showing all properties');
      setIsSemanticSearch(false);
      refetch();
    }
  };

  // Handle reset filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setFilters(defaultFilters);
    setIsSemanticSearch(false);
    setCurrentPage(1);
    refetch();
    toast.success('All filters cleared');
  };

  // Handle page change
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
              <div className="flex justify-center items-center gap-2 mt-8 pt-6 border-t border-white/10">
                
                {/* Previous Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="gap-1 bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-all disabled:opacity-40 disabled:hover:bg-white/5"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Previous</span>
                </Button>
                
                {/* Page Numbers */}
                <div className="flex gap-1.5">
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
                    
                    const isActive = currentPage === pageNum;
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={isActive ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className={cn(
                          "w-9 h-9 p-0 transition-all",
                          isActive 
                            ? "bg-rose-500 hover:bg-rose-600 text-white font-bold border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]" 
                            : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
                        )}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                
                {/* Next Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="gap-1 bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-all disabled:opacity-40 disabled:hover:bg-white/5"
                >
                  <span className="hidden sm:inline">Next</span>
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

      {/* Map Modal - Filter properties with valid coordinates */}
      <PropertyMapCluster
        properties={allProperties.filter(p => p.latitude && p.longitude)}
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        onPropertyClick={handlePropertyClick}
      />
    </div>
  );
}