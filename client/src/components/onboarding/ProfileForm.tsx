'use client';

import { useState } from 'react';
import { User, Phone, Building2, Home, Briefcase, Hash, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ProfileFormProps {
  role: 'tenant' | 'landlord';
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;  // ✅ Add this line
  initialData?: {
    fullName?: string;
    phone?: string;
    businessName?: string;
    propertyCount?: string;
    experience?: string;
    gstNumber?: string;
    preferredLocations?: string;
    maxBudget?: string;
    moveInDate?: string;
  };
}

export function ProfileForm({ role, onSubmit, isLoading = false, initialData = {} }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    fullName: initialData.fullName || '',
    phone: initialData.phone || '',
    businessName: initialData.businessName || '',
    propertyCount: initialData.propertyCount || '',
    experience: initialData.experience || '',
    gstNumber: initialData.gstNumber || '',
    preferredLocations: initialData.preferredLocations || '',
    maxBudget: initialData.maxBudget || '',
    moveInDate: initialData.moveInDate || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Complete Your Profile</h2>
        <p className="text-gray-600">
          {role === 'landlord' 
            ? 'Tell us about yourself and your property experience'
            : 'Tell us a bit about yourself'}
        </p>
      </div>

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

        {role === 'landlord' ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name (Optional)</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder="e.g., Kumar Properties"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="propertyCount">Number of Properties</Label>
                <div className="relative">
                  <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="propertyCount"
                    type="number"
                    value={formData.propertyCount}
                    onChange={handleChange}
                    className="pl-10"
                    placeholder="5"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="experience"
                    type="number"
                    value={formData.experience}
                    onChange={handleChange}
                    className="pl-10"
                    placeholder="3"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gstNumber">GST Number (Optional)</Label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder="22AAAAA0000A1Z5"
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="preferredLocations">Preferred Locations</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="preferredLocations"
                  value={formData.preferredLocations}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder="e.g., Whitefield, Indiranagar"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="maxBudget">Max Budget (₹)</Label>
                <Input
                  id="maxBudget"
                  type="number"
                  value={formData.maxBudget}
                  onChange={handleChange}
                  placeholder="50000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="moveInDate">Move-in Date</Label>
                <Input
                  id="moveInDate"
                  type="date"
                  value={formData.moveInDate}
                  onChange={handleChange}
                />
              </div>
            </div>
          </>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save & Continue'
          )}
        </Button>
      </form>
    </div>
  );
}