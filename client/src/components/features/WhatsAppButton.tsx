'use client';

import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  phoneNumber: string;
  propertyTitle: string;
  variant?: 'default' | 'outline' | 'ghost';
}

export function WhatsAppButton({ phoneNumber, propertyTitle, variant = 'outline' }: WhatsAppButtonProps) {
  const message = encodeURIComponent(
    `Hi, I'm interested in your property "${propertyTitle}" listed on UrbanKey. Is it still available? I'd like to know more about it.`
  );
  
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${message}`;

  return (
    <Button
      variant={variant}
      className="bg-green-600 hover:bg-green-700 text-white"
      onClick={() => window.open(whatsappUrl, '_blank')}
    >
      <MessageCircle className="mr-2 h-4 w-4" />
      WhatsApp
    </Button>
  );
}