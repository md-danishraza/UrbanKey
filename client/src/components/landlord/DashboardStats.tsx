'use client';

import { Eye, MessageCircle, Calendar, TrendingUp, Building2, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DashboardStatsProps {
  stats: {
    totalProperties: number;
    activeProperties: number;
    totalViews: number;
    totalLeads: number;
    totalVisits: number;
    totalAgreements: number;
  };
  isLoading?: boolean;
  className?: string;
}

const StatCard = ({ title, value, icon: Icon, color, trend, subtitle }: any) => (
  <Card className="overflow-hidden hover:shadow-md transition-shadow">
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value?.toLocaleString() || 0}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className={cn("p-2 rounded-lg", `bg-${color}-50`)}>
          <Icon className={cn("h-5 w-5", `text-${color}-600`)} />
        </div>
      </div>
      {trend !== undefined && (
        <div className="mt-2 flex items-center gap-1">
          <TrendingUp className="h-3 w-3 text-green-500" />
          <span className="text-xs text-green-600">+{trend}% from last month</span>
        </div>
      )}
    </CardContent>
  </Card>
);

export function DashboardStats({ stats, isLoading, className }: DashboardStatsProps) {
  if (isLoading) {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", className)}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="h-16 bg-gray-200 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", className)}>
      <StatCard
        title="Total Properties"
        value={stats.totalProperties}
        icon={Building2}
        color="blue"
        subtitle={`${stats.activeProperties} active`}
      />
      <StatCard
        title="Total Views"
        value={stats.totalViews}
        icon={Eye}
        color="green"
        trend={12}
      />
      <StatCard
        title="Leads Received"
        value={stats.totalLeads}
        icon={MessageCircle}
        color="yellow"
        trend={8}
      />
      <StatCard
        title="Scheduled Visits"
        value={stats.totalVisits}
        icon={Calendar}
        color="purple"
      />
      <StatCard
        title="Rent Agreements"
        value={stats.totalAgreements}
        icon={FileText}
        color="orange"
      />
      <StatCard
        title="Total Revenue"
        value={`₹${(stats.totalProperties * 25000).toLocaleString()}`}
        icon={TrendingUp}
        color="red"
        subtitle="This month"
      />
    </div>
  );
}