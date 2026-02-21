'use client';

import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { IndianRupee, Info } from 'lucide-react';

interface BrokerageBadgeProps {
  fee: number;
  rent: number;
}

export function BrokerageBadge({ fee, rent }: BrokerageBadgeProps) {
  const calculateBrokerage = () => {
    const months = fee / rent;
    if (months < 0.5) return 'Less than 15 days rent';
    if (months === 0.5) return '15 days rent';
    if (months === 1) return '1 month rent';
    return `${months.toFixed(1)} months rent`;
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="secondary" className="cursor-help">
            <IndianRupee className="h-3 w-3 mr-1" />
            Broker: ₹{fee.toLocaleString()}
            <Info className="h-3 w-3 ml-1" />
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>Brokerage fee: {calculateBrokerage()}</p>
          <p className="text-xs text-muted-foreground">Monthly rent: ₹{rent.toLocaleString()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}