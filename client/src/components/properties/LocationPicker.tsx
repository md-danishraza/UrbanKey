'use client';

import { useState } from 'react';
import { MapPin, Loader2, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { mapboxService } from '@/lib/mapbox/mapbox.service';

interface LocationPickerProps {
  onLocationSelected: (lat: number, lng: number, address: string) => void;
  initialLat?: number;
  initialLng?: number;
  className?: string;
}

export function LocationPicker({ onLocationSelected, initialLat, initialLng, className }: LocationPickerProps) {
  const [lat, setLat] = useState(initialLat?.toString() || '');
  const [lng, setLng] = useState(initialLng?.toString() || '');
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReverseGeocode = async () => {
    if (!lat || !lng) return;
    
    setIsGeocoding(true);
    setError(null);
    
    try {
      const address = await mapboxService.reverseGeocode(parseFloat(lat), parseFloat(lng));
      if (address) {
        onLocationSelected(parseFloat(lat), parseFloat(lng), address);
      } else {
        setError('Could not find address for these coordinates');
      }
    } catch (err) {
      setError('Failed to geocode coordinates');
    } finally {
      setIsGeocoding(false);
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <Label className="flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        Manual Coordinates (Optional)
      </Label>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Input
            placeholder="Latitude"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            type="number"
            step="any"
          />
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Longitude"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            type="number"
            step="any"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleReverseGeocode}
            disabled={!lat || !lng || isGeocoding}
          >
            {isGeocoding ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Navigation className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      
      {error && <p className="text-xs text-red-500">{error}</p>}
      <p className="text-xs text-gray-500">
        Enter coordinates manually or use the calculate button above
      </p>
    </div>
  );
}