'use client';

import { Badge } from '@/components/ui/badge';
import { Droplet, Zap, Flame } from 'lucide-react';

interface WaterBackupTagsProps {
  property: {
    has_water_247: boolean;
    has_power_backup: boolean;
    has_igl_pipeline: boolean;
  };
  className?: string;
}

export function WaterBackupTags({ property, className = '' }: WaterBackupTagsProps) {
  const tags = [];

  if (property.has_water_247) {
    tags.push({
      label: '24/7 Water',
      icon: Droplet,
      color: 'bg-blue-100 text-blue-800 hover:bg-blue-200'
    });
  }

  if (property.has_power_backup) {
    tags.push({
      label: 'Power Backup',
      icon: Zap,
      color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
    });
  }

  if (property.has_igl_pipeline) {
    tags.push({
      label: 'IGL Pipeline',
      icon: Flame,
      color: 'bg-orange-100 text-orange-800 hover:bg-orange-200'
    });
  }

  if (tags.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag) => {
        const Icon = tag.icon;
        return (
          <Badge key={tag.label} variant="outline" className={tag.color}>
            <Icon className="h-3 w-3 mr-1" />
            {tag.label}
          </Badge>
        );
      })}
    </div>
  );
}