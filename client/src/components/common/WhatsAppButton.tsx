'use client';

import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface WhatsAppButtonProps {
  phoneNumber: string;
  propertyTitle: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export function WhatsAppButton({ 
  phoneNumber, 
  propertyTitle, 
  variant = 'outline',
  size = 'default',
  className 
}: WhatsAppButtonProps) {
  const handleClick = () => {
    const message = encodeURIComponent(
      `Hi, I'm interested in your property "${propertyTitle}" listed on UrbanKey. Is it still available?`
    );
    window.open(`https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={cn("bg-green-600 hover:bg-green-700 text-white", className)}
    >
      <MessageCircle className="mr-2 h-4 w-4" />
      Chat on WhatsApp
    </Button>
  );
}