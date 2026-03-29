'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { ArrowLeft, FileText, Download, Signature, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { apiClient } from '@/lib/api/api-client';
import { AgreementPDF } from '@/components/agreement/AgreementPDF';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { formatCurrency } from '@/lib/utils';

interface Agreement {
  id: string;
  agreementNumber: string;
  property: {
    id: string;
    title: string;
    addressLine1: string;
    city: string;
  };
  landlord: {
    id: string;
    fullName: string;
  };
  startDate: string;
  endDate: string;
  monthlyRent: number;
  securityDeposit: number;
  terms: string;
  specialConditions?: string;
  status: string;
  signedByTenant: boolean;
  signedByLandlord: boolean;
  signedAt?: string;
}

export default function TenantAgreementPage() {
  const router = useRouter();
  const { getToken } = useAuth();
  const [agreement, setAgreement] = useState<Agreement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigning, setIsSigning] = useState(false);

  useEffect(() => {
    loadAgreement();
  }, []);

  const loadAgreement = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      const response:any = await apiClient.get('/api/rent/agreements/tenant', token);
      if (response.agreements && response.agreements.length > 0) {
        // Fetch full agreement details
        const agreementId = response.agreements[0].id;
        const fullAgreement:any = await apiClient.get(`/api/rent/agreements/${agreementId}`, token);
        setAgreement(fullAgreement.agreement);
      }
    } catch (error) {
      console.error('Failed to load agreement:', error);
      toast.error('Failed to load agreement');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignAgreement = async () => {
    if (!agreement) return;
    
    setIsSigning(true);
    try {
      const token = await getToken();
      await apiClient.post(`/api/rent/agreements/${agreement.id}/sign`, {}, token);
      toast.success('Agreement signed successfully! Your rental is now active.');
      router.push('/tenant/dashboard');
    } catch (error) {
      console.error('Failed to sign agreement:', error);
      toast.error('Failed to sign agreement');
    } finally {
      setIsSigning(false);
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
        <div className="max-w-4xl mx-auto">
          <Link href="/tenant/dashboard" className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to My Home
          </Link>
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No active agreement found</p>
              <Link href="/tenant/dashboard">
                <Button className="mt-4">Go to My Home</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const needsSignature = !agreement.signedByTenant && agreement.status === 'PENDING_SIGNATURE';
  const isSigned = agreement.signedByTenant;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/tenant/dashboard" className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to My Home
        </Link>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">Rental Agreement</CardTitle>
              <Badge className={isSigned ? 'bg-green-500' : 'bg-yellow-500'}>
                {isSigned ? 'Signed' : needsSignature ? 'Pending Signature' : agreement.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Agreement Details */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Agreement Number</p>
                  <p className="font-medium">{agreement.agreementNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Property</p>
                  <p className="font-medium">{agreement.property.title}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Landlord</p>
                  <p className="font-medium">{agreement.landlord.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tenant</p>
                  <p className="font-medium">You</p>
                </div>
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
            </div>

            <Separator />

            {/* Terms */}
            <div>
              <h3 className="font-semibold mb-2">Terms & Conditions</h3>
              <div className="bg-gray-50 p-4 rounded-lg max-h-80 overflow-y-auto">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{agreement.terms}</p>
              </div>
            </div>

            {agreement.specialConditions && (
              <div>
                <h3 className="font-semibold mb-2">Special Conditions</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">{agreement.specialConditions}</p>
                </div>
              </div>
            )}

            <Separator />

            {/* Signature Status */}
            <div className="space-y-3">
              <h3 className="font-semibold">Signatures</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Landlord Signature</p>
                  <div className="flex items-center gap-2 mt-1">
                    {agreement.signedByLandlord ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600">Signed</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm text-yellow-600">Pending</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Your Signature</p>
                  <div className="flex items-center gap-2 mt-1">
                    {agreement.signedByTenant ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600">Signed</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm text-yellow-600">Pending</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <PDFDownloadLink
                document={<AgreementPDF data={{
                  propertyTitle: agreement.property.title,
                  tenantName: 'You',
                  monthlyRent: agreement.monthlyRent,
                  securityDeposit: agreement.securityDeposit,
                  startDate: agreement.startDate,
                  endDate: agreement.endDate,
                  terms: agreement.terms,
                  specialConditions: agreement.specialConditions,
                }} />}
                fileName={`agreement_${agreement.agreementNumber}.pdf`}
              >
                {({ loading }) => (
                  <Button type="button" variant="outline" disabled={loading} className="flex-1">
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                      </>
                    )}
                  </Button>
                )}
              </PDFDownloadLink>

              {needsSignature && (
                <Button onClick={handleSignAgreement} disabled={isSigning} className="flex-1">
                  {isSigning ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Signature className="mr-2 h-4 w-4" />
                  )}
                  Sign Agreement
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}