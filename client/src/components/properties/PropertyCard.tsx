'use client';

import Link from 'next/link';
import { MapPin, Train, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { WishlistButton } from '@/components/tenant/WishlistButton';
import { formatCurrency } from '@/lib/utils';
// Adjust this import based on where shadcn installed it
import TiltedCard from '@/components/TiltedCard';

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    rent: number;
    bhk: string;
    city: string;
    images: { imageUrl: string; isPrimary: boolean }[];
    nearestMetroStation?: string;
    distanceToMetroKm?: number;
    isBroker?: boolean;
    brokerageFee?: number;
  };
  showActions?: boolean;
  className?: string;
}

export function PropertyCard({ property, showActions = true, className }: PropertyCardProps) {
  const getPrimaryImage = () => {
    const primary = property.images?.find(img => img.isPrimary);
    return primary?.imageUrl || property.images?.[0]?.imageUrl;
  };

  const primaryImage = getPrimaryImage() || '/images/property-placeholder.jpg';

  // This is the UI that will float ON TOP of the tilted image
  const CardOverlay: any = (
    <div 
      className="flex flex-col justify-between w-full h-full p-4 pointer-events-none antialiased" 
      style={{ 
        transform: "translateZ(30px)", 
        transformStyle: "preserve-3d", // Forces 3D space to prevent flattening
        backfaceVisibility: "hidden", // Prevents jagged edges on rotation
        WebkitFontSmoothing: "antialiased" 
      }}
    >
      
      {/* Top Section: Badges & Wishlist */}
      <div className="flex justify-between items-start w-full transform-gpu">
        <Badge className="bg-rose-500 hover:bg-rose-600 text-white shadow-lg pointer-events-auto border-none">
          {property.bhk}
        </Badge>
        {showActions && (
          <div className="pointer-events-auto">
            <WishlistButton propertyId={property.id} variant="ghost" size="icon" className="rounded-full shadow-lg bg-black/50 cursor-pointer text-white border-none backdrop-blur-sm" />
          </div>
        )}
      </div>

      {/* Bottom Section: Glassmorphism Info Box */}
      <div className="relative w-full rounded-xl p-4 text-white shadow-2xl pointer-events-auto transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">

         {/* Separated the blur into an absolute background layer to prevent text rasterization blur */}
         <div className="absolute inset-0 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl -z-10"></div>

          {/* Text Content - Added hardware acceleration classes to force crisp rendering */}
        <div className="relative z-10 transform-gpu will-change-transform backface-hidden">
        <Link href={`/properties/${property.id}`}>
          <h3 className="font-semibold text-lg mb-1 hover:text-rose-400 line-clamp-1 transition-colors drop-shadow-md">
            {property.title}
          </h3>
        </Link>
        
        <div className="flex items-center gap-1 text-gray-200 text-sm mb-2 drop-shadow-sm">
          <MapPin className="h-4 w-4 text-rose-500" />
          <span className="truncate">{property.city}</span>
        </div>
        
        {property.nearestMetroStation && (
          <div className="flex items-center gap-1 text-emerald-500 text-xs mb-3 font-medium drop-shadow-sm">
            <Train className="h-3 w-3" />
            <span>{property.distanceToMetroKm} km from {property.nearestMetroStation}</span>
          </div>
        )}
        
        <div className="flex items-center justify-between mt-2 pt-3 border-t border-white/20">
          <div>
            <p className="text-xl font-bold text-white drop-shadow-md">
              ₹{formatCurrency(property.rent)}<span className="text-sm text-gray-300 font-normal">/mo</span>
            </p>
            {property.isBroker && property.brokerageFee && (
              <p className="text-xs text-orange-400 mt-0.5 font-medium drop-shadow-sm">
                Broker: ₹{formatCurrency(property.brokerageFee)}
              </p>
            )}
          </div>
          
          {showActions && (
            <Link href={`/properties/${property.id}`}>
              <Button size="sm" className="bg-purple-300 cursor-pointer text-black hover:bg-gray-200 gap-1 rounded-full px-4 font-semibold shadow-md">
                <Eye className="h-4 w-4" />
                View
              </Button>
            </Link>
          )}
        </div>
        </div>
        
      </div>
    </div>
  );

  return (
    // The wrapper defines the overall size for the grid
    <div className={cn("relative w-full h-[500px] group", className)}>
      <TiltedCard
        imageSrc={primaryImage}
        altText={property.title}
        captionText=""
        containerHeight="100%"
        containerWidth="100%"
        imageHeight="100%"
        imageWidth="100%"
        rotateAmplitude={12}
        scaleOnHover={1.03}
        showMobileWarning={false}
        showTooltip={false}
        displayOverlayContent={true}
        overlayContent={CardOverlay}
      />
    </div>
  );
}