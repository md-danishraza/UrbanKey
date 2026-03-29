'use client';

import { useState } from 'react';
import { MessageCircle, Phone, Mail, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AgreementForm } from '@/components/agreement/AgreementForm';

interface LeadCardProps {
  lead: {
    id: string;
    tenant: { id: string; fullName: string; email: string; phone: string; avatarUrl?: string; };
    property: { id: string; title: string; rent: number; };
    message: string;
    contactMethod: string;
    status: string;
    createdAt: string;
  };
  onStatusUpdate: (leadId: string, status: string) => Promise<void>;
  onAgreementCreated?: () => void;
  isUpdating?: boolean;
}

const statusColors = {
  NEW: 'bg-yellow-100 text-yellow-700',
  CONTACTED: 'bg-blue-100 text-blue-700',
  CONVERTED: 'bg-green-100 text-green-700',
  CLOSED: 'bg-gray-100 text-gray-700',
};

const contactMethodIcons = {
  WHATSAPP: MessageCircle,
  PHONE: Phone,
  EMAIL: Mail,
};

export function LeadCard({ lead, onStatusUpdate, onAgreementCreated, isUpdating }: LeadCardProps) {
  const [showAgreementForm, setShowAgreementForm] = useState(false);
  const ContactIcon = contactMethodIcons[lead.contactMethod as keyof typeof contactMethodIcons];

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === 'CONVERTED') {
      setShowAgreementForm(true);
    } else {
      await onStatusUpdate(lead.id, newStatus);
    }
  };

  const handleAgreementSuccess = () => {
    setShowAgreementForm(false);
    onAgreementCreated?.();
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-start gap-4">
            <div className="flex-1">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-blue-600">
                    {lead.tenant.fullName.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <div>
                    <h3 className="font-semibold text-lg">{lead.tenant.fullName}</h3>
                    <p className="text-sm text-gray-500">{lead.tenant.email}</p>
                    <p className="text-sm text-gray-500">{lead.tenant.phone}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <ContactIcon className="h-3 w-3" />
                      {lead.contactMethod}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(lead.createdAt)}
                    </span>
                    <span className="text-blue-600 font-medium">
                      {lead.property.title} - ₹{lead.property.rent.toLocaleString()}/mo
                    </span>
                  </div>
                  <p className="text-gray-700 mt-2 bg-gray-50 p-2 rounded text-sm">
                    {lead.message}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={lead.status}
                onValueChange={handleStatusChange}
                disabled={isUpdating}
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NEW">New</SelectItem>
                  <SelectItem value="CONTACTED">Contacted</SelectItem>
                  <SelectItem value="CONVERTED">Converted</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Badge className={statusColors[lead.status as keyof typeof statusColors]}>
                {lead.status}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agreement Creation Dialog - Made wider for the PDF preview */}
      <Dialog open={showAgreementForm} onOpenChange={setShowAgreementForm}>
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Draft Rental Agreement</DialogTitle>
          </DialogHeader>
          <AgreementForm
            propertyId={lead.property.id}
            tenantId={lead.tenant.id}
            tenantName={lead.tenant.fullName}
            propertyTitle={lead.property.title}
            defaultRent={lead.property.rent}
            leadId={lead.id}
            onSuccess={handleAgreementSuccess}
            onCancel={() => setShowAgreementForm(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}