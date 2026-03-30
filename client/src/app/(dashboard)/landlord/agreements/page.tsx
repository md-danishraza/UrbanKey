'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { 
  FileText, 
  Eye, 
  Home, 
  User, 
  Calendar, 
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  Search,
  Filter
} from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiClient } from '@/lib/api/api-client';
import { formatCurrency } from '@/lib/utils';

interface Agreement {
  id: string;
  agreementNumber: string;
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
  startDate: string;
  endDate: string;
  monthlyRent: number;
  securityDeposit: number;
  status: string;
  signedByTenant: boolean;
  signedByLandlord: boolean;
  createdAt: string;
}

const statusColors = {
  ACTIVE: 'bg-green-500',
  PENDING_SIGNATURE: 'bg-yellow-500',
  EXPIRED: 'bg-gray-500',
  TERMINATED: 'bg-red-500',
};

const statusLabels = {
  ACTIVE: 'Active',
  PENDING_SIGNATURE: 'Pending Signature',
  EXPIRED: 'Expired',
  TERMINATED: 'Terminated',
};

export default function LandlordAgreementsPage() {
  const { getToken } = useAuth();
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    loadAgreements();
  }, []);

  const loadAgreements = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      const response:any = await apiClient.get('/api/rent/agreements/landlord', token);
      setAgreements(response.agreements || []);
    } catch (error) {
      console.error('Failed to load agreements:', error);
      toast.error('Failed to load agreements');
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
    const color = statusColors[status as keyof typeof statusColors] || 'bg-gray-500';
    const label = statusLabels[status as keyof typeof statusLabels] || status;
    return <Badge className={color}>{label}</Badge>;
  };

  const filteredAgreements = agreements.filter(agreement => {
    const matchesSearch = agreement.property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          agreement.tenant.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          agreement.agreementNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || agreement.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: agreements.length,
    active: agreements.filter(a => a.status === 'ACTIVE').length,
    pending: agreements.filter(a => a.status === 'PENDING_SIGNATURE').length,
    totalRent: agreements.reduce((sum, a) => sum + a.monthlyRent, 0),
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Rental Agreements</h1>
          <p className="text-gray-600 mt-1">Manage all your rental agreements</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Total Agreements</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Active</p>
                  <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Pending Signature</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Monthly Collection</p>
                  <p className="text-2xl font-bold text-blue-600">₹{formatCurrency(stats.totalRent)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by property, tenant, or agreement number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Agreements</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="PENDING_SIGNATURE">Pending Signature</SelectItem>
              <SelectItem value="EXPIRED">Expired</SelectItem>
              <SelectItem value="TERMINATED">Terminated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Agreements List */}
        {filteredAgreements.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No agreements found</p>
              {searchQuery && (
                <Button variant="link" onClick={() => setSearchQuery('')} className="mt-2">
                  Clear search
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredAgreements.map((agreement) => (
              <Card key={agreement.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left Section - Property Info */}
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {agreement.property.images[0] ? (
                          <img
                            src={agreement.property.images[0].imageUrl}
                            alt={agreement.property.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Home className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <Link href={`/landlord/agreements/${agreement.id}`}>
                          <h3 className="font-semibold text-lg hover:text-blue-600">
                            {agreement.property.title}
                          </h3>
                        </Link>
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {agreement.tenant.fullName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(agreement.startDate)} - {formatDate(agreement.endDate)}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            ₹{formatCurrency(agreement.monthlyRent)}/mo
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">#{agreement.agreementNumber}</p>
                      </div>
                    </div>

                    {/* Right Section - Status & Actions */}
                    <div className="flex items-center gap-3">
                      {getStatusBadge(agreement.status)}
                      <Link href={`/landlord/agreements/${agreement.id}`}>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Eye className="h-4 w-4" />
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}