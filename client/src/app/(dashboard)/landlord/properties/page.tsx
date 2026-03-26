'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, Power, PowerOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api/api-client';

interface Property {
  id: string;
  title: string;
  rent: number;
  bhk: string;
  city: string;
  isActive: boolean;
  images: { imageUrl: string; isPrimary: boolean }[];
  createdAt: string;
}

export default function PropertiesListPage() {
  const { getToken } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const token = await getToken();
      const response:any = await apiClient.get('/api/properties?landlord=me', token);
      setProperties(response.data || []);
    } catch (error) {
      console.error('Failed to load properties:', error);
      toast.error('Failed to load properties');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePropertyStatus = async (propertyId: string, currentStatus: boolean) => {
    try {
      const token = await getToken();
      await apiClient.patch(`/api/properties/${propertyId}/toggle`, {}, token);
      setProperties(prev =>
        prev.map(p =>
          p.id === propertyId ? { ...p, isActive: !currentStatus } : p
        )
      );
      toast.success(`Property ${!currentStatus ? 'activated' : 'deactivated'}`);
    } catch (error) {
      console.error('Failed to toggle property:', error);
      toast.error('Failed to update property status');
    }
  };

  const deleteProperty = async (propertyId: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;
    
    try {
      const token = await getToken();
      await apiClient.delete(`/api/properties/${propertyId}`, token);
      setProperties(prev => prev.filter(p => p.id !== propertyId));
      toast.success('Property deleted successfully');
    } catch (error) {
      console.error('Failed to delete property:', error);
      toast.error('Failed to delete property');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN').format(amount);
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
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">My Properties</h1>
            <p className="text-gray-600 mt-1">Manage your property listings</p>
          </div>
          <Link href="/landlord/properties/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              List New Property
            </Button>
          </Link>
        </div>

        {properties.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-gray-500 mb-4">You haven't listed any properties yet</p>
              <Link href="/landlord/properties/new">
                <Button>List Your First Property</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative h-48 bg-gray-200">
                  {property.images?.[0] ? (
                    <img
                      src={property.images[0].imageUrl}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  <Badge
                    className={`absolute top-2 right-2 ${property.isActive ? 'bg-green-500' : 'bg-gray-500'}`}
                  >
                    {property.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1 truncate">{property.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{property.city}</p>
                  <p className="text-blue-600 font-bold text-xl mb-3">
                    ₹{formatCurrency(property.rent)}<span className="text-sm text-gray-500">/month</span>
                  </p>
                  
                  <div className="flex gap-2 mt-4">
                    <Link href={`/landlord/properties/${property.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full gap-1">
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                    </Link>
                    <Link href={`/landlord/properties/${property.id}/edit`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full gap-1">
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePropertyStatus(property.id, property.isActive)}
                      className="gap-1"
                    >
                      {property.isActive ? (
                        <PowerOff className="h-4 w-4" />
                      ) : (
                        <Power className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteProperty(property.id)}
                      className="text-red-500 hover:text-red-600 gap-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}