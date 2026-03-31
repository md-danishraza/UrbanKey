'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { ArrowLeft, CreditCard, Calendar, DollarSign, Eye, Loader2, CheckCircle, Clock, Download } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  property: {
    id: string;
    title: string;
  };
  monthlyRent: number;
  startDate: string;
  endDate: string;
}

export default function TenantPaymentsPage() {
  const { getToken } = useAuth();
  const [agreement, setAgreement] = useState<Agreement | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      
      // Get current agreement
      const agreementResponse: any = await apiClient.get('/api/rent/agreements/tenant/current', token);
      if (agreementResponse.agreement) {
        setAgreement(agreementResponse.agreement);
        
        // Get payments for this agreement
        const paymentsResponse: any = await apiClient.get(`/api/payments/agreement/${agreementResponse.agreement.id}`, token);
        setPayments(paymentsResponse.payments || []);
      }
    } catch (error) {
      console.error('Failed to load payments:', error);
      toast.error('Failed to load payment history');
    } finally {
      setIsLoading(false);
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
        return <Badge className="bg-green-500">Paid</Badge>;
      case 'PENDING':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'OVERDUE':
        return <Badge className="bg-red-500">Overdue</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'UPI':
        return '📱';
      case 'BANK_TRANSFER':
        return '🏦';
      case 'CASH':
        return '💵';
      default:
        return '💳';
    }
  };

  const pendingPayments = payments.filter(p => p.status === 'PENDING' || p.status === 'OVERDUE');
  const paidPayments = payments.filter(p => p.status === 'PAID');

  // console.log(selectedPayment)

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
            Back to Dashboard
          </Link>
          <Card className="text-center py-12">
            <CardContent>
              <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No active rental agreement found</p>
              <Link href="/properties/search">
                <Button className="mt-4">Browse Properties</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/tenant/dashboard" className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold">Payment History</h1>
          <p className="text-gray-600 mt-1">Track your rent payments for {agreement.property.title}</p>
          <p className="text-sm text-blue-600 mt-2">
            <Clock className="h-3 w-3 inline mr-1" />
            Payments are updated by your landlord when received
          </p>
        </div>

        {/* Payment Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Monthly Rent</p>
                  <p className="text-2xl font-bold text-blue-600">₹{formatCurrency(agreement.monthlyRent)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Total Paid</p>
                  <p className="text-2xl font-bold text-green-600">
                    ₹{formatCurrency(paidPayments.reduce((sum, p) => sum + p.amount, 0))}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Pending Amount</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    ₹{formatCurrency(pendingPayments.reduce((sum, p) => sum + p.amount, 0))}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Payment History */}
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="pending">
              Upcoming Payments ({pendingPayments.length})
            </TabsTrigger>
            <TabsTrigger value="history">
              Payment History ({paidPayments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            {pendingPayments.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <CheckCircle className="h-12 w-12 text-green-300 mx-auto mb-3" />
                  <p className="text-gray-500">No pending payments!</p>
                  <p className="text-sm text-gray-400">All your rent payments are up to date.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pendingPayments.map((payment) => (
                  <Card key={payment.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-yellow-600" />
                          </div>
                          <div>
                            <p className="font-semibold">
                              {payment.type === 'RENT' ? `Rent - Month ${payment.month}` : payment.type}
                            </p>
                            <p className="text-sm text-gray-500">Due: {formatDate(payment.dueDate)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="text-xl font-bold text-yellow-600">
                            ₹{formatCurrency(payment.amount)}
                          </p>
                          {getStatusBadge(payment.status)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history">
            {paidPayments.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No payment history yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {paidPayments.map((payment) => (
                  <Card key={payment.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                            <span className="text-2xl">{getPaymentMethodIcon(payment.paymentMethod)}</span>
                          </div>
                          <div>
                            <p className="font-semibold">
                              {payment.type === 'RENT' ?  payment.month===null ? payment.notes : `Rent - Month ${payment.month}` : payment.type}
                            </p>
                            <p className="text-sm text-gray-500">
                              Paid on: {formatDate(payment.paymentDate)}
                            </p>
                            {payment.transactionId && (
                              <p className="text-xs text-gray-400">Tx: {payment.transactionId}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="text-xl font-bold text-green-600">
                            ₹{formatCurrency(payment.amount)}
                          </p>
                          {getStatusBadge(payment.status)}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedPayment(payment)}
                            className="gap-1"
                          >
                            <Eye className="h-4 w-4" />
                            Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Payment Details Modal */}
        {selectedPayment && (
          <Dialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
            <DialogContent className="max-w-md">
              <DialogHeader>
              <DialogTitle>Record Payment</DialogTitle>
              <DialogDescription>
                Enter the payment details for this rent payment.
              </DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Amount</span>
                  <span className="font-bold">₹{formatCurrency(selectedPayment.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Type</span>
                  <span>{selectedPayment.type === 'RENT' ? `Rent - Month ${selectedPayment.month}` : selectedPayment.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Date</span>
                  <span>{formatDate(selectedPayment.paymentDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Method</span>
                  <span>{selectedPayment.paymentMethod}</span>
                </div>
                {selectedPayment.transactionId && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Transaction ID</span>
                    <span className="text-sm">{selectedPayment.transactionId}</span>
                  </div>
                )}
                {selectedPayment.notes && (
                  <div>
                    <span className="text-gray-500">Notes</span>
                    <p className="text-sm mt-1">{selectedPayment.notes}</p>
                  </div>
                )}

              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}