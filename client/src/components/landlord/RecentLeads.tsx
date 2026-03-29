'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageCircle, Phone, Mail, Eye,  Clock, } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useAuth } from '@clerk/nextjs';
import { apiClient } from '@/lib/api/api-client';

interface Lead {
  id: string;
  tenantId: string;
  propertyId: string;
  property: {
    id: string;
    title: string;
    images: { imageUrl: string; isPrimary: boolean }[];
  };
  tenant: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    avatarUrl?: string;
  };
  contactMethod: 'WHATSAPP' | 'PHONE' | 'EMAIL';
  message: string;
  status: 'NEW' | 'CONTACTED' | 'CONVERTED' | 'CLOSED';
  createdAt: string;
}

interface RecentLeadsProps {
  limit?: number;
  className?: string;
}

const statusColors = {
  NEW: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  CONTACTED: 'bg-blue-100 text-blue-700 border-blue-200',
  CONVERTED: 'bg-green-100 text-green-700 border-green-200',
  CLOSED: 'bg-gray-100 text-gray-700 border-gray-200',
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

export function RecentLeads({ limit = 5, className }: RecentLeadsProps) {
  const { getToken } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      if (!token) return;
      
      const response:any = await apiClient.get(`/api/landlord/dashboard/leads?limit=${limit}`, token);
      if (response.success) {
        setLeads(response.leads);
      }
    } catch (error) {
      console.error('Failed to load leads:', error);
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
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg">Recent Leads</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (leads.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg">Recent Leads</CardTitle>
        </CardHeader>
        <CardContent className="py-8 text-center">
          <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No leads yet</p>
          <p className="text-xs text-gray-400 mt-1">Leads will appear when tenants inquire</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Recent Leads</CardTitle>
        <Link href="/landlord/leads">
          <Button variant="ghost" size="sm" className="gap-1">
            View All
            <Eye className="h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {leads.map((lead) => {
          const ContactIcon = contactMethodIcons[lead.contactMethod];
          return (
            <div key={lead.id} className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <Avatar className="h-10 w-10">
                <AvatarImage src={lead.tenant.avatarUrl} />
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {lead.tenant.fullName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-gray-900 truncate">{lead.tenant.fullName}</p>
                  <Badge className={cn("text-xs", statusColors[lead.status])}>
                    {statusLabels[lead.status]}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="h-3 w-3" />
                    {formatDate(lead.createdAt)}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                  {lead.message}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <ContactIcon className="h-3 w-3" />
                    {lead.contactMethod}
                  </span>
                  <Link 
                    href={`/landlord/properties/${lead.propertyId}`}
                    className="text-blue-600 hover:underline"
                  >
                    {lead.property.title}
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}