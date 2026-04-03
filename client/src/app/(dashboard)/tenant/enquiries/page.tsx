'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { MessageCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getMyLeads, Lead } from '@/lib/api/leads';
import { EnquiryCard } from '@/components/tenant/EnquiryCard';

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
      const response: any = await getMyLeads(token);
      setLeads(response.leads);
    } catch (error) {
      console.error('Failed to load enquiries:', error);
      toast.error('Failed to load enquiries');
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

  return (
    <div className="min-h-screen  bg-gradient-to-b from-rose-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            My Enquiries
          </h1>
          <p className="text-gray-500 mt-2">Track all your property inquiries and responses</p>
        </div>

        {leads.length === 0 ? (
          <Card className="text-center py-16 border-2 border-dashed border-gray-200">
            <CardContent>
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-10 w-10 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg mb-2">No enquiries yet</p>
              <p className="text-gray-400 text-sm mb-6">Start exploring properties and send your first enquiry!</p>
              <Link href="/properties/search">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Browse Properties
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {leads.map((lead) => (
              <EnquiryCard
                key={lead.id}
                id={lead.id}
                propertyId={lead.propertyId}
                propertyTitle={lead.property.title}
                propertyImage={lead.property.images[0]?.imageUrl}
                message={lead.message}
                contactMethod={lead.contactMethod}
                status={lead.status}
                createdAt={lead.createdAt}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}