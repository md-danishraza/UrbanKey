'use client';

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Loader2, Upload, Calendar, DollarSign, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiClient } from '@/lib/api/api-client';
import { toast } from 'sonner';

interface PaymentFormProps {
  agreementId: string;
  payment: {
    id: string;
    amount: number;
    month: number;
    year: number;
    dueDate: string;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

export function PaymentForm({ agreementId, payment, onSuccess, onCancel }: PaymentFormProps) {
  const { getToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    paymentDate: new Date().toISOString().split('T')[0],
    transactionId: '',
    paymentMethod: 'UPI',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = await getToken();
      await apiClient.post('/api/payments', {
        agreementId,
        amount: payment.amount,
        paymentDate: formData.paymentDate,
        type: 'RENT',
        description: `Rent payment for month ${payment.month}/${payment.year}`,
        transactionId: formData.transactionId,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
      }, token);

      toast.success('Payment recorded successfully!');
      onSuccess();
    } catch (error) {
      console.error('Failed to record payment:', error);
      toast.error('Failed to record payment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Amount</Label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input value={`₹${payment.amount.toLocaleString()}`} disabled className="pl-10" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="paymentDate">Payment Date *</Label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="paymentDate"
            type="date"
            value={formData.paymentDate}
            onChange={handleChange}
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="paymentMethod">Payment Method</Label>
        <Select value={formData.paymentMethod} onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="UPI">UPI (Google Pay, PhonePe, etc.)</SelectItem>
            <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
            <SelectItem value="CASH">Cash</SelectItem>
            <SelectItem value="CHEQUE">Cheque</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="transactionId">Transaction ID / UTR (Optional)</Label>
        <div className="relative">
          <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="transactionId"
            placeholder="Enter transaction reference"
            value={formData.transactionId}
            onChange={handleChange}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <textarea
          id="notes"
          rows={2}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Any additional notes..."
          value={formData.notes}
          onChange={handleChange}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Record Payment
            </>
          )}
        </Button>
      </div>
    </form>
  );
}