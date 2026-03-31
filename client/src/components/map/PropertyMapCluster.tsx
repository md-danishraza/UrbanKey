'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { X, Loader2, Navigation, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';

interface Property {
  id: string;
  title: string;
  rent: number;
  bhk: string;
  city: string;
  latitude: number;
  longitude: number;
  images?: { imageUrl: string; isPrimary: boolean }[];
}

interface PropertyMapProps {
  properties: Property[];
  isOpen: boolean;
  onClose: () => void;
  onPropertyClick?: (propertyId: string) => void;
}

// Custom marker popup HTML
const createPopupHTML = (property: Property) => {
  const primaryImage = property.images?.find(img => img.isPrimary)?.imageUrl || property.images?.[0]?.imageUrl;
  return `
    <div class="property-popup">
      <div class="flex gap-3 max-w-[250px]">
        ${primaryImage ? `<img src="${primaryImage}" alt="${property.title}" class="w-16 h-16 rounded-lg object-cover" />` : ''}
        <div>
          <h4 class="font-semibold text-sm">${property.title}</h4>
          <p class="text-blue-600 font-bold text-sm">₹${formatCurrency(property.rent)}/mo</p>
          <p class="text-xs text-gray-500">${property.bhk} • ${property.city}</p>
          <button 
            onclick="window.dispatchEvent(new CustomEvent('propertyClick', { detail: { propertyId: '${property.id}' } }))"
            class="mt-1 text-xs text-blue-600 hover:underline"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  `;
};

export function PropertyMapCluster({ properties, isOpen, onClose, onPropertyClick }: PropertyMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const popups = useRef<{ [key: string]: mapboxgl.Popup }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // Initialize map when modal opens
  useEffect(() => {
    if (!isOpen || !mapContainer.current) return;

    const initMap = () => {
      try {
        mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;
        
        // Calculate center from properties or default to Bangalore
        const validProperties = properties.filter(p => p.latitude && p.longitude);
        let center: [number, number] = [77.5946, 12.9716]; // Bangalore center
        let zoom = 10;
        
        if (validProperties.length > 0) {
          const avgLat = validProperties.reduce((sum, p) => sum + p.latitude, 0) / validProperties.length;
          const avgLng = validProperties.reduce((sum, p) => sum + p.longitude, 0) / validProperties.length;
          center = [avgLng, avgLat];
          zoom = validProperties.length === 1 ? 14 : 11;
        }

        map.current = new mapboxgl.Map({
          container: mapContainer.current!,
          style: 'mapbox://styles/mapbox/streets-v12',
          center,
          zoom,
        });

        map.current.on('load', () => {
          setIsLoading(false);
          addMarkers();
        });

        map.current.on('error', (e) => {
          console.error('Map error:', e);
          setMapError('Failed to load map');
          setIsLoading(false);
        });
      } catch (error) {
        console.error('Map initialization error:', error);
        setMapError('Failed to initialize map');
        setIsLoading(false);
      }
    };

    // Small delay to ensure modal is fully rendered
    setTimeout(initMap, 100);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      markers.current = {};
      popups.current = {};
    };
  }, [isOpen, properties]);

  // Update markers when properties change
  useEffect(() => {
    if (!map.current || !isOpen || isLoading) return;
    addMarkers();
  }, [properties, isOpen, isLoading]);

  // Add markers to map
  const addMarkers = () => {
    if (!map.current) return;

    // Clear existing markers
    Object.values(markers.current).forEach(marker => marker.remove());
    Object.values(popups.current).forEach(popup => popup.remove());
    markers.current = {};
    popups.current = {};

    // Add new markers
    properties.forEach((property) => {
      if (!property.latitude || !property.longitude) return;

      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25, closeButton: false })
        .setHTML(createPopupHTML(property));
      
      popups.current[property.id] = popup;

      // Create marker
      const marker = new mapboxgl.Marker({ color: '#3b82f6' })
        .setLngLat([property.longitude, property.latitude])
        .setPopup(popup)
        .addTo(map.current!);

      // Add click handler
      marker.getElement().addEventListener('click', () => {
        if (onPropertyClick) {
          onPropertyClick(property.id);
        }
      });

      markers.current[property.id] = marker;
    });

    // Adjust bounds to fit all markers
    const validProperties = properties.filter(p => p.latitude && p.longitude);
    if (validProperties.length > 1 && map.current) {
      const bounds = new mapboxgl.LngLatBounds();
      validProperties.forEach(p => bounds.extend([p.longitude, p.latitude]));
      map.current.fitBounds(bounds, { padding: 50, duration: 500 });
    }
  };

  // Handle property click from popup
  useEffect(() => {
    const handlePropertyClick = (e: CustomEvent) => {
      if (onPropertyClick) {
        onPropertyClick(e.detail.propertyId);
        onClose(); // Close map modal when property is clicked
      }
    };

    window.addEventListener('propertyClick' as any, handlePropertyClick);
    return () => window.removeEventListener('propertyClick' as any, handlePropertyClick);
  }, [onPropertyClick, onClose]);

  const toggleFullscreen = () => {
    const modalElement = document.querySelector('.map-modal-content');
    if (!modalElement) return;

    if (!document.fullscreenElement) {
      modalElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleLocateMe = () => {
    if (!map.current) return;
    
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        map.current?.flyTo({
          center: [longitude, latitude],
          zoom: 14,
          duration: 1000,
        });
        
        // Add a temporary marker for user location
        new mapboxgl.Marker({ color: '#10b981' })
          .setLngLat([longitude, latitude])
          .addTo(map.current!);
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert('Unable to get your location');
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="map-modal-content relative w-full max-w-6xl h-[85vh] bg-white rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-3 bg-white/90 backdrop-blur-sm border-b">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium">{properties.length} properties on map</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleLocateMe}
              title="My Location"
            >
              <Navigation className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={toggleFullscreen}
              title="Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onClose}
              title="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Map Container */}
        <div className="w-full h-full pt-12">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-20">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Loading map...</p>
              </div>
            </div>
          )}
          {mapError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-20">
              <div className="text-center">
                <p className="text-red-500 mb-2">{mapError}</p>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Retry
                </Button>
              </div>
            </div>
          )}
          <div ref={mapContainer} className="w-full h-full" />
        </div>

        {/* Legend */}
        <div className="absolute bottom-3 right-3 z-10 bg-white/90 backdrop-blur-sm rounded-lg p-2 text-xs shadow-md">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <span>Property</span>
          </div>
        </div>
      </div>
    </div>
  );
}