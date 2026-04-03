'use client';

import Link from 'next/link';
import { Calendar, Clock, MapPin, Eye, CheckCircle, XCircle, AlertCircle, ChevronRight, Phone, Mail, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface VisitCardProps {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage?: string;
  propertyCity: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  notes?: string;
  landlordName?: string;
  landlordPhone?: string;
  landlordEmail?: string;
  className?: string;
  onViewProperty?: (propertyId: string) => void;
  onContactLandlord?: (phone: string) => void;
}

const statusConfig = {
  PENDING: { 
    label: 'Pending', 
    color: 'bg-yellow-500/10 text-yellow-600 border-yellow-200', 
    icon: AlertCircle,
    bgGradient: 'from-yellow-50/50'
  },
  CONFIRMED: { 
    label: 'Confirmed', 
    color: 'bg-green-500/10 text-green-600 border-green-200', 
    icon: CheckCircle,
    bgGradient: 'from-green-50/50'
  },
  CANCELLED: { 
    label: 'Cancelled', 
    color: 'bg-red-500/10 text-red-600 border-red-200', 
    icon: XCircle,
    bgGradient: 'from-red-50/50'
  },
  COMPLETED: { 
    label: 'Completed', 
    color: 'bg-gray-500/10 text-gray-600 border-gray-200', 
    icon: CheckCircle,
    bgGradient: 'from-gray-50/50'
  },
};

export function VisitCard({
  id,
  propertyId,
  propertyTitle,
  propertyImage,
  propertyCity,
  scheduledDate,
  scheduledTime,
  status,
  notes,
  landlordName,
  landlordPhone,
  landlordEmail,
  className,
  onViewProperty,
  onContactLandlord,
}: VisitCardProps) {
  const StatusIcon = statusConfig[status].icon;
  const statusInfo = statusConfig[status];

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  
  const isPast = status === 'COMPLETED' || status === 'CANCELLED';

  const handleViewProperty = () => {
    if (onViewProperty) {
      onViewProperty(propertyId);
    } else {
      window.location.href = `/properties/${propertyId}`;
    }
  };

  const handleContactLandlord = () => {
    if (landlordPhone && onContactLandlord) {
      onContactLandlord(landlordPhone);
    } else if (landlordPhone) {
      window.location.href = `tel:${landlordPhone}`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn(
        "overflow-hidden hover:shadow-lg transition-all duration-300 border pt-0 pb-0",
        isPast && "opacity-80",
        className
      )}>
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            {/* Image Section */}
            <div className={cn(
              "md:w-32 h-36 bg-gradient-to-br relative overflow-hidden",
              statusInfo.bgGradient 
            )}>
              {propertyImage ? (
                <img
                  src={propertyImage}
                  alt={propertyTitle}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Calendar className="h-8 w-8" />
                </div>
              )}
              {/* Status Badge on Image */}
              <div className="absolute top-2 left-2">
                <Badge className={cn("border text-xs font-medium", statusInfo.color)}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {statusInfo.label}
                </Badge>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 p-4">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                <div className="flex-1">
                  <Link href={`/properties/${propertyId}`}>
                    <h3 className="font-semibold text-lg hover:text-blue-600 transition-colors line-clamp-1">
                      {propertyTitle}
                    </h3>
                  </Link>
                  
                  {/* Date and Time */}
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 rounded-full">
                      <Calendar className="h-3.5 w-3.5 text-blue-600" />
                      <span className="text-xs font-medium text-blue-700">{formatDate(scheduledDate)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-purple-50 rounded-full">
                      <Clock className="h-3.5 w-3.5 text-purple-600" />
                      <span className="text-xs font-medium text-purple-700">{scheduledTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <MapPin className="h-3.5 w-3.5" />
                      <span className="text-xs">{propertyCity}</span>
                    </div>
                  </div>
                  
                  {/* Notes */}
                  {notes && (
                    <p className="text-gray-600 mt-3 text-sm bg-gray-50 p-2 rounded-lg italic">
                      "📝 {notes}"
                    </p>
                  )}

                  {/* Landlord Info (for confirmed visits) */}
                  {status === 'CONFIRMED' && landlordName && (
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {landlordName}
                      </span>
                      {landlordPhone && (
                        <button
                          onClick={handleContactLandlord}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <Phone className="h-3 w-3" />
                          Contact
                        </button>
                      )}
                      {landlordEmail && (
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {landlordEmail}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleViewProperty}
                    variant="outline"
                    size="sm"
                    className="gap-1 rounded-full"
                  >
                    <Eye className="h-4 w-4" />
                    <span className="hidden sm:inline">View</span>
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}