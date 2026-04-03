'use client';

import Link from 'next/link';
import { MessageCircle, Phone, Mail, Clock, Eye, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface EnquiryCardProps {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage?: string;
  message: string;
  contactMethod: 'WHATSAPP' | 'PHONE' | 'EMAIL';
  status: 'NEW' | 'CONTACTED' | 'CONVERTED' | 'CLOSED';
  createdAt: string;
  className?: string;
  onViewProperty?: (propertyId: string) => void;
}

const statusConfig = {
  NEW: { label: 'New', color: 'bg-yellow-500/10 text-yellow-600 border-yellow-200', icon: '🆕' },
  CONTACTED: { label: 'Contacted', color: 'bg-blue-500/10 text-blue-600 border-blue-200', icon: '📞' },
  CONVERTED: { label: 'Converted', color: 'bg-green-500/10 text-green-600 border-green-200', icon: '✅' },
  CLOSED: { label: 'Closed', color: 'bg-gray-500/10 text-gray-600 border-gray-200', icon: '🔒' },
};

const contactMethodConfig = {
  WHATSAPP: { icon: MessageCircle, label: 'WhatsApp', color: 'text-green-600' },
  PHONE: { icon: Phone, label: 'Phone', color: 'text-blue-600' },
  EMAIL: { icon: Mail, label: 'Email', color: 'text-red-600' },
};

export function EnquiryCard({
  id,
  propertyId,
  propertyTitle,
  propertyImage,
  message,
  contactMethod,
  status,
  createdAt,
  className,
  onViewProperty,
}: EnquiryCardProps) {
  const ContactIcon = contactMethodConfig[contactMethod].icon;
  const statusInfo = statusConfig[status];
  
  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const handleViewProperty = () => {
    if (onViewProperty) {
      onViewProperty(propertyId);
    } else {
      window.location.href = `/properties/${propertyId}`;
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
      <Card className={cn("overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 pt-0 pb-0", className)}>
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            {/* Image Section */}
            <div className="md:w-32 h-36 bg-gray-100 relative overflow-hidden">
              {propertyImage ? (
                <img
                  src={propertyImage}
                  alt={propertyTitle}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <MessageCircle className="h-8 w-8" />
                </div>
              )}
              {/* Status Badge on Image */}
              <div className="absolute top-2 left-2">
                <Badge className={cn("border text-xs font-medium", statusInfo.color)}>
                  <span className="mr-1">{statusInfo.icon}</span>
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
                  
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <ContactIcon className={cn("h-3.5 w-3.5", contactMethodConfig[contactMethod].color)} />
                      {contactMethodConfig[contactMethod].label}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-gray-400" />
                      {formatDate(createdAt)}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 mt-3 text-sm leading-relaxed line-clamp-2 bg-gray-50 p-2 rounded-lg">
                    "{message}"
                  </p>
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