'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Edit, Trash2, Power, PowerOff, Loader2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface PropertyActionsProps {
  propertyId: string;
  isActive: boolean;
  token: string | null;
  onStatusChange?: () => void;
  onDelete?: () => void;
  className?: string;
}

export function PropertyActions({ 
  propertyId, 
  isActive, 
  token, 
  onStatusChange, 
  onDelete,
  className 
}: PropertyActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const toggleStatus = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/properties/${propertyId}/toggle`,
        { 
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success(`Property ${!isActive ? 'activated' : 'deactivated'}`);
        onStatusChange?.();
      } else {
        toast.error(data.error || 'Failed to update status');
      }
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProperty = async () => {
    setIsLoading(true);
    try {
      // First delete images
      await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/images/properties/${propertyId}/images`,
        { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }
      );
      // Then delete property
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/properties/${propertyId}`,
        { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.ok) {
        toast.success('Property deleted successfully');
        onDelete?.();
        router.push('/landlord/properties');
      } else {
        toast.error('Failed to delete property');
      }
    } catch (error) {
      toast.error('Failed to delete property');
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Badge className={cn(isActive ? 'bg-green-500' : 'bg-gray-500')}>
              {isActive ? 'Active' : 'Inactive'}
            </Badge>
            {isLoading && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
          </div>
          <div className="flex gap-2">
            <Link href={`/landlord/properties/${propertyId}/edit`}>
              <Button variant="outline" size="sm" className="gap-1">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleStatus}
              disabled={isLoading}
              className="gap-1"
            >
              {isActive ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
              {isActive ? 'Deactivate' : 'Activate'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isLoading}
              className="text-red-500 hover:text-red-600 gap-1"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
            <p className="text-sm text-red-800 mb-3">
              Are you sure you want to delete this property? This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={deleteProperty}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}