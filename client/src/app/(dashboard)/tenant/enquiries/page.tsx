'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { MessageCircle, Phone, Mail, Clock, Eye, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getMyLeads, Lead } from '@/lib/api/leads';

import { Button } from '@/components/ui/button';

const statusColors = {
  NEW: 'bg-yellow-100 text-yellow-700',
  CONTACTED: 'bg-blue-100 text-blue-700',
  CONVERTED: 'bg-green-100 text-green-700',
  CLOSED: 'bg-gray-100 text-gray-700',
};

const statusLabels = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  CONVERTED: 'Converted',
  CLOSED: 'Closed',
};

const contactMethodIcons = {
  WHATSAPP: MessageCircle,
  PHONE: Phone,
  EMAIL: Mail,
};

export default function TenantEnquiriesPage() {
  const { getToken } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEnquiries();
  }, []);

  const loadEnquiries = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      if (!token) throw new Error("not authorized");
      const response:any = await getMyLeads(token);
      setLeads(response.leads);
    } catch (error) {
      console.error('Failed to load enquiries:', error);
      toast.error('Failed to load enquiries');
    } finally {
      setIsLoading(false);
    }
  };

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">My Enquiries</h1>
          <p className="text-gray-600 mt-1">Track all your property inquiries</p>
        </div>

        {leads.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-2">No enquiries yet</p>
              <Link href="/properties/search">
                <Button>Browse Properties</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {leads.map((lead) => {
              const ContactIcon = contactMethodIcons[lead.contactMethod];
              return (
                <Card key={lead.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            {lead.property.images[0] ? (
                              <img
                                src={lead.property.images[0].imageUrl}
                                alt={lead.property.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                No Image
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <Link href={`/properties/${lead.propertyId}`}>
                              <h3 className="font-semibold text-lg hover:text-blue-600">
                                {lead.property.title}
                              </h3>
                            </Link>
                            <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <ContactIcon className="h-3 w-3" />
                                {lead.contactMethod}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatDate(lead.createdAt)}
                              </span>
                            </div>
                            <p className="text-gray-700 mt-2">{lead.message}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={statusColors[lead.status]}>
                          {statusLabels[lead.status]}
                        </Badge>
                        <Link href={`/properties/${lead.propertyId}`}>
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Eye className="h-4 w-4" />
                            View Property
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}