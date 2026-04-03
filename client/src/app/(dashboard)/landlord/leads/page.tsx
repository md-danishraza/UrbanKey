'use client';

import { useState, useEffect } from 'react';

import { useAuth } from '@clerk/nextjs';
import { MessageCircle, Filter,  Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getLandlordLeads, updateLeadStatus, Lead } from '@/lib/api/leads';
import { LeadCard } from '@/components/landlord/LeadCard';



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
    <div className="min-h-screen  bg-gradient-to-b from-rose-50 to-white py-8 px-4">
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
            {leads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onStatusUpdate={handleStatusUpdate}
                onAgreementCreated={loadLeads}
                isUpdating={updating === lead.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}