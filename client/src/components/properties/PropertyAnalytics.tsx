'use client';

import { useState, useEffect } from 'react';
import { Eye, MessageCircle, Calendar, TrendingUp, Loader2, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

interface AnalyticsData {
  totalViews: number;
  totalLeads: number;
  totalVisits: number;
  dailyViews: Array<{ date: string; count: number }>;
}

interface PropertyAnalyticsProps {
  propertyId: string;
  token: string | null;
  className?: string;
}

// Custom tooltip for the chart
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="text-sm font-medium text-gray-900">
          {new Date(label).toLocaleDateString('en-IN', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
        <p className="text-lg font-bold text-blue-600 mt-1">
          {payload[0].value} views
        </p>
      </div>
    );
  }
  return null;
};

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, color, trend, previousValue }: any) => {
  const trendIcon = trend > 0 ? <TrendingUp className="h-3 w-3" /> : trend < 0 ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />;
  const trendColor = trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-500';

  return (
    <div className="relative overflow-hidden rounded-xl bg-white p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-${color}-50`}>
            <Icon className={`h-5 w-5 text-${color}-600`} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value.toLocaleString()}</p>
          </div>
        </div>
        {previousValue !== undefined && (
          <div className={`flex items-center gap-1 text-xs ${trendColor}`}>
            {trendIcon}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      {previousValue !== undefined && (
        <p className="text-xs text-gray-500 mt-2">vs previous period</p>
      )}
    </div>
  );
};

export function PropertyAnalytics({ propertyId, token, className }: PropertyAnalyticsProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'line' | 'area' | 'bar'>('area');

  useEffect(() => {
    if (!propertyId || !token) return;
    loadAnalytics();
  }, [propertyId, token]);

  const loadAnalytics = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/properties/${propertyId}/analytics`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();
      if (data.success) {
        // Sort daily views by date ascending for proper chart display
        const sortedDailyViews = [...(data.analytics.dailyViews || [])].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        setAnalytics({ ...data.analytics, dailyViews: sortedDailyViews });
      } else {
        setError('Failed to load analytics');
      }
    } catch (err) {
      setError('Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate trends (compare last 7 days with previous 7 days)
  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  // Get previous period data for trends
  const getPreviousPeriodTotal = () => {
    if (!analytics?.dailyViews || analytics.dailyViews.length < 7) return undefined;
    const previousPeriod = analytics.dailyViews.slice(7, 14);
    return previousPeriod.reduce((sum, day) => sum + day.count, 0);
  };

  const currentTotal = analytics?.totalViews || 0;
  const previousTotal = getPreviousPeriodTotal();
  const trend = previousTotal !== undefined ? calculateTrend(currentTotal, previousTotal) : undefined;

  // Format chart data for better display
  const chartData = analytics?.dailyViews.map(day => ({
    date: day.date,
    views: day.count,
    formattedDate: new Date(day.date).toLocaleDateString('en-IN', { weekday: 'short' }),
    fullDate: new Date(day.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
  })) || [];

  // Calculate max value for chart domain
  const maxViews = Math.max(...chartData.map(d => d.views), 1);

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-500">Loading analytics...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !analytics) {
    return (
      <Card className={className}>
        <CardContent className="py-12 text-center">
          <div className="text-gray-400 mb-3">
            <TrendingUp className="h-12 w-12 mx-auto" />
          </div>
          <p className="text-gray-500">{error || 'No analytics data available'}</p>
          <p className="text-xs text-gray-400 mt-1">Views will appear once property is viewed</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Property Analytics
          </CardTitle>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 text-sm font-medium ${
              trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-500'
            }`}>
              {trend > 0 ? <TrendingUp className="h-4 w-4" /> : trend < 0 ? <TrendingDown className="h-4 w-4" /> : null}
              {trend !== 0 && `${Math.abs(trend)}%`}
              {trend !== 0 && <span className="text-gray-400 text-xs">vs last week</span>}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StatCard
            title="Total Views"
            value={analytics.totalViews}
            icon={Eye}
            color="blue"
            trend={trend}
            previousValue={previousTotal}
          />
          <StatCard
            title="Total Leads"
            value={analytics.totalLeads}
            icon={MessageCircle}
            color="green"
          />
          <StatCard
            title="Scheduled Visits"
            value={analytics.totalVisits}
            icon={Calendar}
            color="purple"
          />
        </div>

        {/* Chart Section */}
        {chartData.length > 0 && (
          <div className="pt-2">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-gray-700">Views Trend (Last 7 Days)</p>
              <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setChartType('area')}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    chartType === 'area' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Area
                </button>
                <button
                  onClick={() => setChartType('line')}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    chartType === 'line' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Line
                </button>
                <button
                  onClick={() => setChartType('bar')}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    chartType === 'bar' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Bar
                </button>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'area' && (
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="fullDate" 
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      axisLine={false}
                      tickLine={false}
                      domain={[0, maxViews]}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="views" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      fill="url(#colorViews)" 
                    />
                  </AreaChart>
                )}

                {chartType === 'line' && (
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="fullDate" 
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      axisLine={false}
                      tickLine={false}
                      domain={[0, maxViews]}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="views" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                )}

                {chartType === 'bar' && (
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="fullDate" 
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      axisLine={false}
                      tickLine={false}
                      domain={[0, maxViews]}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="views" 
                      fill="#3b82f6" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Summary Stats */}
            {chartData.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Peak Day</p>
                  <p className="text-sm font-semibold text-gray-700">
                    {chartData.reduce((max, day) => day.views > max.views ? day : max, chartData[0])?.fullDate}
                  </p>
                </div>
                <div className="p-2 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Highest Views</p>
                  <p className="text-sm font-semibold text-gray-700">
                    {Math.max(...chartData.map(d => d.views))} views
                  </p>
                </div>
                <div className="p-2 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Daily Average</p>
                  <p className="text-sm font-semibold text-gray-700">
                    {Math.round(chartData.reduce((sum, d) => sum + d.views, 0) / chartData.length)} views
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {chartData.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <TrendingUp className="h-12 w-12 mx-auto" />
            </div>
            <p className="text-gray-500">No view data available yet</p>
            <p className="text-xs text-gray-400 mt-1">Views will appear once property is viewed by tenants</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}