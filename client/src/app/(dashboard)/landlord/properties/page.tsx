'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, Power, PowerOff, Loader2, ImageIcon, Home } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api/api-client';
import { useLandlordVerification } from '@/hooks/useLandlordVerification';

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

// Loading Skeleton Component
function PropertyCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-6 bg-gray-200 rounded w-1/3" />
        <div className="flex gap-2 mt-4">
          <div className="flex-1 h-9 bg-gray-200 rounded" />
          <div className="flex-1 h-9 bg-gray-200 rounded" />
          <div className="h-9 w-9 bg-gray-200 rounded" />
          <div className="h-9 w-9 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}

export default function PropertiesListPage() {
  const { getToken } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null); // Track which property is being acted upon
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null); // Track which property is being confirmed for deletion

  // Check landlord verification - redirects if not verified
  const { isVerified, isLoading: isVerificationLoading } = useLandlordVerification(true);
  useEffect(() => {
    if (isVerified === true) {
      loadProperties();
    }
  }, [isVerified]);
  // If not verified, don't render the page (hook will redirect)
  if (!isVerified) {
    return null;
  }



  const loadProperties = async () => {
    try {
      const token = await getToken();
      const response: any = await apiClient.get('/api/users/landlord/me', token);
      setProperties(response.data || []);
    } catch (error) {
      console.error('Failed to load properties:', error);
      toast.error('Failed to load properties');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePropertyStatus = async (propertyId: string, currentStatus: boolean) => {
    setActionLoading(propertyId);
    try {
      const token = await getToken();
      await apiClient.patch(`/api/properties/${propertyId}/toggle`, {}, token);
      
      // Update local state
      setProperties(prev =>
        prev.map(p =>
          p.id === propertyId ? { ...p, isActive: !currentStatus } : p
        )
      );
      
      toast.success(`Property ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Failed to toggle property:', error);
      toast.error('Failed to update property status');
    } finally {
      setActionLoading(null);
    }
  };

  const deleteProperty = async (propertyId: string) => {
    setActionLoading(propertyId);
    try {
      const token = await getToken();
      // First delete all its images
      await apiClient.delete(`/api/images/properties/${propertyId}/images`, token);
      // Then delete the property
      await apiClient.delete(`/api/properties/${propertyId}`, token);
      
      // Update local state
      setProperties(prev => prev.filter(p => p.id !== propertyId));
      toast.success('Property deleted successfully');
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete property:', error);
      toast.error('Failed to delete property');
    } finally {
      setActionLoading(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN').format(amount);
  };

  if (isLoading || isVerificationLoading) {
    return (
      <div className="min-h-screen  bg-gradient-to-b from-rose-50 to-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-64 bg-gray-200 rounded mt-2 animate-pulse" />
            </div>
            <div className="h-10 w-36 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">My Properties</h1>
            <p className="text-gray-600 mt-1">
              Manage your property listings ({properties.length} total)
            </p>
          </div>
          <Link href="/landlord/properties/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              List New Property
            </Button>
          </Link>
        </div>

        {/* Empty State */}
        {properties.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Home className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <p className="text-gray-500 mb-2">You haven't listed any properties yet</p>
                  <p className="text-sm text-gray-400">Start by listing your first property</p>
                </div>
                <Link href="/landlord/properties/new">
                  <Button>List Your First Property</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {properties.map((property) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Image Section */}
                  <div className="relative h-48 bg-gray-200">
                    {property.images?.length > 0 ? (
                      (() => {
                        const primaryImage = property.images.find(img => img.isPrimary) || property.images[0];
                        return (
                          <img
                            src={primaryImage.imageUrl}
                            alt={property.title}
                            className="w-full h-full object-cover"
                          />
                        );
                      })()
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                        <ImageIcon className="h-12 w-12 mb-2" />
                        <span className="text-sm">No Image</span>
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <Badge
                      className={`absolute top-2 right-2 ${property.isActive ? 'bg-green-500' : 'bg-gray-500'} border-0`}
                    >
                      {property.isActive ? 'Active' : 'Inactive'}
                    </Badge>

                    {/* Delete Confirmation Overlay */}
                    {deleteConfirm === property.id && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                        <div className="bg-white rounded-lg p-4 mx-4 text-center">
                          <p className="text-sm font-medium mb-3">Delete this property?</p>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setDeleteConfirm(null)}
                              disabled={actionLoading === property.id}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteProperty(property.id)}
                              disabled={actionLoading === property.id}
                            >
                              {actionLoading === property.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                'Delete'
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1 truncate">{property.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{property.city}</p>
                    <p className="text-blue-600 font-bold text-xl mb-3">
                      ₹{formatCurrency(property.rent)}
                      <span className="text-sm text-gray-500 font-normal">/month</span>
                    </p>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-4">
                      <Link href={`/landlord/properties/${property.id}`} className="flex-1">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full gap-1"
                          disabled={actionLoading === property.id}
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                      </Link>
                      
                      <Link href={`/landlord/properties/${property.id}/edit`} className="flex-1">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full gap-1"
                          disabled={actionLoading === property.id}
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                      </Link>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => togglePropertyStatus(property.id, property.isActive)}
                        disabled={actionLoading === property.id}
                        className="gap-1"
                      >
                        {actionLoading === property.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : property.isActive ? (
                          <PowerOff className="h-4 w-4" />
                        ) : (
                          <Power className="h-4 w-4" />
                        )}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteConfirm(property.id)}
                        disabled={actionLoading === property.id}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 gap-1"
                      >
                        {actionLoading === property.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}