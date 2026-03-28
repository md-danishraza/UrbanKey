'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { MessageCircle, Phone, Mail, Clock, Eye, Filter, ChevronDown, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getLandlordLeads, updateLeadStatus, Lead } from '@/lib/api/leads';

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

export default function LandlordLeadsPage() {
  const { getToken } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    loadLeads();
  }, [statusFilter]);

  const loadLeads = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      if (!token) throw new Error("not authorized");
      const filters = statusFilter !== 'ALL' ? { status: statusFilter } : {};
      const response:any = await getLandlordLeads(token, filters);
      setLeads(response.leads);
    } catch (error) {
      console.error('Failed to load leads:', error);
      toast.error('Failed to load leads');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (leadId: string, newStatus: string) => {
    setUpdating(leadId);
    try {
      const token = await getToken();
      if (!token) throw new Error("not authorized");
      await updateLeadStatus(token, leadId, newStatus);
      toast.success('Lead status updated');
      loadLeads();
    } catch (error) {
      console.error('Failed to update lead status:', error);
      toast.error('Failed to update status');
    } finally {
      setUpdating(null);
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

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'NEW').length,
    contacted: leads.filter(l => l.status === 'CONTACTED').length,
    converted: leads.filter(l => l.status === 'CONVERTED').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Leads Management</h1>
          <p className="text-gray-600 mt-1">Manage tenant inquiries for your properties</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Total Leads</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <MessageCircle className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">New</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.new}</p>
                </div>
                <Badge className="bg-yellow-100 text-yellow-700">New</Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Contacted</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.contacted}</p>
                </div>
                <Badge className="bg-blue-100 text-blue-700">Contacted</Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Converted</p>
                  <p className="text-2xl font-bold text-green-600">{stats.converted}</p>
                </div>
                <Badge className="bg-green-100 text-green-700">Converted</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Leads</SelectItem>
                <SelectItem value="NEW">New</SelectItem>
                <SelectItem value="CONTACTED">Contacted</SelectItem>
                <SelectItem value="CONVERTED">Converted</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-sm text-gray-500">{leads.length} leads found</p>
        </div>

        {leads.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No leads found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {leads.map((lead) => {
              const ContactIcon = contactMethodIcons[lead.contactMethod];
              return (
                <Card key={lead.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-lg font-semibold">
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
                              <Link href={`/landlord/properties/${lead.propertyId}`} className="text-blue-600 hover:underline">
                                {lead.property.title}
                              </Link>
                            </div>
                            <p className="text-gray-700 mt-2 bg-gray-50 p-2 rounded">
                              {lead.message}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select
                          value={lead.status}
                          onValueChange={(value) => handleStatusUpdate(lead.id, value)}
                          disabled={updating === lead.id}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NEW">New</SelectItem>
                            <SelectItem value="CONTACTED">Contacted</SelectItem>
                            <SelectItem value="CONVERTED">Converted</SelectItem>
                            <SelectItem value="CLOSED">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                        <Badge className={statusColors[lead.status]}>
                          {lead.status}
                        </Badge>
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