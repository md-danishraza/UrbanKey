'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { Calendar, Clock, MapPin, Eye, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getMyVisits,Visit } from '@/lib/api/visits';

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

export default function TenantVisitsPage() {
  const { getToken } = useAuth();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadVisits();
  }, []);

  const loadVisits = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      const response = await getMyVisits(token);
      setVisits(response.visits);
    } catch (error) {
      console.error('Failed to load visits:', error);
      toast.error('Failed to load visits');
    } finally {
      setIsLoading(false);
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  const upcomingVisits = visits.filter(v => v.status === 'PENDING' || v.status === 'CONFIRMED');
  const pastVisits = visits.filter(v => v.status === 'COMPLETED' || v.status === 'CANCELLED');

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">My Visits</h1>
          <p className="text-gray-600 mt-1">Manage your property visit schedules</p>
        </div>

        {visits.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-2">No visits scheduled yet</p>
              <Link href="/properties/search">
                <Button>Browse Properties</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Upcoming Visits */}
            {upcomingVisits.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3">Upcoming Visits</h2>
                <div className="space-y-4">
                  {upcomingVisits.map((visit) => {
                    const StatusIcon = statusIcons[visit.status];
                    return (
                      <Card key={visit.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex flex-col md:flex-row md:items-start gap-4">
                            <div className="flex-1">
                              <div className="flex items-start gap-3">
                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                  {visit.property.images[0] ? (
                                    <img
                                      src={visit.property.images[0].imageUrl}
                                      alt={visit.property.title}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                      No Image
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <Link href={`/properties/${visit.propertyId}`}>
                                    <h3 className="font-semibold text-lg hover:text-blue-600">
                                      {visit.property.title}
                                    </h3>
                                  </Link>
                                  <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500">
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
                                  </div>
                                  {visit.notes && (
                                    <p className="text-gray-600 text-sm mt-2">{visit.notes}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={statusColors[visit.status]}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {visit.status}
                              </Badge>
                              <Link href={`/properties/${visit.propertyId}`}>
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
              </div>
            )}

            {/* Past Visits */}
            {pastVisits.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3">Past Visits</h2>
                <div className="space-y-4">
                  {pastVisits.map((visit) => {
                    const StatusIcon = statusIcons[visit.status];
                    return (
                      <Card key={visit.id} className="hover:shadow-md transition-shadow opacity-80">
                        <CardContent className="p-4">
                          <div className="flex flex-col md:flex-row md:items-start gap-4">
                            <div className="flex-1">
                              <div className="flex items-start gap-3">
                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                  {visit.property.images[0] ? (
                                    <img
                                      src={visit.property.images[0].imageUrl}
                                      alt={visit.property.title}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                      No Image
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <Link href={`/properties/${visit.propertyId}`}>
                                    <h3 className="font-semibold text-lg hover:text-blue-600">
                                      {visit.property.title}
                                    </h3>
                                  </Link>
                                  <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500">
                                    <span className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      {formatDate(visit.scheduledDate)}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {visit.scheduledTime}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
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
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}