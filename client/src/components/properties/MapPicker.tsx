'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Train,  Loader2, X, Maximize2, LocateFixed, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { mapboxService } from '@/lib/mapbox/mapbox.service';
import { getMetroStationsByCity } from '@/lib/mapbox/metro-stations';

interface MapPickerProps {
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
    showMetroInfo?: boolean;
  }

export function MapPicker({ 
  onLocationSelected, 
  initialLat, 
  initialLng, 
  initialAddress,
  initialCity,
  initialState,
  initialPincode,
  className,
  showMetroInfo = true 
}: MapPickerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(
    initialLat && initialLng ? { lat: initialLat, lng: initialLng } : null
  );
  const [address, setAddress] = useState(initialAddress || '');
  const [city, setCity] = useState(initialCity || '');
  const [state, setState] = useState(initialState || '');
  const [pincode, setPincode] = useState(initialPincode || '');
  const [metroInfo, setMetroInfo] = useState<{ station: string; distance: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCalculatingMetro, setIsCalculatingMetro] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !process.env.NEXT_PUBLIC_MAPBOX_TOKEN) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    const defaultCenter = coordinates 
      ? [coordinates.lng, coordinates.lat] 
      : [77.5946, 12.9716]; // Bangalore center

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: defaultCenter as [number, number],
      zoom: coordinates ? 14 : 12,
    });

    map.current.on('load', () => {
      setIsLoading(false);
    });

    // Add click handler
    map.current.on('click', handleMapClick);

    return () => {
      map.current?.remove();
    };
  }, []);

  // Replace the parseAddress function with this improved version
// Update the parseAddress function to only return addressLine1 as the first part
const parseAddress = (feature: any) => {
    const fullAddress:string = feature.place_name || '';
    const parts = fullAddress.split('،').map(p => p.trim());
    
    // Address line 1 is the first part only
    const addressLine1 = parts[0] || '';
    
    let city = '';
    let state = '';
    let pincode = '';
    
    // Use Mapbox context data for accurate city, state, pincode
    if (feature.context) {
      for (const item of feature.context) {
        if (item.id.includes('place')) {
          city = item.text;
        }
        if (item.id.includes('region')) {
          state = item.text;
        }
        if (item.id.includes('postcode')) {
          pincode = item.text;
        }
      }
    }
    
    // Fallback to parsing from parts if context not available
    if (!city && parts.length >= 2) {
      city = parts[parts.length - 2];
    }
    
    return {
      fullAddress,
      addressLine1,
      city,
      state,
      pincode,
    };
  };
  
  // Update the handleMapClick function to use the parsed address
  const handleMapClick = useCallback(async (e: mapboxgl.MapMouseEvent) => {
    const { lng, lat } = e.lngLat;
    setCoordinates({ lat, lng });
    setIsCalculatingMetro(true);
  
    // Update marker
    if (marker.current) {
      marker.current.setLngLat([lng, lat]);
    } else if (map.current) {
      marker.current = new mapboxgl.Marker({ draggable: true })
        .setLngLat([lng, lat])
        .addTo(map.current);
      
      // Add drag end handler
      marker.current.on('dragend', () => {
        const markerLngLat = marker.current?.getLngLat();
        if (markerLngLat) {
          handleMapClick({ lngLat: markerLngLat } as mapboxgl.MapMouseEvent);
        }
      });
    }
  
    // Reverse geocode to get address details
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}&country=in`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        const parsed = parseAddress(feature);
        
        setAddress(parsed.fullAddress);
        setAddressLine1(parsed.addressLine1);
        setCity(parsed.city);
        setState(parsed.state);
        setPincode(parsed.pincode);
  
        // Calculate nearest metro station
        const metroStations = getMetroStationsByCity(parsed.city);
        if (metroStations.length > 0) {
          const nearest = await mapboxService.getDistanceToNearestMetro(lat, lng, metroStations);
          if (nearest) {
            setMetroInfo({ station: nearest.stationName, distance: nearest.distanceKm });
          }
        }

        // console.log(parsed.addressLine1)
  
        // Call callback with all data
        onLocationSelected({
          lat,
          lng,
          address: parsed.fullAddress,
          addressLine1: parsed.addressLine1,
          city: parsed.city,
          state: parsed.state,
          pincode: parsed.pincode,
          nearestMetroStation: metroInfo?.station,
          distanceToMetroKm: metroInfo?.distance,
        });
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      onLocationSelected({ lat, lng, address: '' });
    } finally {
      setIsCalculatingMetro(false);
    }
  }, [onLocationSelected, metroInfo]);
  
  // Add these state variables
  const [addressLine1, setAddressLine1] = useState(initialAddress || '');

  // Search for location
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const result = await mapboxService.geocodeAddress(searchQuery);
      if (result && map.current) {
        const { lat, lng } = result;
        setCoordinates({ lat, lng });
        
        // Fly to location
        map.current.flyTo({
          center: [lng, lat],
          zoom: 14,
          duration: 1000,
        });
        
        // Simulate click to get full details
        handleMapClick({ lngLat: { lng, lat } } as mapboxgl.MapMouseEvent);
      } else {
        alert('Location not found. Please try a different search term.');
      }
    } catch (error) {
      console.error('Search error:', error);
      alert('Failed to search location. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        if (map.current) {
          map.current.flyTo({
            center: [lng, lat],
            zoom: 14,
            duration: 1000,
          });
          handleMapClick({ lngLat: { lng, lat } } as mapboxgl.MapMouseEvent);
        }
        setIsLocating(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert('Unable to get your location. Please check your browser permissions.');
        setIsLocating(false);
      }
    );
  };

  const getDistanceColor = (dist: number) => {
    if (dist <= 1) return 'text-green-600';
    if (dist <= 2) return 'text-yellow-600';
    return 'text-orange-600';
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search for a location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-9"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleSearch}
          disabled={isSearching}
          title="Search"
        >
          {isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={getCurrentLocation}
          disabled={isLocating}
          title="Use my current location"
        >
          {isLocating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LocateFixed className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Map Container */}
      <div className="relative">
        <div 
          ref={mapContainer} 
          className={cn(
            "w-full rounded-lg overflow-hidden border transition-all",
            isExpanded ? "h-[500px]" : "h-[300px]"
          )}
        />
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        )}
        
        {/* Expand/Collapse Button */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-50 z-10"
        >
          {isExpanded ? (
            <X className="h-4 w-4 text-gray-600" />
          ) : (
            <Maximize2 className="h-4 w-4 text-gray-600" />
          )}
        </button>
      </div>

      {/* Selected Location Info */}
      {coordinates && (
        <div className="space-y-3">
          {/* Address */}
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <Label className="text-xs text-gray-500 uppercase tracking-wide">Selected Location</Label>
            <p className="text-sm mt-1 font-medium">{address || 'Address not found'}</p>
            {city && (
              <div className="flex gap-3 mt-2 text-xs text-gray-500">
                {city && <span>📍 {city}</span>}
                {state && <span>📌 {state}</span>}
                {pincode && <span>✉️ {pincode}</span>}
              </div>
            )}
            <p className="text-xs text-gray-400 mt-1">
              {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
            </p>
          </div>

          {/* Metro Info */}
          {showMetroInfo && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="text-xs text-blue-600 uppercase tracking-wide flex items-center gap-1">
                    <Train className="h-3 w-3" />
                    Nearest Metro Station
                  </Label>
                  {isCalculatingMetro ? (
                    <div className="flex items-center gap-2 mt-1">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span className="text-sm text-gray-500">Finding nearest metro...</span>
                    </div>
                  ) : metroInfo ? (
                    <>
                      <p className="font-medium text-blue-800 mt-1">{metroInfo.station}</p>
                      <p className={cn("text-sm font-semibold", getDistanceColor(metroInfo.distance))}>
                        {metroInfo.distance} km away
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-gray-500 mt-1">No metro station found nearby</p>
                  )}
                </div>
                <Train className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-gray-400">
        Click anywhere on the map to select a location. Drag the marker to adjust.
      </p>
    </div>
  );
}