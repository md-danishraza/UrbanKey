'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Users, 
  Building2, 
  FileText, 
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  ChevronRight,
  UserCheck,
  Home,
  FileSearch,
  Brain,
  BarChart3,
  Activity,
  Loader2
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { getVerificationStats, getPendingVerifications, VerificationStats } from '@/lib/api/admin';
import { apiClient } from '@/lib/api/api-client';
import { toast } from 'sonner';

// Quick stats card component
const StatCard = ({ title, value, icon: Icon, color, trend, delay = 0, isLoading }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.3 }}
    className="relative overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold mt-2">
          {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-gray-400" /> : value}
        </p>
        {trend && (
          <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            +{trend} from last week
          </p>
        )}
      </div>
      <div className={`h-12 w-12 rounded-full bg-${color}-100 flex items-center justify-center`}>
        <Icon className={`h-6 w-6 text-${color}-600`} />
      </div>
    </div>
    <div className={`absolute bottom-0 left-0 h-1 bg-${color}-500`} style={{ width: `${Math.min((value / 1000) * 100, 100)}%` }} />
  </motion.div>
);

// Navigation card component
const NavCard = ({ title, description, icon: Icon, href, color, badge }: any) => (
  <Link href={href}>
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="relative overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className={`h-12 w-12 rounded-lg bg-${color}-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
            <Icon className={`h-6 w-6 text-${color}-600`} />
          </div>
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
          {badge && (
            <Badge className="mt-3 bg-yellow-100 text-yellow-700 hover:bg-yellow-200">
              {badge}
            </Badge>
          )}
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
      </div>
    </motion.div>
  </Link>
);

// Platform Stats interface
interface PlatformStats {
  totalUsers: number;
  totalLandlords: number;
  totalTenants: number;
  totalProperties: number;
  activeProperties: number;
  monthlyActiveUsers: number;
}

export default function AdminDashboard() {
  const { getToken } = useAuth();
  const [stats, setStats] = useState<VerificationStats | null>(null);
  const [platformStats, setPlatformStats] = useState<PlatformStats>({
    totalUsers: 0,
    totalLandlords: 0,
    totalTenants: 0,
    totalProperties: 0,
    activeProperties: 0,
    monthlyActiveUsers: 0,
  });
  const [pendingCount, setPendingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      if (!token) return;

      // Fetch verification stats
      const statsResponse = await getVerificationStats(token);
      if (statsResponse.success) {
        setStats(statsResponse.stats);
      }

      // Fetch pending verifications
      const pendingResponse = await getPendingVerifications(token);
      if (pendingResponse.success) {
        setPendingCount(pendingResponse.documents.length);
        setRecentActivity(pendingResponse.documents.slice(0, 5));
      }

      // Fetch platform stats from API
      await loadPlatformStats(token);
      
    } catch (error) {
      console.error('Failed to load dashboard:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const loadPlatformStats = async (token: string) => {
    try {
      // Fetch total users
      const usersResponse:any = await apiClient.get('/api/admin/dashboard/users/stats', token);
      if (usersResponse.success) {
        setPlatformStats(prev => ({
          ...prev,
          totalUsers: usersResponse.totalUsers || 0,
          totalLandlords: usersResponse.totalLandlords || 0,
          totalTenants: usersResponse.totalTenants || 0,
        }));
      }

      // Fetch properties stats
      const propertiesResponse:any = await apiClient.get('/api/admin/dashboard/properties/stats', token);
      if (propertiesResponse.success) {
        setPlatformStats(prev => ({
          ...prev,
          totalProperties: propertiesResponse.totalProperties || 0,
          activeProperties: propertiesResponse.activeProperties || 0,
        }));
      }

      // Fetch monthly active users
      const monthlyResponse:any = await apiClient.get('/api/admin/analytics/monthly-active', token);
      if (monthlyResponse.success) {
        setPlatformStats(prev => ({
          ...prev,
          monthlyActiveUsers: monthlyResponse.count || 0,
        }));
      }
    } catch (error) {
      console.error('Failed to load platform stats:', error);
      // Use fallback mock data
      setPlatformStats({
        totalUsers: 1250,
        totalLandlords: 350,
        totalTenants: 900,
        totalProperties: 480,
        activeProperties: 320,
        monthlyActiveUsers: 680,
      });
    }
  };

  // Calculate verification rate
  const totalDocs = stats?.total || 0;
  const approvedDocs = stats?.approved || 0;
  const verificationRate = totalDocs > 0 ? (approvedDocs / totalDocs) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Shield className="h-4 w-4" />
            <span>Admin Portal</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your platform.</p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Users"
            value={platformStats.totalUsers.toLocaleString()}
            icon={Users}
            color="blue"
            trend="12"
            delay={0.1}
            isLoading={isLoading}
          />
          <StatCard
            title="Active Properties"
            value={platformStats.activeProperties.toLocaleString()}
            icon={Building2}
            color="green"
            trend="8"
            delay={0.2}
            isLoading={isLoading}
          />
          <StatCard
            title="Pending Verifications"
            value={pendingCount}
            icon={Clock}
            color="yellow"
            delay={0.3}
            isLoading={isLoading}
          />
          <StatCard
            title="Monthly Active"
            value={platformStats.monthlyActiveUsers.toLocaleString()}
            icon={TrendingUp}
            color="purple"
            trend="23"
            delay={0.4}
            isLoading={isLoading}
          />
        </div>

        {/* Verification Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Verification Overview
              </CardTitle>
              <CardDescription>Document verification status and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Verification Rate</span>
                    <span className="font-medium">{verificationRate.toFixed(1)}%</span>
                  </div>
                  <Progress value={verificationRate} className="h-2" />
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{stats?.pending || 0}</div>
                    <div className="text-xs text-gray-500">Pending</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{stats?.approved || 0}</div>
                    <div className="text-xs text-gray-500">Approved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{stats?.rejected || 0}</div>
                    <div className="text-xs text-gray-500">Rejected</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest pending verifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((doc, index) => (
                  <div key={doc.id} className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                      <Clock className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{doc.user?.fullName || 'User'}</p>
                      <p className="text-xs text-gray-500">
                        Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-yellow-600 border-yellow-200">
                      {doc.documentType}
                    </Badge>
                  </div>
                ))}
                {recentActivity.length === 0 && !isLoading && (
                  <p className="text-sm text-gray-500 text-center py-4">No pending verifications</p>
                )}
                {isLoading && (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Navigation Cards */}
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <NavCard
            title="User Management"
            description="Manage users, roles, and permissions"
            icon={Users}
            href="/admin/users"
            color="blue"
          />
          <NavCard
            title="Property Management"
            description="Review and manage property listings"
            icon={Home}
            href="/admin/properties"
            color="green"
            badge={stats?.pending ? `${stats.pending} pending` : undefined}
          />
          <NavCard
            title="Verification Panel"
            description="Review user documents and KYC"
            icon={FileSearch}
            href="/admin/verifications"
            color="yellow"
            badge={pendingCount > 0 ? `${pendingCount} new` : undefined}
          />
          <NavCard
            title="AI Analytics"
            description="Search insights and property trends"
            icon={Brain}
            href="/admin/ai-analytics"
            color="purple"
          />
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                Platform Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Total Users</span>
                  <span className="font-semibold">
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : platformStats.totalUsers.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Active Landlords</span>
                  <span className="font-semibold">
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : platformStats.totalLandlords.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Active Tenants</span>
                  <span className="font-semibold">
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : platformStats.totalTenants.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Total Properties</span>
                  <span className="font-semibold">
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : platformStats.totalProperties.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Monthly Active Users</span>
                  <span className="font-semibold">
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : platformStats.monthlyActiveUsers.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                System Health (Dummy)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>API Uptime</span>
                    <span className="text-green-600">99.9%</span>
                  </div>
                  <Progress value={99.9} className="h-2 bg-gray-100" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Storage Usage</span>
                    <span>2.3 GB / 10 GB</span>
                  </div>
                  <Progress value={23} className="h-2 bg-gray-100" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Active Sessions </span>
                    <span>156</span>
                  </div>
                  <Progress value={78} className="h-2 bg-gray-100" />
                </div>
                <div className="pt-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-700">All systems operational</span>
                    </div>
                    <span className="text-xs text-green-600">Last checked: 2 min ago</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}