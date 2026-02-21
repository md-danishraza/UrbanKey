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

interface PropertyFiltersProps {
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
}

export function PropertyFilters({ filters, setFilters }: PropertyFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters);


  const [mounted, setMounted] = useState(false);

  // Handle hydration - only show formatted values after mount
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

  // Format number without using Intl.NumberFormat during SSR
  const formatPrice = (price: number) => {
    if (!mounted) return price.toString(); // Return plain number during SSR
    
    // Use a simple formatter that won't cause hydration mismatch
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Location */}
        <div>
          <Label htmlFor="city">City/Locality</Label>
          <Input
            id="city"
            placeholder="Enter city or locality"
            value={localFilters.city || ''}
            onChange={(e) => setLocalFilters({ ...localFilters, city: e.target.value })}
            className="mt-2"
          />
        </div>

        <Separator />

        {/* Price Range */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label>Monthly Rent (₹)</Label>
            <span className="text-sm text-gray-600">
              ₹{formatPrice(localFilters.minRent)} - ₹{formatPrice(localFilters.maxRent)}
            </span>
          </div>
          <Slider
            min={0}
            max={100000}
            step={1000}
            value={[localFilters.minRent, localFilters.maxRent]}
            onValueChange={([min, max]) => 
              setLocalFilters({ ...localFilters, minRent: min, maxRent: max })
            }
            className="mt-2"
          />
        </div>

        <Separator />

        {/* BHK Type */}
        <div>
          <Label className="text-base">BHK Type</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
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
        </div>

        <Separator />

        {/* Furnishing */}
        <div>
          <Label className="text-base">Furnishing</Label>
          <div className="space-y-2 mt-2">
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
        </div>

        <Separator />

        {/* Tenant Type */}
        <div>
          <Label className="text-base">Preferred Tenants</Label>
          <RadioGroup
            value={localFilters.tenantType}
            onValueChange={(value: any) => 
              setLocalFilters({ ...localFilters, tenantType: value })
            }
            className="mt-2"
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
        </div>

        <Separator />

        {/* Indian-specific Amenities */}
        <div>
          <Label className="text-base mb-2 block">Must-Have Amenities</Label>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="water247"
                checked={localFilters.hasWater247}
                onCheckedChange={(checked) => 
                  setLocalFilters({ ...localFilters, hasWater247: checked as boolean })
                }
              />
              <Label htmlFor="water247" className="text-sm cursor-pointer flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
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
              <Label htmlFor="power-backup" className="text-sm cursor-pointer flex items-center">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
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
              <Label htmlFor="igl" className="text-sm cursor-pointer flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
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
              <Label htmlFor="direct-owner" className="text-sm cursor-pointer flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
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
              <Label htmlFor="nearby-metro" className="text-sm cursor-pointer flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                Near Metro Station
              </Label>
            </div>
          </div>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={handleApplyFilters}
          >
            Apply Filters
          </Button>
          <Button 
            className="w-full" 
            variant="outline"
            onClick={handleReset}
          >
            Reset All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}