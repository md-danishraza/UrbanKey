'use client';

import { useState } from 'react';
import { Train, Loader2, MapPin, Navigation, AlertCircle, Pencil, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  const [isEditing, setIsEditing] = useState(false);
  const [manualStation, setManualStation] = useState(existingStation || '');
  const [manualDistance, setManualDistance] = useState(existingDistance?.toString() || '');

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
        setIsEditing(true);
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
        setManualStation(nearest.stationName);
        setManualDistance(nearest.distanceKm.toString());
        onDistanceCalculated(
          nearest.stationName,
          nearest.distanceKm,
          coordinates.lat,
          coordinates.lng
        );
      } else {
        setError('Could not find nearby metro station. Please enter manually.');
        setIsEditing(true);
      }
    } catch (err) {
      console.error('Error calculating metro distance:', err);
      setError('Failed to calculate distance. Please try again or enter manually.');
      setIsEditing(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSave = () => {
    if (!manualStation || !manualDistance) {
      setError('Please enter both station name and distance');
      return;
    }

    const distanceNum = parseFloat(manualDistance);
    if (isNaN(distanceNum)) {
      setError('Please enter a valid distance');
      return;
    }

    setStation(manualStation);
    setDistance(distanceNum);
    onDistanceCalculated(manualStation, distanceNum, 0, 0); // Pass 0,0 as coordinates (manual entry)
    setIsEditing(false);
    setError(null);
  };

  const handleManualCancel = () => {
    setManualStation(station || '');
    setManualDistance(distance?.toString() || '');
    setIsEditing(false);
    setError(null);
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
        <div className="flex gap-2">
          {!isEditing && station && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="gap-1 h-8 px-2"
            >
              <Pencil className="h-3 w-3" />
              Edit
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={isEditing ? handleManualSave : handleCalculate}
            disabled={isLoading}
            className="gap-1"
          >
            {isLoading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : isEditing ? (
              <Check className="h-3 w-3" />
            ) : (
              <Navigation className="h-3 w-3" />
            )}
            {isLoading ? 'Calculating...' : isEditing ? 'Save' : (station ? 'Recalculate' : 'Calculate')}
          </Button>
          {isEditing && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleManualCancel}
              className="gap-1 h-8 px-2"
            >
              <X className="h-3 w-3" />
              Cancel
            </Button>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Station Name</Label>
            <Input
              placeholder="e.g., Indiranagar"
              value={manualStation}
              onChange={(e) => setManualStation(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs">Distance (km)</Label>
            <Input
              type="number"
              step="0.1"
              placeholder="e.g., 1.2"
              value={manualDistance}
              onChange={(e) => setManualDistance(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      ) : station && distance !== null ? (
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
        {isEditing 
          ? "Enter metro station details manually" 
          : "Uses Mapbox to geocode your address and calculate distance to nearest metro station"}
      </p>
    </div>
  );
}