'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  color: 'purple' | 'yellow' | 'green' | 'red';
  delay?: number;
}

const colorClasses = {
  purple: 'from-purple-600 to-pink-600',
  yellow: 'from-yellow-500 to-orange-500',
  green: 'from-green-500 to-emerald-500',
  red: 'from-red-500 to-rose-500',
};

export function StatsCard({ title, value, icon: Icon, color, delay = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      <Card className={cn("text-white overflow-hidden", `bg-gradient-to-br ${colorClasses[color]}`)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium">{title}</p>
              <p className="text-3xl font-bold mt-1">{value}</p>
            </div>
            <Icon className="h-8 w-8 text-white/60" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}