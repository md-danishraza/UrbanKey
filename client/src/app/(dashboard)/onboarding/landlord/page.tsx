'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function LandlordOnboarding() {
  const { user } = useUser();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Welcome to UrbanKey! 🏢</CardTitle>
          <CardDescription>
            Start listing your properties and reach thousands of tenants
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-800">
              List your first property and get verified to start receiving inquiries.
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold">Next steps:</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Complete your landlord profile</li>
              <li>Get verified (takes 5 minutes)</li>
              <li>List your first property</li>
              <li>Manage inquiries from tenants</li>
            </ul>
          </div>

          <Button 
            className="w-full bg-purple-600 hover:bg-purple-700"
            onClick={() => router.push('/landlord/properties/new')}
          >
            List Your First Property
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}