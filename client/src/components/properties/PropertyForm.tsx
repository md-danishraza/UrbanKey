'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Upload, 
  X, 
  Image as ImageIcon,
  Loader2,
  Check,
  AlertCircle,
  Train,
  Droplet,
  Zap,
  Flame,
  Car,
  Users,
  Home,
  Briefcase
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Types
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
  parkingAvailable: boolean;
  petFriendly: boolean;
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
    parkingAvailable: initialData.parkingAvailable || false,
    petFriendly: initialData.petFriendly || false,
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Image upload handling
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setImages(prev => [...prev, ...acceptedFiles]);
    
    // Create preview URLs
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 10,
  });

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Calculate distance to nearest metro station
  const calculateMetroDistance = async () => {
    if (!formData.addressLine1 || !formData.city) {
      setLocationError('Please enter address and city first');
      return;
    }

    setIsCalculatingDistance(true);
    setLocationError(null);

    try {
      // Geocode address to coordinates
      const fullAddress = `${formData.addressLine1}, ${formData.addressLine2}, ${formData.city}, ${formData.state}`;
      
      // Using Mapbox Geocoding API (you'll need to implement this with your API key)
      // For now, we'll simulate metro distance
      // In production, call your backend endpoint
      
      // Simulate API call
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
    await onSubmit(formData, images);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Basic Information</h2>
          
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

            <div className="flex items-center space-x-2">
              <Checkbox
                id="parkingAvailable"
                checked={formData.parkingAvailable}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, parkingAvailable: checked as boolean }))}
              />
              <Label htmlFor="parkingAvailable" className="flex items-center gap-2 cursor-pointer">
                <Car className="h-4 w-4 text-gray-500" />
                Parking Available
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="petFriendly"
                checked={formData.petFriendly}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, petFriendly: checked as boolean }))}
              />
              <Label htmlFor="petFriendly" className="flex items-center gap-2 cursor-pointer">
                <Users className="h-4 w-4 text-purple-500" />
                Pet Friendly
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Broker Information */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Broker Information</h2>
          
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
              />
              <p className="text-xs text-gray-500">Typically 15 days or 1 month rent</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Image Upload */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Property Images</h2>
          
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
              isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
            )}
          >
            <input {...getInputProps()} />
            <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">
              {isDragActive ? "Drop images here" : "Drag & drop images here, or click to select"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Up to 10 images, max 5MB each (JPG, PNG, GIF, WebP)
            </p>
          </div>

          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
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