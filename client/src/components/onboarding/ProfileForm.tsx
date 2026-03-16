'use client';

import { useState } from 'react';


import { User, Phone, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';


interface TenantFormData {
    fullName: string;
    phone: string;
    preferredLocations: string;
    maxBudget: string;
    moveInDate: string;
  }
  
interface LandlordFormData {
    fullName: string;
    phone: string;
    propertyCount: string;
    experience: string;
    gstNumber: string;
  }
  
type FormData = TenantFormData | LandlordFormData;


interface ProfileFormProps {
  role: 'tenant' | 'landlord';
  onSubmit: (data: any) => Promise<void>;
}

export function ProfileForm({ role, onSubmit }: ProfileFormProps) {

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>(
    role === 'tenant'
      ? {
          fullName: '',
          phone: '',
          preferredLocations: '',
          maxBudget: '',
          moveInDate: '',
        }
      : {
          fullName: '',
          phone: '',
          propertyCount: '',
          experience: '',
          gstNumber: '',
        }
  );
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value,
    }));
  };
  

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="pl-10"
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                className="pl-10"
                placeholder="+91 98765 43210"
                required
              />
            </div>
          </div>

          {role === 'tenant' ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="preferredLocations">Preferred Locations</Label>
                <Input
                  id="preferredLocations"
                  value={(formData as TenantFormData).preferredLocations}
                  onChange={handleChange}
                  placeholder="e.g., Whitefield, Indiranagar"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="maxBudget">Max Budget (₹)</Label>
                  <Input
                    id="maxBudget"
                    type="number"
                    value={(formData as TenantFormData).maxBudget}
                    onChange={handleChange}
                    placeholder="50000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="moveInDate">Move-in Date</Label>
                  <Input
                    id="moveInDate"
                    type="date"
                    value={(formData as TenantFormData).moveInDate}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="propertyCount">Number of Properties</Label>
                  <Input
                    id="propertyCount"
                    type="number"
                    value={(formData as LandlordFormData).propertyCount}
                    onChange={handleChange}
                    placeholder="5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    type="number"
                    value={(formData as LandlordFormData).experience}
                    onChange={handleChange}
                    placeholder="3"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gstNumber">GST Number (Optional)</Label>
                <Input
                  id="gstNumber"
                  value={(formData as LandlordFormData).gstNumber}
                  onChange={handleChange}
                  placeholder="22AAAAA0000A1Z5"
                />
              </div>
            </>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save & Continue'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}