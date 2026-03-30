'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  CreditCard, 
  User, 
  Home, 
  Calendar, 
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
    rent: number;
  };
  tenant: {
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
  maintenanceFee?: number;
  terms: string;
  specialConditions?: string;
  status: string;
  signedByTenant: boolean;
  signedByLandlord: boolean;
  signedAt?: string;
  pdfUrl?: string;
  createdAt: string;
}

interface Payment {
  id: string;
  amount: number;
  month: number;
  year: number;
  paymentDate: string;
  dueDate: string;
  type: string;
  status: string;
  paymentMethod?: string;
}

export default function LandlordAgreementDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const agreementId = params.id as string;
  const { getToken } = useAuth();
  const [agreement, setAgreement] = useState<Agreement | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAgreement();
  }, [agreementId]);

  const loadAgreement = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      const response:any = await apiClient.get(`/api/rent/agreements/${agreementId}`, token);
      setAgreement(response.agreement);
      
      // Load payments for this agreement
      const paymentsResponse:any = await apiClient.get(`/api/payments/agreement/${agreementId}`, token);
      setPayments(paymentsResponse.payments || []);
    } catch (error) {
      console.error('Failed to load agreement:', error);
      toast.error('Failed to load agreement details');
      router.push('/landlord/agreements');
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'PENDING_SIGNATURE':
        return <Badge className="bg-yellow-500">Pending Signature</Badge>;
      case 'EXPIRED':
        return <Badge className="bg-gray-500">Expired</Badge>;
      case 'TERMINATED':
        return <Badge className="bg-red-500">Terminated</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentSummary = () => {
    const paid = payments.filter(p => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0);
    const pending = payments.filter(p => p.status === 'PENDING' || p.status === 'OVERDUE').reduce((sum, p) => sum + p.amount, 0);
    return { paid, pending, total: paid + pending };
  };

  const paymentSummary = getPaymentSummary();

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
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">Agreement not found</p>
          <Link href="/landlord/agreements">
            <Button className="mt-4">Back to Agreements</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isActive = agreement.status === 'ACTIVE';
  const isPending = agreement.status === 'PENDING_SIGNATURE';

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/landlord/agreements" className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Agreements
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{agreement.property.title}</h1>
              <p className="text-gray-600 mt-1">Agreement #{agreement.agreementNumber}</p>
            </div>
            {getStatusBadge(agreement.status)}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property & Tenant Info */}
            <Card>
              <CardHeader>
                <CardTitle>Property & Tenant Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Home className="h-4 w-4" />
                      Property
                    </div>
                    <p className="font-medium">{agreement.property.title}</p>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <MapPin className="h-3 w-3" />
                      {agreement.property.addressLine1}, {agreement.property.city}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <User className="h-4 w-4" />
                      Tenant
                    </div>
                    <p className="font-medium">{agreement.tenant.fullName}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Mail className="h-3 w-3" />
                      {agreement.tenant.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Phone className="h-3 w-3" />
                      {agreement.tenant.phone}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Start Date</p>
                    <p className="font-medium">{formatDate(agreement.startDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">End Date</p>
                    <p className="font-medium">{formatDate(agreement.endDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Monthly Rent</p>
                    <p className="font-medium text-blue-600">₹{formatCurrency(agreement.monthlyRent)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Security Deposit</p>
                    <p className="font-medium">₹{formatCurrency(agreement.securityDeposit)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Summary Card (for active agreements) */}
            {isActive && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-500">Total Collected</p>
                      <p className="text-xl font-bold text-blue-600">₹{formatCurrency(paymentSummary.paid)}</p>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <p className="text-sm text-gray-500">Pending</p>
                      <p className="text-xl font-bold text-yellow-600">₹{formatCurrency(paymentSummary.pending)}</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-500">Total Due</p>
                      <p className="text-xl font-bold text-green-600">₹{formatCurrency(paymentSummary.total)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Terms & Conditions */}
            <Card>
              <CardHeader>
                <CardTitle>Terms & Conditions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{agreement.terms}</p>
                </div>
                {agreement.specialConditions && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-2">Special Conditions</h3>
                      <p className="text-sm text-gray-700">{agreement.specialConditions}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {isPending && (
                  <Button variant="outline" className="w-full gap-2" disabled>
                    <Clock className="h-4 w-4" />
                    Awaiting Tenant Signature
                  </Button>
                )}
                
                <Link href={`/landlord/agreements/${agreement.id}/payments`}>
                  <Button variant="outline" className="w-full gap-2">
                    <CreditCard className="h-4 w-4" />
                    View Payments
                  </Button>
                </Link>
                
                <Button variant="outline" className="w-full gap-2" onClick={() => window.print()}>
                  <Download className="h-4 w-4" />
                  Download Agreement
                </Button>
                
                <Button variant="outline" className="w-full gap-2">
                  <Mail className="h-4 w-4" />
                  Send Reminder
                </Button>
              </CardContent>
            </Card>

            {/* Signature Status */}
            <Card>
              <CardHeader>
                <CardTitle>Signature Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Landlord Signature</span>
                  {agreement.signedByLandlord ? (
                    <Badge className="bg-green-500">Signed</Badge>
                  ) : (
                    <Badge variant="outline">Pending</Badge>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Tenant Signature</span>
                  {agreement.signedByTenant ? (
                    <Badge className="bg-green-500">Signed</Badge>
                  ) : (
                    <Badge variant="outline">Pending</Badge>
                  )}
                </div>
                {agreement.signedAt && (
                  <div className="text-xs text-gray-500 mt-2">
                    Signed on: {formatDate(agreement.signedAt)}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Created</span>
                  <span>{formatDate(agreement.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Duration</span>
                  <span>
                    {Math.ceil((new Date(agreement.endDate).getTime() - new Date(agreement.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30))} months
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Rent</span>
                  <span>₹{formatCurrency(agreement.monthlyRent * 11)}</span>
                </div>
                {agreement.maintenanceFee && agreement.maintenanceFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Maintenance</span>
                    <span>₹{formatCurrency(agreement.maintenanceFee)}/mo</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}