'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Calendar, DollarSign, FileText, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { apiClient } from '@/lib/api/api-client';
import { AgreementPDF } from './AgreementPDF';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { toast } from 'sonner';

interface AgreementFormProps {
  propertyId: string;
  tenantId: string;
  tenantName: string;
  propertyTitle: string;
  defaultRent: number;
  leadId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function AgreementForm({
  propertyId, tenantId, tenantName, propertyTitle, defaultRent, leadId, onSuccess, onCancel,
}: AgreementFormProps) {
  const { getToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // Fixes Next.js SSR issues with PDF renderer

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [formData, setFormData] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 11)).toISOString().split('T')[0],
    monthlyRent: defaultRent,
    securityDeposit: defaultRent * 2,
    maintenanceFee: 0,
    terms: `This Rental Agreement is made on ${new Date().toLocaleDateString()} between the Landlord and Tenant.

1. PROPERTY: The Landlord agrees to rent the property "${propertyTitle}" to the Tenant.

2. TERM: The lease term is for 11 months commencing on ${new Date().toISOString().split('T')[0]}.

3. RENT: The Tenant agrees to pay monthly rent of ₹${defaultRent.toLocaleString()} on or before the 5th of each month.

4. SECURITY DEPOSIT: The Tenant shall pay a security deposit of ₹${(defaultRent * 2).toLocaleString()}, refundable at the end of the lease term subject to deductions for damages.

5. MAINTENANCE: The Tenant is responsible for minor repairs up to ₹500. Major repairs are the Landlord's responsibility.

6. UTILITIES: Electricity and water charges are to be paid by the Tenant.

7. PARKING: One designated parking spot is included.

8. NOTICE PERIOD: Either party must give 30 days written notice to terminate this agreement.

9. SUBLETTING: The Tenant shall not sublet the property without written consent from the Landlord.

10. GOVERNING LAW: This agreement shall be governed by the laws of India.`,
    specialConditions: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleCreateAgreement = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      
      const response: any = await apiClient.post('/api/rent/agreements', {
        propertyId, tenantId, startDate: formData.startDate, endDate: formData.endDate,
        monthlyRent: Number(formData.monthlyRent), securityDeposit: Number(formData.securityDeposit),
        maintenanceFee: Number(formData.maintenanceFee), terms: formData.terms,
        specialConditions: formData.specialConditions,
      }, token);

      if (response.success) {
        await apiClient.patch(`/api/leads/${leadId}/status`, { status: 'CONVERTED' }, token);
        toast.success('Agreement created successfully!');
        onSuccess();
      }
    } catch (error) {
      console.error('Failed to create agreement:', error);
      toast.error('Failed to create agreement');
    } finally {
      setIsLoading(false);
    }
  };

  const agreementData = {
    propertyTitle, tenantName, monthlyRent: formData.monthlyRent,
    securityDeposit: formData.securityDeposit, startDate: formData.startDate,
    endDate: formData.endDate, terms: formData.terms, specialConditions: formData.specialConditions,
  };

  // Prevent hydration mismatch for PDF viewer
  if (!isMounted) return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-rose-500" /></div>;

  return (
    <div className="space-y-6">
      {!showPreview ? (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input id="startDate" type="date" value={formData.startDate} onChange={handleChange} className="pl-10" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input id="endDate" type="date" value={formData.endDate} onChange={handleChange} className="pl-10" required />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="monthlyRent">Monthly Rent (₹) *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input id="monthlyRent" type="number" value={formData.monthlyRent} onChange={handleChange} className="pl-10" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="securityDeposit">Security Deposit (₹) *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input id="securityDeposit" type="number" value={formData.securityDeposit} onChange={handleChange} className="pl-10" required />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maintenanceFee">Maintenance Fee (₹/month) (Optional)</Label>
            <Input id="maintenanceFee" type="number" value={formData.maintenanceFee} onChange={handleChange} placeholder="0" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="terms">Terms & Conditions *</Label>
            <Textarea id="terms" value={formData.terms} onChange={handleChange} rows={6} className="text-sm" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialConditions">Special Conditions (Optional)</Label>
            <Textarea id="specialConditions" value={formData.specialConditions} onChange={handleChange} rows={3} placeholder="Any special conditions or agreements..." />
          </div>

          <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800 leading-relaxed">
              This agreement will be sent to the tenant for signature. Both parties will need to sign before it becomes active.
            </p>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancel</Button>
            <Button type="button" variant="secondary" onClick={() => setShowPreview(true)} className="flex-1">
              <FileText className="mr-2 h-4 w-4" /> Preview PDF
            </Button>
            <Button onClick={handleCreateAgreement} disabled={isLoading} className="flex-1 bg-rose-500 hover:bg-rose-600 text-white">
              {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</> : 'Create Agreement'}
            </Button>
          </div>
        </>
      ) : (
        <div className="flex flex-col h-[70vh] space-y-4">
          {/* FIX: PDFViewer is strictly required to render react-pdf in the DOM */}
          <div className="flex-1 rounded-md overflow-hidden border bg-muted/20">
            <PDFViewer width="100%" height="100%" className="border-none">
              <AgreementPDF data={agreementData} />
            </PDFViewer>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setShowPreview(false)} className="flex-1">
              Edit Details
            </Button>
            <PDFDownloadLink
              document={<AgreementPDF data={agreementData} />}
              fileName={`agreement_${propertyTitle.replace(/\s/g, '_')}.pdf`}
              className="flex-1"
            >
              {({ loading }) => (
                <Button type="button" variant="secondary" disabled={loading} className="w-full">
                  {loading ? 'Generating PDF...' : 'Download Copy'}
                </Button>
              )}
            </PDFDownloadLink>
            <Button onClick={handleCreateAgreement} disabled={isLoading} className="flex-1 bg-rose-500 hover:bg-rose-600 text-white">
              {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</> : 'Confirm & Send'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}