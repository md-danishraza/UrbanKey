'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SearchFilters } from '@/types/property';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface PropertyFiltersProps {
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
}

export function PropertyFilters({ filters, setFilters }: PropertyFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters);
  const [mounted, setMounted] = useState(false);
  
  // Collapsible sections state
  const [sections, setSections] = useState({
    location: true,
    price: true,
    bhk: true,
    furnishing: true,
    tenantType: true,
    amenities: true,
  });

  const toggleSection = (section: keyof typeof sections) => {
    setSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const bhkOptions = ['1BHK', '2BHK', '3BHK', '4BHK+'];
  const furnishingOptions = [
    { value: 'unfurnished', label: 'Unfurnished' },
    { value: 'semi-furnished', label: 'Semi-Furnished' },
    { value: 'fully-furnished', label: 'Fully Furnished' }
  ];
  const tenantOptions = [
    { value: 'family', label: 'Family' },
    { value: 'bachelors', label: 'Bachelors' },
    { value: 'both', label: 'Both' }
  ];

  const handleApplyFilters = () => {
    setFilters(localFilters);
  };

  const handleReset = () => {
    const resetFilters: SearchFilters = {
      city: '',
      minRent: 0,
      maxRent: 100000,
      bhk: [],
      furnishing: [],
      tenantType: 'both',
      hasWater247: false,
      hasPowerBackup: false,
      hasIglPipeline: false,
      isDirectOwner: false,
      nearbyMetro: false
    };
    setLocalFilters(resetFilters);
    setFilters(resetFilters);
  };

  const formatPrice = (price: number) => {
    if (!mounted) return price.toString();
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-sm backdrop-blur-xs bg-white/50 text-black lg:text-white">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          Filters
          <Button variant="ghost" size="sm" onClick={handleReset} className="text-rose-600 cursor-pointer">
            Reset All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 transition-all ">
        {/* Location Section */}
        <Collapsible open={sections.location} onOpenChange={() => toggleSection('location')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
            <Label className="text-base font-semibold cursor-pointer">Location</Label>
            {sections.location ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 pb-3">
            <Input
              placeholder="Enter city or locality"
              value={localFilters.city || ''}
              onChange={(e) => setLocalFilters({ ...localFilters, city: e.target.value })}
            />
          </CollapsibleContent>
        </Collapsible>
        <Separator />

        {/* Price Range Section */}
        <Collapsible open={sections.price} onOpenChange={() => toggleSection('price')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
            <Label className="text-base font-semibold cursor-pointer">Monthly Rent</Label>
            {sections.price ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 pb-3">
            <div className="flex justify-between items-center mb-2 text-sm">
              <span>₹{formatPrice(localFilters.minRent)}</span>
              <span>₹{formatPrice(localFilters.maxRent)}</span>
            </div>
            <Slider
              min={0}
              max={100000}
              step={1000}
              value={[localFilters.minRent, localFilters.maxRent]}
              onValueChange={([min, max]) => 
                setLocalFilters({ ...localFilters, minRent: min, maxRent: max })
              }
            />
          </CollapsibleContent>
        </Collapsible>
        <Separator />

        {/* BHK Type Section */}
        <Collapsible open={sections.bhk} onOpenChange={() => toggleSection('bhk')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
            <Label className="text-base font-semibold cursor-pointer">BHK Type</Label>
            {sections.bhk ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 pb-3">
            <div className="grid grid-cols-2 gap-2">
              {bhkOptions.map((bhk) => (
                <div key={bhk} className="flex items-center space-x-2">
                  <Checkbox
                    id={`bhk-${bhk}`}
                    checked={localFilters.bhk.includes(bhk)}
                    onCheckedChange={(checked) => {
                      const newBhk = checked
                        ? [...localFilters.bhk, bhk]
                        : localFilters.bhk.filter((b) => b !== bhk);
                      setLocalFilters({ ...localFilters, bhk: newBhk });
                    }}
                  />
                  <Label htmlFor={`bhk-${bhk}`} className="text-sm cursor-pointer">
                    {bhk}
                  </Label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
        <Separator />

        {/* Furnishing Section */}
        <Collapsible open={sections.furnishing} onOpenChange={() => toggleSection('furnishing')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
            <Label className="text-base font-semibold cursor-pointer">Furnishing</Label>
            {sections.furnishing ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 pb-3">
            <div className="space-y-2">
              {furnishingOptions.map((furnishing) => (
                <div key={furnishing.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`furnishing-${furnishing.value}`}
                    checked={localFilters.furnishing.includes(furnishing.value)}
                    onCheckedChange={(checked) => {
                      const newFurnishing = checked
                        ? [...localFilters.furnishing, furnishing.value]
                        : localFilters.furnishing.filter((f) => f !== furnishing.value);
                      setLocalFilters({ ...localFilters, furnishing: newFurnishing });
                    }}
                  />
                  <Label htmlFor={`furnishing-${furnishing.value}`} className="text-sm cursor-pointer">
                    {furnishing.label}
                  </Label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
        <Separator />

        {/* Tenant Type Section */}
        <Collapsible open={sections.tenantType} onOpenChange={() => toggleSection('tenantType')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
            <Label className="text-base font-semibold cursor-pointer">Preferred Tenants</Label>
            {sections.tenantType ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 pb-3">
            <RadioGroup
              value={localFilters.tenantType}
              onValueChange={(value: any) => 
                setLocalFilters({ ...localFilters, tenantType: value })
              }
            >
              {tenantOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`tenant-${option.value}`} />
                  <Label htmlFor={`tenant-${option.value}`} className="text-sm cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CollapsibleContent>
        </Collapsible>
        <Separator />

        {/* Amenities Section */}
        <Collapsible open={sections.amenities} onOpenChange={() => toggleSection('amenities')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
            <Label className="text-base font-semibold cursor-pointer">Must-Have Amenities</Label>
            {sections.amenities ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 pb-3">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="water247"
                  checked={localFilters.hasWater247}
                  onCheckedChange={(checked) => 
                    setLocalFilters({ ...localFilters, hasWater247: checked as boolean })
                  }
                />
                <Label htmlFor="water247" className="text-sm cursor-pointer">
                  24/7 Water Supply
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="power-backup"
                  checked={localFilters.hasPowerBackup}
                  onCheckedChange={(checked) => 
                    setLocalFilters({ ...localFilters, hasPowerBackup: checked as boolean })
                  }
                />
                <Label htmlFor="power-backup" className="text-sm cursor-pointer">
                  Power Backup
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="igl"
                  checked={localFilters.hasIglPipeline}
                  onCheckedChange={(checked) => 
                    setLocalFilters({ ...localFilters, hasIglPipeline: checked as boolean })
                  }
                />
                <Label htmlFor="igl" className="text-sm cursor-pointer">
                  IGL Gas Pipeline
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="direct-owner"
                  checked={localFilters.isDirectOwner}
                  onCheckedChange={(checked) => 
                    setLocalFilters({ ...localFilters, isDirectOwner: checked as boolean })
                  }
                />
                <Label htmlFor="direct-owner" className="text-sm cursor-pointer">
                  Direct Owner (No Broker)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="nearby-metro"
                  checked={localFilters.nearbyMetro}
                  onCheckedChange={(checked) => 
                    setLocalFilters({ ...localFilters, nearbyMetro: checked as boolean })
                  }
                />
                <Label htmlFor="nearby-metro" className="text-sm cursor-pointer">
                  Near Metro Station
                </Label>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
        <Separator />

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <Button 
            className="w-full cursor-pointer bg-rose-600 hover:bg-rose-700"
            onClick={handleApplyFilters}
          >
            Apply Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}