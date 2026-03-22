'use client';

import { CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VerificationStatusProps {
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  documentType: string;
  rejectionReason?: string;
  onRetry?: () => void;
}

export function VerificationStatus({ 
  status, 
  documentType, 
  rejectionReason,
  onRetry 
}: VerificationStatusProps) {
  const statusConfig = {
    PENDING: {
      icon: Clock,
      title: 'Verification Pending',
      description: `Your ${documentType} is being reviewed by our team. This usually takes 24-48 hours.`,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      iconBg: 'bg-yellow-100',
      button: null
    },
    APPROVED: {
      icon: CheckCircle,
      title: 'Verified',
      description: `Your ${documentType} has been verified successfully. You now have full access to all features.`,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconBg: 'bg-green-100',
      button: null
    },
    REJECTED: {
      icon: XCircle,
      title: 'Verification Failed',
      description: `Your ${documentType} was rejected. Please upload a clear image of your document.`,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconBg: 'bg-red-100',
      button: onRetry ? (
        <Button 
          onClick={onRetry} 
          variant="outline" 
          size="sm"
          className="mt-3"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Re-upload Document
        </Button>
      ) : null
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Card className={cn("border", config.borderColor)}>
      <CardContent className={cn("p-4", config.bgColor)}>
        <div className="flex items-start gap-3">
          <div className={cn("p-2 rounded-full", config.iconBg)}>
            <Icon className={cn("h-5 w-5", config.color)} />
          </div>
          <div className="flex-1">
            <h4 className={cn("font-semibold", config.color)}>{config.title}</h4>
            <p className="text-sm text-gray-600 mt-1">{config.description}</p>
            {status === 'REJECTED' && rejectionReason && (
              <div className="mt-2 p-2 bg-red-100 rounded text-sm text-red-700">
                <span className="font-medium">Reason: </span>
                {rejectionReason}
              </div>
            )}
            {config.button}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}