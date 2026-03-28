'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';


interface PropertyMapProps {
  latitude?: number;
  longitude?: number;
  address?: string;
  title?: string;
  className?: string;
}

export function PropertyMap({ latitude, longitude, address, title, className }: PropertyMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!latitude || !longitude) {
      setIsLoading(false);
      setError('No location coordinates available');
      return;
    }

    if (!mapContainer.current || !process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
      setError('Mapbox token not configured');
      return;
    }

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [longitude, latitude],
      zoom: 15,
    });

    map.current.on('load', () => {
      setIsLoading(false);
      
      // Add marker
      marker.current = new mapboxgl.Marker({ color: '#3b82f6' })
        .setLngLat([longitude, latitude])
        .addTo(map.current!);
      
      // Add popup with address
      if (address) {
        new mapboxgl.Popup({ offset: 25 })
          .setLngLat([longitude, latitude])
          .setHTML(`<strong>${title || 'Property'}</strong><br/>${address}`)
          .addTo(map.current!);
      }
    });

    map.current.on('error', () => {
      setError('Failed to load map');
      setIsLoading(false);
    });

    return () => {
      map.current?.remove();
    };
  }, [latitude, longitude, address, title]);

  if (!latitude || !longitude) {
    return (
      <Card className={className}>
        <CardContent className="py-8 text-center text-gray-500">
          <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p>Location coordinates not available</p>
          <p className="text-sm">Update the property location to see map</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Location Map
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div 
            ref={mapContainer} 
            className="w-full h-[300px] rounded-lg overflow-hidden bg-gray-100"
          />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}
        </div>
        {address && (
          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {address}
          </p>
        )}
        {latitude && longitude && (
          <p className="text-xs text-gray-400 mt-1">
            {latitude.toFixed(6)}, {longitude.toFixed(6)}
          </p>
        )}
      </CardContent>
    </Card>
  );
}