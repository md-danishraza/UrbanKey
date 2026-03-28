'use client';

import { useState } from 'react';
import { MessageCircle, Phone, Mail, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@clerk/nextjs';
import { createLead } from '@/lib/api/leads';
import { toast } from 'sonner';

interface EnquiryFormProps {
  propertyId: string;
  propertyTitle: string;
  trigger?: React.ReactNode;
}

export function EnquiryForm({ propertyId, propertyTitle, trigger }: EnquiryFormProps) {
  const { getToken } = useAuth();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    message: '',
    contactMethod: 'WHATSAPP',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = await getToken();
      if (!token) throw new Error("not authorized");
      await createLead(token, {
        propertyId,
        message: formData.message,
        contactMethod: formData.contactMethod,
      });
      
      toast.success('Enquiry sent successfully! The landlord will contact you soon.');
      setOpen(false);
      setFormData({ message: '', contactMethod: 'WHATSAPP' });
    } catch (error) {
      console.error('Failed to send enquiry:', error);
      toast.error('Failed to send enquiry. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="w-full">
            <MessageCircle className="mr-2 h-4 w-4" />
            Send Enquiry
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enquire about {propertyTitle}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Preferred Contact Method</Label>
            <RadioGroup
              value={formData.contactMethod}
              onValueChange={(value) => setFormData(prev => ({ ...prev, contactMethod: value }))}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="WHATSAPP" id="whatsapp" />
                <Label htmlFor="whatsapp" className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4 text-green-600" />
                  WhatsApp
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="PHONE" id="phone" />
                <Label htmlFor="phone" className="flex items-center gap-1">
                  <Phone className="h-4 w-4 text-blue-600" />
                  Phone
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="EMAIL" id="email" />
                <Label htmlFor="email" className="flex items-center gap-1">
                  <Mail className="h-4 w-4 text-red-600" />
                  Email
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Your Message</Label>
            <Textarea
              id="message"
              placeholder="I'm interested in this property. Is it still available?"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              rows={4}
              required
            />
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Sending...' : 'Send Enquiry'}
              <Send className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}