'use client';

import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/hooks/useWishlist';
import { cn } from '@/lib/utils';
import { useAuth } from '@clerk/nextjs';

interface WishlistButtonProps {
  propertyId: string;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function WishlistButton({ propertyId, className, variant = 'outline', size = 'icon' }: WishlistButtonProps) {
  const { isSignedIn } = useAuth();
  const { isInWishlist, isLoading, toggleWishlist } = useWishlist(propertyId);

  // Don't show wishlist button for non-authenticated users
  if (!isSignedIn) {
    return null;
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleWishlist}
      disabled={isLoading}
      className={cn(className)}
    >
      <Heart
        className={cn(
          "h-5 w-5 transition-colors",
          isInWishlist && "fill-red-500 text-red-500"
        )}
      />
    </Button>
  );
}