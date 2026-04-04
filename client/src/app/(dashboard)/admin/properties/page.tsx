'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  Home, 
  Search, 
  Eye, 
  CheckCircle, 
  XCircle,
  
  Loader2,
  MapPin,
  
  Power,
  PowerOff,
  Trash2,
 
} from 'lucide-react';
import { toast } from 'sonner';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  getAdminProperties,
  getAdminPropertyStats,
  updatePropertyStatus,
  deleteProperty,
  AdminProperty,
  AdminPropertyStats,
} from '@/lib/api/admin';

export default function PropertyManagementPage() {
  const { getToken } = useAuth();
  const [properties, setProperties] = useState<AdminProperty[]>([]);
  const [stats, setStats] = useState<AdminPropertyStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<AdminProperty | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    loadProperties();
    loadStats();
  }, [filterStatus, currentPage]);

  const loadProperties = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      if (!token) return;

      const filters: any = { page: currentPage, limit: 10 };
      if (filterStatus !== 'ALL') filters.status = filterStatus;
      if (searchQuery) filters.search = searchQuery;

      const response = await getAdminProperties(token, filters);
      setProperties(response.data);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Failed to load properties:', error);
      toast.error('Failed to load properties');
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const token = await getToken();
      if (!token) return;
      const statsData = await getAdminPropertyStats(token);
      // console.log(statsData)
      setStats({
        totalProperties: statsData.totalProperties,
        activeProperties: statsData.activeProperties,
        inactiveProperties: statsData.inactiveProperties,
        pending: 0,
        totalViews: statsData.totalViews,
        totalLeads: statsData.totalLeads,
      });
    
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleStatusToggle = async (property: AdminProperty) => {
    setIsActionLoading(true);
    try {
      const token = await getToken();
      if (!token) return;
      
      await updatePropertyStatus(token, property.id, !property.isActive);
      toast.success(`Property ${!property.isActive ? 'activated' : 'deactivated'} successfully`);
      loadProperties();
      loadStats();
    } catch (error) {
      console.error('Failed to update property status:', error);
      toast.error('Failed to update property status');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProperty) return;
    
    setIsActionLoading(true);
    try {
      const token = await getToken();
      if (!token) return;
      
      await deleteProperty(token, selectedProperty.id);
      toast.success('Property deleted successfully');
      setDeleteDialogOpen(false);
      setSelectedProperty(null);
      loadProperties();
      loadStats();
    } catch (error) {
      console.error('Failed to delete property:', error);
      toast.error('Failed to delete property');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadProperties();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN').format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return <Badge className="bg-green-100 text-green-700">Active</Badge>;
    }
    return <Badge className="bg-gray-100 text-gray-700">Inactive</Badge>;
  };

  const getBHKLabel = (bhk: string) => {
    const map: Record<string, string> = {
      ONE_BHK: '1 BHK',
      TWO_BHK: '2 BHK',
      THREE_BHK: '3 BHK',
      FOUR_BHK_PLUS: '4 BHK+',
    };
    return map[bhk] || bhk;
  };

 

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link 
            href="/admin" 
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-purple-600 mb-2 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Property Management
          </h1>
          <p className="text-gray-600 mt-1">Review and manage property listings</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Properties</p>
                  <p className="text-2xl font-bold">{stats?.totalProperties || 0}</p>
                </div>
                <Home className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active</p>
                  <p className="text-2xl font-bold text-green-600">{stats?.activeProperties || 0}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Inactive</p>
                  <p className="text-2xl font-bold text-gray-600">{stats?.inactiveProperties || 0}</p>
                </div>
                <XCircle className="h-8 w-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Views</p>
                  <p className="text-2xl font-bold text-purple-600">{stats?.totalViews || 0}</p>
                </div>
                <Eye className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by property title or landlord..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch} variant="secondary" className="gap-2">
            <Search className="h-4 w-4" />
            Search
          </Button>
          <Tabs value={filterStatus} onValueChange={setFilterStatus} className="w-full md:w-auto">
            <TabsList>
              <TabsTrigger value="ALL">All</TabsTrigger>
              <TabsTrigger value="ACTIVE">Active</TabsTrigger>
              <TabsTrigger value="INACTIVE">Inactive</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Properties Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-12">
                <Home className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No properties found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property</TableHead>
                      <TableHead>Landlord</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Listed</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {properties.map((property) => (
                      <TableRow key={property.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{property.title}</p>
                            <p className="text-sm text-gray-500">{getBHKLabel(property.bhk)}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{property.landlord.fullName}</p>
                            <p className="text-xs text-gray-500">{property.landlord.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          ₹{formatCurrency(property.rent)}/mo
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <MapPin className="h-3 w-3" />
                            {property.city}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(property.isActive)}</TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {formatDate(property.createdAt)}
                        </TableCell>
                        <TableCell className="text-sm">{property.views || 0}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Link href={`/properties/${property.id}`} target="_blank">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleStatusToggle(property)}
                              disabled={isActionLoading}
                            >
                              {property.isActive ? (
                                <PowerOff className="h-4 w-4 text-gray-500" />
                              ) : (
                                <Power className="h-4 w-4 text-green-600" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-600"
                              onClick={() => {
                                setSelectedProperty(property);
                                setDeleteDialogOpen(true);
                              }}
                              disabled={isActionLoading}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-4 border-t">
                <p className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1 || isLoading}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages || isLoading}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Property</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedProperty?.title}"? This action cannot be undone.
              All associated data including images, leads, and visits will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isActionLoading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isActionLoading}>
              {isActionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}