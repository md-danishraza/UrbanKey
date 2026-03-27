'use client';

import { useState } from 'react';
import { Train, Loader2, MapPin, Navigation, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { mapboxService } from '@/lib/mapbox/mapbox.service';
import { getMetroStationsByCity } from '@/lib/mapbox/metro-stations';

interface MetroDistanceCalculatorProps {
  address: string;
  city: string;
  onDistanceCalculated: (stationName: string, distanceKm: number, latitude: number, longitude: number) => void;
  existingStation?: string;
  existingDistance?: number;
  className?: string;
}

export function MetroDistanceCalculator({
  address,
  city,
  onDistanceCalculated,
  existingStation,
  existingDistance,
  className,
}: MetroDistanceCalculatorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [station, setStation] = useState<string | null>(existingStation || null);
  const [distance, setDistance] = useState<number | null>(existingDistance || null);

  const handleCalculate = async () => {
    if (!address || !city) {
      setError('Please enter address and city first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1. Geocode the address to get coordinates
      const fullAddress = `${address}, ${city}`;
      const coordinates = await mapboxService.geocodeAddress(fullAddress);

      if (!coordinates) {
        setError('Could not find location. Please check the address.');
        return;
      }

      // 2. Get metro stations for the city
      const metroStations = getMetroStationsByCity(city);
      
      if (metroStations.length === 0) {
        setError(`Metro data not available for ${city}. Please enter manually.`);
        return;
      }

      // 3. Find nearest metro station
      const nearest = await mapboxService.getDistanceToNearestMetro(
        coordinates.lat,
        coordinates.lng,
        metroStations
      );

      if (nearest) {
        setStation(nearest.stationName);
        setDistance(nearest.distanceKm);
        onDistanceCalculated(
          nearest.stationName,
          nearest.distanceKm,
          coordinates.lat,
          coordinates.lng
        );
      } else {
        setError('Could not find nearby metro station.');
      }
    } catch (err) {
      console.error('Error calculating metro distance:', err);
      setError('Failed to calculate distance. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getDistanceColor = (dist: number) => {
    if (dist <= 1) return 'text-green-600';
    if (dist <= 2) return 'text-yellow-600';
    return 'text-orange-600';
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2">
          <Train className="h-4 w-4" />
          Nearest Metro Station
        </Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCalculate}
          disabled={isLoading}
          className="gap-1"
        >
          {isLoading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Navigation className="h-3 w-3" />
          )}
          {isLoading ? 'Calculating...' : (station ? 'Recalculate' : 'Calculate')}
        </Button>
      </div>

      {station && distance !== null ? (
        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-medium text-green-800 flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {station}
              </p>
              <p className={cn("text-sm font-semibold mt-1", getDistanceColor(distance))}>
                {distance} km away
              </p>
            </div>
            <Train className="h-5 w-5 text-green-600" />
          </div>
        </div>
      ) : (
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500">
            Click calculate to find the nearest metro station
          </p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <p className="text-xs text-gray-500">
        Uses Mapbox to geocode your address and calculate distance to nearest metro station
      </p>
    </div>
  );
}