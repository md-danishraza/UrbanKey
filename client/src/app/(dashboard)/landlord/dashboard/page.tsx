'use client';

import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { Home, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

import { DashboardStats } from '@/components/landlord/DashboardStats';
import { RecentLeads } from '@/components/landlord/RecentLeads';
import { QuickActions } from '@/components/landlord/QuickActions';
import { RecentProperties } from '@/components/landlord/RecentProperties';
import { apiClient } from '@/lib/api/api-client';
import { Card, CardContent } from '@/components/ui/card';
import { useLandlordVerification } from '@/hooks/useLandlordVerification';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface DashboardStats {
  totalProperties: number;
  activeProperties: number;
  totalViews: number;
  totalLeads: number;
  totalVisits: number;
  totalAgreements: number;
}

export default function LandlordDashboard() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    activeProperties: 0,
    totalViews: 0,
    totalLeads: 0,
    totalVisits: 0,
    totalAgreements: 0,
  });
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

   // Check landlord verification - redirects if not verified
      const { isVerified, isLoading: isVerificationLoading } = useLandlordVerification(true);
      useEffect(() => {
        if (isVerified === true) {
          loadDashboardData();
        }
      }, [isVerified,user]);
      // If not verified, don't render the page (hook will redirect)
      if (!isVerified) {
        return null;
      }
    



  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      if (!token) return;

      // Fetch dashboard stats
      const statsResponse:any = await apiClient.get('/api/landlord/dashboard/stats', token);
      if (statsResponse.success) {
        setStats(statsResponse.stats);
      }

      // Fetch properties with views and leads
      const propertiesResponse:any = await apiClient.get('/api/users/landlord/me', token);
      if (propertiesResponse.success) {
        setProperties(propertiesResponse.data || []);
      }
    } catch (error) {
      console.error('Failed to load dashboard:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  if(isLoading || isVerificationLoading) return <LoadingSpinner/>

  return (
    <div className="min-h-screen  bg-gradient-to-b from-rose-50 to-white py-8 px-4">
      
      <div className="max-w-7xl mx-auto">
      

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Home className="h-4 w-4" />
            <span>Dashboard</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome Back!
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your properties
          </p>
        </motion.div>

        {/* Stats Cards */}
        <DashboardStats stats={stats} isLoading={isLoading} className="mb-6" />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Quick Actions & Recent Properties */}
          <div className="lg:col-span-2 space-y-6">
            <QuickActions />
            <RecentProperties 
              properties={properties} 
              isLoading={isLoading}
            />
          </div>

          {/* Right Column - Recent Leads */}
          <div className="space-y-6">
            <RecentLeads  />
            
            {/* Tips Card */}
            <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Pro Tip</h3>
                    <p className="text-sm text-white/90">
                      Properties with high-quality images get 3x more views. Add clear photos of each room!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}