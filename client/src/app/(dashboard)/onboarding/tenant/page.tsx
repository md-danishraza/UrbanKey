'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function TenantOnboarding() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Here you can make API calls to update user role in your backend
    if (user) {
      // Example: fetch('/api/users/me', { method: 'PUT', body: JSON.stringify({ role: 'TENANT' }) })
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Welcome to UrbanKey! 🏠</CardTitle>
          <CardDescription>
            Let's get you set up to find your perfect home
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              We'll help you find the perfect rental based on your preferences.
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold">Next steps:</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Complete your profile</li>
              <li>Set your budget preferences</li>
              <li>Browse properties</li>
              <li>Save favorites to wishlist</li>
            </ul>
          </div>

          <Button 
            className="w-full"
            onClick={() => router.push('/properties/search')}
          >
            Start Browsing Properties
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}