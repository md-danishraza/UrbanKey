'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { ArrowLeft, CreditCard, CheckCircle, Clock, AlertCircle, Loader2, Mail } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiClient } from '@/lib/api/api-client';
import { formatCurrency } from '@/lib/utils';

interface Payment {
  id: string;
  amount: number;
  month: number;
  year: number;
  paymentDate: string;
  dueDate: string;
  type: string;
  status: string;
  description?: string;
  transactionId?: string;
  paymentMethod: string;
  notes?: string;
}

interface Agreement {
  id: string;
  agreementNumber: string;
  property: { title: string };
  tenant: { fullName: string; email: string; phone: string };
  monthlyRent: number;
}

export default function LandlordPaymentsPage() {
  const params = useParams();
  const router = useRouter();
  const agreementId = params.id as string;
  const { getToken } = useAuth();
  const [agreement, setAgreement] = useState<Agreement | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      
      // Get agreement details
      const agreementResponse:any = await apiClient.get(`/api/rent/agreements/${agreementId}`, token);
      setAgreement(agreementResponse.agreement);
      
      // Get payments
      const paymentsResponse:any = await apiClient.get(`/api/payments/agreement/${agreementId}`, token);
      setPayments(paymentsResponse.payments || []);
    } catch (error) {
      console.error('Failed to load payments:', error);
      toast.error('Failed to load payment data');
    } finally {
      setIsLoading(false);
    }
  };

  const updatePaymentStatus = async (paymentId: string, status: string) => {
    setUpdating(paymentId);
    try {
      const token = await getToken();
      await apiClient.patch(`/api/payments/${paymentId}`, { status }, token);
      toast.success('Payment status updated');
      loadData();
    } catch (error) {
      console.error('Failed to update payment status:', error);
      toast.error('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return <Badge className="bg-green-500">Received</Badge>;
      case 'PENDING':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'OVERDUE':
        return <Badge className="bg-red-500">Overdue</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const totalReceived = payments.filter(p => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'PENDING' || p.status === 'OVERDUE').reduce((sum, p) => sum + p.amount, 0);

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
          <p className="text-gray-500">Agreement not found</p>
          <Link href="/landlord/agreements">
            <Button className="mt-4">Back to Agreements</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href={`/landlord/agreements/${agreementId}`} className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Agreement
          </Link>
          <h1 className="text-2xl font-bold">Payment Records</h1>
          <p className="text-gray-600 mt-1">
            {agreement.property.title} - {agreement.tenant.fullName}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Monthly Rent</p>
                  <p className="text-2xl font-bold text-blue-600">₹{formatCurrency(agreement.monthlyRent)}</p>
                </div>
                <CreditCard className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Total Received</p>
                  <p className="text-2xl font-bold text-green-600">₹{formatCurrency(totalReceived)}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Pending Collection</p>
                  <p className="text-2xl font-bold text-yellow-600">₹{formatCurrency(totalPending)}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payments Table */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">Month</th>
                    <th className="text-left py-3 px-2">Due Date</th>
                    <th className="text-left py-3 px-2">Amount</th>
                    <th className="text-left py-3 px-2">Payment Date</th>
                    <th className="text-left py-3 px-2">Method</th>
                    <th className="text-left py-3 px-2">Status</th>
                    <th className="text-left py-3 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-2">
                        {payment.type === 'RENT' ? `Month ${payment.month}` : payment.type}
                      </td>
                      <td className="py-3 px-2 text-sm text-gray-600">
                        {formatDate(payment.dueDate)}
                      </td>
                      <td className="py-3 px-2 font-medium">
                        ₹{formatCurrency(payment.amount)}
                      </td>
                      <td className="py-3 px-2 text-sm text-gray-600">
                        {payment.paymentDate ? formatDate(payment.paymentDate) : '-'}
                      </td>
                      <td className="py-3 px-2 text-sm">
                        {payment.paymentMethod || '-'}
                      </td>
                      <td className="py-3 px-2">
                        {getStatusBadge(payment.status)}
                      </td>
                      <td className="py-3 px-2">
                        {payment.status === 'PENDING' && (
                          <Select
                            value={payment.status}
                            onValueChange={(value) => updatePaymentStatus(payment.id, value)}
                            disabled={updating === payment.id}
                          >
                            <SelectTrigger className="w-[130px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PENDING">Pending</SelectItem>
                              <SelectItem value="PAID">Mark as Received</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                        {payment.status === 'PAID' && (
                          <span className="text-sm text-green-600">Completed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Send Reminder Button */}
        <div className="mt-6 flex justify-end">
          <Button variant="outline" className="gap-2">
            <Mail className="h-4 w-4" />
            Send Payment Reminder
          </Button>
        </div>
      </div>
    </div>
  );
}