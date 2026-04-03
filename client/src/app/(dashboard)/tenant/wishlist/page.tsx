'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { Heart, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getWishlist, WishlistItem } from '@/lib/api/wishlist';
import { PropertyCard } from '@/components/properties/PropertyCard';

export default function WishlistPage() {
  const { getToken } = useAuth();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      if (!token) throw new Error("not authorized");
      const response: any = await getWishlist(token);
      setWishlist(response.wishlist);
    } catch (error) {
      console.error('Failed to load wishlist:', error);
      toast.error('Failed to load wishlist');
    } finally {
      setIsLoading(false);
    }
  };

  // Transform wishlist item to property format expected by PropertyCard
  const transformToProperty = (item: WishlistItem) => {
    return {
      id: item.propertyId,
      title: item.property.title,
      rent: item.property.rent,
      bhk: item.property.bhk,
      city: item.property.city,
      images: item.property.images || [],
      nearestMetroStation: item.property.nearestMetroStation,
      distanceToMetroKm: item.property.distanceToMetroKm,
      isBroker: item.property.isBroker,
      brokerageFee: item.property.brokerageFee,
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen  bg-gradient-to-b from-rose-50 to-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
        
        {wishlist.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Heart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-2">Your wishlist is empty</p>
              <Link href="/properties/search">
                <Button>Browse Properties</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((item) => (
              <PropertyCard 
                key={item.id} 
                property={transformToProperty(item)} 
                showActions={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}