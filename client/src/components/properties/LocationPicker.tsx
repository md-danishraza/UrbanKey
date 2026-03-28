'use client';

import { useState } from 'react';
import { MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { MapPicker } from './MapPicker';

interface LocationPickerProps {
  onLocationSelected: (data: {
    lat: number;
    lng: number;
    address: string;
    addressLine1?: string;
    city?: string;
    state?: string;
    pincode?: string;
    nearestMetroStation?: string;
    distanceToMetroKm?: number;
  }) => void;
  initialLat?: number;
  initialLng?: number;
  initialAddress?: string;
  initialCity?: string;
  initialState?: string;
  initialPincode?: string;
  className?: string;
}

export function LocationPicker({ 
  onLocationSelected, 
  initialLat, 
  initialLng, 
  initialAddress,
  initialCity,
  initialState,
  initialPincode,
  className 
}: LocationPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [manualLat, setManualLat] = useState(initialLat?.toString() || '');
  const [manualLng, setManualLng] = useState(initialLng?.toString() || '');

  const handleManualSubmit = () => {
    if (manualLat && manualLng) {
      onLocationSelected({
        lat: parseFloat(manualLat),
        lng: parseFloat(manualLng),
        address: '',
      });
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between"
      >
        <span className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Pick location on map
        </span>
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>

      {isOpen && (
        <div className="space-y-4">
          <MapPicker
            onLocationSelected={onLocationSelected}
            initialLat={initialLat}
            initialLng={initialLng}
            initialAddress={initialAddress}
            initialCity={initialCity}
            initialState={initialState}
            initialPincode={initialPincode}
            showMetroInfo={true}
          />
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or enter manually</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Latitude</Label>
              <Input
                placeholder="Latitude"
                value={manualLat}
                onChange={(e) => setManualLat(e.target.value)}
                type="number"
                step="any"
              />
            </div>
            <div>
              <Label className="text-xs">Longitude</Label>
              <Input
                placeholder="Longitude"
                value={manualLng}
                onChange={(e) => setManualLng(e.target.value)}
                type="number"
                step="any"
              />
            </div>
          </div>
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleManualSubmit}
            disabled={!manualLat || !manualLng}
            className="w-full"
          >
            Apply Coordinates
          </Button>
        </div>
      )}
    </div>
  );
}