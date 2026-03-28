'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { Heart, MapPin, Home, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WishlistButton } from '@/components/tenant/WishlistButton';
import { getWishlist, WishlistItem } from '@/lib/api/wishlist';
import { formatCurrency } from '@/lib/utils';

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
      const response:any = await getWishlist(token);
      setWishlist(response.wishlist);
    } catch (error) {
      console.error('Failed to load wishlist:', error);
      toast.error('Failed to load wishlist');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
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
              <Card key={item.id} className="overflow-hidden">
                <div className="relative h-48 bg-gray-200">
                  {item.property.images[0] ? (
                    <img
                      src={item.property.images[0].imageUrl}
                      alt={item.property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Home className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <WishlistButton propertyId={item.propertyId} />
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <Link href={`/properties/${item.propertyId}`}>
                    <h3 className="font-semibold text-lg mb-1 hover:text-blue-600">
                      {item.property.title}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
                    <MapPin className="h-4 w-4" />
                    {item.property.city}
                  </div>
                  <p className="text-xl font-bold text-blue-600">
                    ₹{formatCurrency(item.property.rent)}<span className="text-sm text-gray-500">/mo</span>
                  </p>
                  <Badge variant="outline" className="mt-2">
                    {item.property.bhk}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}