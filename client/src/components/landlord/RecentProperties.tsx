'use client';


import Link from 'next/link';
import { Eye, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Property {
  id: string;
  title: string;
  rent: number;
  bhk: string;
  city: string;
  isActive: boolean;
  images: { imageUrl: string; isPrimary: boolean }[];
  views?: number;
  leads?: number;
}

interface RecentPropertiesProps {
  properties: Property[];
  isLoading?: boolean;
  limit?: number;
  className?: string;
}

export function RecentProperties({ properties, isLoading, limit = 4, className }: RecentPropertiesProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN').format(amount);
  };

  const getPrimaryImage = (images: any[]) => {
    const primary = images?.find(img => img.isPrimary);
    return primary?.imageUrl || images?.[0]?.imageUrl;
  };

  const recentProperties = properties.slice(0, limit);

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg">Recent Properties</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-16 h-16 bg-gray-200 rounded-lg" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (recentProperties.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg">Recent Properties</CardTitle>
        </CardHeader>
        <CardContent className="py-8 text-center">
          <p className="text-gray-500">No properties listed yet</p>
          <Link href="/landlord/properties/new">
            <Button variant="link" className="mt-2">List your first property</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Recent Properties</CardTitle>
        <Link href="/landlord/properties">
          <Button variant="ghost" size="sm" className="gap-1">
            View All
            <Eye className="h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentProperties.map((property) => (
          <div key={property.id} className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              {getPrimaryImage(property.images) ? (
                <img
                  src={getPrimaryImage(property.images)}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                  No Image
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-gray-900 truncate">{property.title}</p>
                <Badge className={cn(property.isActive ? 'bg-green-500' : 'bg-gray-500')}>
                  {property.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <p className="text-sm text-gray-500">{property.city}</p>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-sm font-semibold text-blue-600">
                  ₹{formatCurrency(property.rent)}<span className="text-xs text-gray-400">/mo</span>
                </p>
                {property.views !== undefined && (
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {property.views} views
                  </p>
                )}
                {property.leads !== undefined && (
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    📧 {property.leads} leads
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex gap-1">
              <Link href={`/landlord/properties/${property.id}`}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
              <Link href={`/landlord/properties/${property.id}/edit`}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Edit className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}