'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { Home, FileText, CreditCard,  User, Phone, Mail, MapPin, Loader2, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { apiClient } from '@/lib/api/api-client';
import { formatCurrency } from '@/lib/utils';

interface Agreement {
  id: string;
  agreementNumber: string;
  property: {
    id: string;
    title: string;
    addressLine1: string;
    city: string;
    images: { imageUrl: string; isPrimary: boolean }[];
  };
  landlord: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    avatarUrl?: string;
  };
  startDate: string;
  endDate: string;
  monthlyRent: number;
  securityDeposit: number;
  status: string;
  signedByTenant: boolean;
  signedByLandlord: boolean;
  pdfUrl?: string;
}

export default function TenantMyHomePage() {
  const { getToken } = useAuth();
  const [agreement, setAgreement] = useState<Agreement | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadActiveAgreement();
  }, []);

  const loadActiveAgreement = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      const response:any = await apiClient.get('/api/rent/agreements/tenant', token);
      // console.log(response)
      if (response.agreements && response.agreements.length > 0) {
        // Get the most recent agreement (could be pending or active)
        setAgreement(response.agreements[0]);
      }
    } catch (error) {
      console.error('Failed to load agreement:', error);
      toast.error('Failed to load your home details');
    } finally {
      setIsLoading(false);
    }
  };
   
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!agreement) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Home className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-700 mb-2">No Active Rental</h1>
          <p className="text-gray-500 mb-6">You don't have an active rental agreement yet.</p>
          <Link href="/properties/search">
            <Button>Browse Properties</Button>
          </Link>
        </div>
      </div>
    );
  }

  const needsSignature = !agreement.signedByTenant && agreement.status === 'PENDING_SIGNATURE';
  const isActive = agreement.status === 'ACTIVE';
  const monthsLeft = Math.ceil((new Date(agreement.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30));

  return (
    <div className="min-h-screen  bg-gradient-to-b from-rose-50 to-white py-8 px-4">
      <div className="max-w-5xl mx-auto">
      


        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">My Home</h1>
          <p className="text-gray-600 mt-1">Your current rental information</p>
        </div>

        {/* Property Card */}
        <Card className="mb-6 p-0 overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3 h-48 md:h-auto">
              {agreement.property.images[0] ? (
                <img
                  src={agreement.property.images[0].imageUrl}
                  alt={agreement.property.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <Home className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-1 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold">{agreement.property.title}</h2>
                  <div className="flex items-center gap-1 text-gray-500 mt-1">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{agreement.property.addressLine1}, {agreement.property.city}</span>
                  </div>
                </div>
                <Badge className={isActive ? 'bg-green-500' : 'bg-yellow-500'}>
                  {isActive ? 'Active' : needsSignature ? 'Awaiting Signature' : agreement.status}
                </Badge>
              </div>

              <Separator className="my-4" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Monthly Rent</p>
                  <p className="text-2xl font-bold text-blue-600">₹{formatCurrency(agreement.monthlyRent)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Security Deposit</p>
                  <p className="text-lg font-semibold">₹{formatCurrency(agreement.securityDeposit)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Lease Period</p>
                  <p className="text-sm">{formatDate(agreement.startDate)} - {formatDate(agreement.endDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Months Remaining</p>
                  <p className="text-sm font-medium">{monthsLeft} months</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Link href={`/tenant/dashboard/agreement`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Rental Agreement</h3>
                    <p className="text-sm text-gray-500">View and download your agreement</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </CardContent>
            </Card>
          </Link>

          <Link href={`/tenant/dashboard/payments`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CreditCard className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Payment History</h3>
                    <p className="text-sm text-gray-500">Track your rent payments</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Landlord Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Landlord Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <User className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold">{agreement.landlord.fullName}</p>
                <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {agreement.landlord.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {agreement.landlord.phone}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}