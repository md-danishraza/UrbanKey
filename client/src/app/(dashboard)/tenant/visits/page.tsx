'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { Badge, Calendar, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getMyVisits, Visit } from '@/lib/api/visits';
import { VisitCard } from '@/components/tenant/VisitCard';

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
      if (!token) throw new Error("not authorized");
      const response: any = await getMyVisits(token);
      setVisits(response.visits);
    } catch (error) {
      console.error('Failed to load visits:', error);
      toast.error('Failed to load visits');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  const upcomingVisits = visits.filter(v => v.status === 'PENDING' || v.status === 'CONFIRMED');
  const pastVisits = visits.filter(v => v.status === 'COMPLETED' || v.status === 'CANCELLED');

  return (
    <div className="min-h-screen  bg-gradient-to-b from-rose-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            My Visits
          </h1>
          <p className="text-gray-500 mt-2">Manage your property visit schedules</p>
        </div>

        {visits.length === 0 ? (
          <Card className="text-center py-16 border-2 border-dashed border-gray-200">
            <CardContent>
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-10 w-10 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg mb-2">No visits scheduled yet</p>
              <p className="text-gray-400 text-sm mb-6">Browse properties and schedule your first visit!</p>
              <Link href="/properties/search">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Browse Properties
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Upcoming Visits Section */}
            {upcomingVisits.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-green-500 rounded-full" />
                  <h2 className="text-xl font-semibold text-gray-800">Upcoming Visits</h2>
                  <Badge className="bg-green-100 text-green-700 ml-2">
                    {upcomingVisits.length} upcoming
                  </Badge>
                </div>
                <div className="space-y-4">
                  {upcomingVisits.map((visit) => (
                    <VisitCard
                      key={visit.id}
                      id={visit.id}
                      propertyId={visit.propertyId}
                      propertyTitle={visit.property.title}
                      propertyImage={visit.property.images[0]?.imageUrl}
                      propertyCity={visit.property.city}
                      scheduledDate={visit.scheduledDate}
                      scheduledTime={visit.scheduledTime}
                      status={visit.status}
                      notes={visit.notes}
                      // landlordName={visit.property.landlord?.fullName}
                      // landlordPhone={visit.property.landlord?.phone}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Past Visits Section */}
            {pastVisits.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-gray-400 rounded-full" />
                  <h2 className="text-xl font-semibold text-gray-800">Past Visits</h2>
                  <Badge className="bg-gray-100 text-gray-700 ml-2">
                    {pastVisits.length} past
                  </Badge>
                </div>
                <div className="space-y-4">
                  {pastVisits.map((visit) => (
                    <VisitCard
                      key={visit.id}
                      id={visit.id}
                      propertyId={visit.propertyId}
                      propertyTitle={visit.property.title}
                      propertyImage={visit.property.images[0]?.imageUrl}
                      propertyCity={visit.property.city}
                      scheduledDate={visit.scheduledDate}
                      scheduledTime={visit.scheduledTime}
                      status={visit.status}
                      notes={visit.notes}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}