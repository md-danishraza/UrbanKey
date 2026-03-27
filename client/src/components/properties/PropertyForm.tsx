'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  MapPin, 
  
  Loader2,
  Train,
  Droplet,
  Zap,
  Flame,
  
  Home,
  Briefcase,
  CheckCircle
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

import { ImageUpload } from './ImageUpload';

// Property Form Data - Matches Prisma Schema
interface PropertyFormData {
  title: string;
  description: string;
  bhk: string;
  rent: number;
  furnishing: string;
  tenantType: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  hasWater247: boolean;
  hasPowerBackup: boolean;
  hasIglPipeline: boolean;
  nearestMetroStation?: string;
  distanceToMetroKm?: number;
  isBroker: boolean;
  brokerageFee?: number;
}

interface PropertyFormProps {
  initialData?: Partial<PropertyFormData>;
  onSubmit: (data: PropertyFormData, images: File[]) => Promise<void>;
  isLoading?: boolean;
}

const BHK_OPTIONS = [
  { value: 'ONE_BHK', label: '1 BHK' },
  { value: 'TWO_BHK', label: '2 BHK' },
  { value: 'THREE_BHK', label: '3 BHK' },
  { value: 'FOUR_BHK_PLUS', label: '4 BHK+' },
];

const FURNISHING_OPTIONS = [
  { value: 'UNFURNISHED', label: 'Unfurnished' },
  { value: 'SEMI_FURNISHED', label: 'Semi-Furnished' },
  { value: 'FULLY_FURNISHED', label: 'Fully Furnished' },
];

const TENANT_TYPE_OPTIONS = [
  { value: 'FAMILY', label: 'Family' },
  { value: 'BACHELORS', label: 'Bachelors' },
  { value: 'BOTH', label: 'Both' },
];

export function PropertyForm({ initialData = {}, onSubmit, isLoading = false }: PropertyFormProps) {
  const [formData, setFormData] = useState<PropertyFormData>({
    title: initialData.title || '',
    description: initialData.description || '',
    bhk: initialData.bhk || 'TWO_BHK',
    rent: initialData.rent || 0,
    furnishing: initialData.furnishing || 'SEMI_FURNISHED',
    tenantType: initialData.tenantType || 'BOTH',
    addressLine1: initialData.addressLine1 || '',
    addressLine2: initialData.addressLine2 || '',
    city: initialData.city || '',
    state: initialData.state || '',
    pincode: initialData.pincode || '',
    latitude: initialData.latitude,
    longitude: initialData.longitude,
    hasWater247: initialData.hasWater247 || false,
    hasPowerBackup: initialData.hasPowerBackup || false,
    hasIglPipeline: initialData.hasIglPipeline || false,
    nearestMetroStation: initialData.nearestMetroStation,
    distanceToMetroKm: initialData.distanceToMetroKm,
    isBroker: initialData.isBroker || false,
    brokerageFee: initialData.brokerageFee,
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  





  // Calculate distance to nearest metro station
  const calculateMetroDistance = async () => {
    if (!formData.addressLine1 || !formData.city) {
      setLocationError('Please enter address and city first');
      return;
    }

    setIsCalculatingDistance(true);
    setLocationError(null);

    try {
      // TODO: Replace with actual Mapbox API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock response
      const mockMetroStation = 'Indiranagar';
      const mockDistance = (Math.random() * 3).toFixed(1);
      
      setFormData(prev => ({
        ...prev,
        nearestMetroStation: mockMetroStation,
        distanceToMetroKm: parseFloat(mockDistance),
      }));
      
    } catch (error) {
      setLocationError('Failed to calculate metro distance');
    } finally {
      setIsCalculatingDistance(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData: PropertyFormData = {
      ...formData,
      rent: Number(formData.rent),
      brokerageFee: formData.brokerageFee ? Number(formData.brokerageFee) : undefined,
    };
    
    await onSubmit(submitData, images);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    
    if (id === 'rent' || id === 'brokerageFee') {
      setFormData(prev => ({
        ...prev,
        [id]: value === '' ? 0 : Number(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [id]: value
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
       {/* Add a loading overlay indicator at the top */}
       {isLoading && (
        <div className="sticky top-0 z-10 -mt-6 -mx-6 mb-6 px-6 py-3 bg-blue-50 border-b border-blue-200 flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
          <p className="text-sm text-blue-600">Saving your property...</p>
        </div>
      )}
      
      {/* Basic Information */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Home className="h-5 w-5" />
            Basic Information
          </h2>
          
          <div className="space-y-2">
            <Label htmlFor="title">Property Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Modern 2BHK in Whitefield"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your property..."
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>BHK Type *</Label>
              <Select value={formData.bhk} onValueChange={(value) => setFormData(prev => ({ ...prev, bhk: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select BHK" />
                </SelectTrigger>
                <SelectContent>
                  {BHK_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Furnishing *</Label>
              <Select value={formData.furnishing} onValueChange={(value) => setFormData(prev => ({ ...prev, furnishing: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select furnishing" />
                </SelectTrigger>
                <SelectContent>
                  {FURNISHING_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rent">Monthly Rent (₹) *</Label>
              <Input
                id="rent"
                type="number"
                value={formData.rent || ''}
                onChange={handleChange}
                placeholder="25000"
                required
                min="0"
                step="1000"
              />
            </div>

            <div className="space-y-2">
              <Label>Preferred Tenants *</Label>
              <Select value={formData.tenantType} onValueChange={(value) => setFormData(prev => ({ ...prev, tenantType: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tenant type" />
                </SelectTrigger>
                <SelectContent>
                  {TENANT_TYPE_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Location
          </h2>

          <div className="space-y-2">
            <Label htmlFor="addressLine1">Address Line 1 *</Label>
            <Input
              id="addressLine1"
              value={formData.addressLine1}
              onChange={handleChange}
              placeholder="House/Flat No., Building Name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
            <Input
              id="addressLine2"
              value={formData.addressLine2}
              onChange={handleChange}
              placeholder="Street, Area"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Bangalore"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Karnataka"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pincode">Pincode *</Label>
              <Input
                id="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="560001"
                required
              />
            </div>
          </div>

          {/* Metro Distance */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="flex items-center gap-2">
                  <Train className="h-4 w-4" />
                  Nearest Metro Station
                </Label>
                {formData.nearestMetroStation ? (
                  <div className="text-sm text-green-600">
                    {formData.nearestMetroStation} - {formData.distanceToMetroKm} km away
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Not calculated yet</p>
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={calculateMetroDistance}
                disabled={isCalculatingDistance}
              >
                {isCalculatingDistance ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Calculate Distance'
                )}
              </Button>
            </div>
            {locationError && (
              <p className="text-sm text-red-500 mt-2">{locationError}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Amenities */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Amenities</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasWater247"
                checked={formData.hasWater247}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasWater247: checked as boolean }))}
              />
              <Label htmlFor="hasWater247" className="flex items-center gap-2 cursor-pointer">
                <Droplet className="h-4 w-4 text-blue-500" />
                24/7 Water Supply
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasPowerBackup"
                checked={formData.hasPowerBackup}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasPowerBackup: checked as boolean }))}
              />
              <Label htmlFor="hasPowerBackup" className="flex items-center gap-2 cursor-pointer">
                <Zap className="h-4 w-4 text-yellow-500" />
                Power Backup
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasIglPipeline"
                checked={formData.hasIglPipeline}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasIglPipeline: checked as boolean }))}
              />
              <Label htmlFor="hasIglPipeline" className="flex items-center gap-2 cursor-pointer">
                <Flame className="h-4 w-4 text-orange-500" />
                IGL Gas Pipeline
              </Label>
            </div>
          </div>

          <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
            <p className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              These amenities help your property appear in relevant searches
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Broker Information */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Broker Information
          </h2>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isBroker"
              checked={formData.isBroker}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isBroker: checked as boolean }))}
            />
            <Label htmlFor="isBroker" className="cursor-pointer">
              This property is listed through a broker
            </Label>
          </div>

          {formData.isBroker && (
            <div className="space-y-2 pl-6">
              <Label htmlFor="brokerageFee">Brokerage Fee (₹)</Label>
              <Input
                id="brokerageFee"
                type="number"
                value={formData.brokerageFee || ''}
                onChange={handleChange}
                placeholder="e.g., 25000"
                min="0"
                step="1000"
              />
              <p className="text-xs text-gray-500">
                Typically 15 days or 1 month rent. This will be shown to tenants.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Image Upload */}
      <Card>
        <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Property Images</h2>
            
            <ImageUpload
            images={images.map((file, index) => ({
                id: `temp-${Date.now()}-${index}`,
                file,
                url: imagePreviews[index],
                isPrimary: index === 0 && images.length === 1,
                sortOrder: index,
            }))}
            onImagesChange={(newImages) => {
                // Extract files and previews from newImages
                const newFiles = newImages.filter(img => img.file).map(img => img.file!);
                const newPreviews = newImages.filter(img => img.url).map(img => img.url);
                setImages(newFiles);
                setImagePreviews(newPreviews);
            }}
            maxImages={10}
            isLoading={isLoading}
            isEditMode={false}
            />
        </CardContent>
      </Card>

      {/* Submit Button */}
      
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => window.history.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="min-w-[120px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Property'
            )}
          </Button>
        </div>
    </form>
  );
}