'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { Calendar, Clock, MapPin, Eye, CheckCircle, XCircle, AlertCircle, Loader2, User, Phone, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getLandlordVisits, updateVisitStatus, Visit } from '@/lib/api/visits';


const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  COMPLETED: 'bg-gray-100 text-gray-700',
};

const statusIcons = {
  PENDING: AlertCircle,
  CONFIRMED: CheckCircle,
  CANCELLED: XCircle,
  COMPLETED: CheckCircle,
};

export default function LandlordVisitsPage() {
  const { getToken } = useAuth();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    loadVisits();
  }, [statusFilter]);

  const loadVisits = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      if (!token) throw new Error("not authorized");
      const filters = statusFilter !== 'ALL' ? { status: statusFilter } : {};
      const response:any = await getLandlordVisits(token, filters);
      setVisits(response.visits);
    } catch (error) {
      console.error('Failed to load visits:', error);
      toast.error('Failed to load visits');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (visitId: string, newStatus: string) => {
    setUpdating(visitId);
    try {
      const token = await getToken();
      if(!token) throw new Error("Unautharized")
      await updateVisitStatus(token, visitId, newStatus);
      toast.success('Visit status updated');
      loadVisits();
    } catch (error) {
      console.error('Failed to update visit status:', error);
      toast.error('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen  bg-gradient-to-b from-rose-50 to-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  const pendingVisits = visits.filter(v => v.status === 'PENDING');
  const confirmedVisits = visits.filter(v => v.status === 'CONFIRMED');
  const otherVisits = visits.filter(v => v.status !== 'PENDING' && v.status !== 'CONFIRMED');

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Visit Management</h1>
          <p className="text-gray-600 mt-1">Manage tenant visit requests for your properties</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Pending Requests</p>
                  <p className="text-2xl font-bold text-yellow-600">{pendingVisits.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Confirmed</p>
                  <p className="text-2xl font-bold text-green-600">{confirmedVisits.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Total Visits</p>
                  <p className="text-2xl font-bold">{visits.length}</p>
                </div>
                <Clock className="h-8 w-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <div className="flex items-center justify-between mb-6">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Visits</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-500">{visits.length} visits found</p>
        </div>

        {visits.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No visit requests found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {visits.map((visit) => {
              const StatusIcon = statusIcons[visit.status];
              return (
                <Card key={visit.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <User className="h-6 w-6 text-gray-500" />
                          </div>
                          <div className="flex-1">
                            <div>
                              <h3 className="font-semibold text-lg">{visit.tenant.fullName}</h3>
                              <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  {visit.tenant.email}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {visit.tenant.phone}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(visit.scheduledDate)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {visit.scheduledTime}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {visit.property.city}
                              </span>
                              <Link href={`/landlord/properties/${visit.propertyId}`} className="text-blue-600 hover:underline">
                                {visit.property.title}
                              </Link>
                            </div>
                            {visit.notes && (
                              <p className="text-gray-600 text-sm mt-2 bg-gray-50 p-2 rounded">
                                <span className="font-medium">Notes:</span> {visit.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {visit.status === 'PENDING' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate(visit.id, 'CONFIRMED')}
                              disabled={updating === visit.id}
                              className="gap-1"
                            >
                              <CheckCircle className="h-4 w-4" />
                              Confirm
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate(visit.id, 'CANCELLED')}
                              disabled={updating === visit.id}
                              className="gap-1 text-red-600"
                            >
                              <XCircle className="h-4 w-4" />
                              Cancel
                            </Button>
                          </div>
                        )}
                        {visit.status === 'CONFIRMED' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(visit.id, 'COMPLETED')}
                            disabled={updating === visit.id}
                            className="gap-1"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Mark Completed
                          </Button>
                        )}
                        <Badge className={statusColors[visit.status]}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {visit.status}
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