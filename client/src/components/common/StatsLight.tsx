'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, Shield, Search, FileText, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/api/api-client';
import { toast } from 'sonner';

interface StatsData {
  totalProperties: number;
  totalTenants: number;
  totalLandlords: number;
  totalAgreements: number;
}

interface StatsLightProps {
  className?: string;
  showLoader?: boolean;
  onStatsLoaded?: (stats: StatsData) => void;
}

const defaultStats: StatsData = {
  totalProperties: 0,
  totalTenants: 0,
  totalLandlords: 0,
  totalAgreements: 0,
};

export function StatsLight({ className = '', showLoader = true, onStatsLoaded }: StatsLightProps) {
  const [stats, setStats] = useState<StatsData>(defaultStats);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const statsResponse = await apiClient.get<StatsData>("/api/properties/stats");
      const newStats = {
        totalProperties: statsResponse.totalProperties || 0,
        totalTenants: statsResponse.totalTenants || 0,
        totalLandlords: statsResponse.totalLandlords || 0,
        totalAgreements: statsResponse.totalAgreements || 0,
      };
      setStats(newStats);
      onStatsLoaded?.(newStats);
    } catch (error) {
      console.error('Failed to load stats:', error);
      toast.error("Error loading statistics");
      const fallbackStats = {
        totalProperties: 150,
        totalTenants: 380,
        totalLandlords: 52,
        totalAgreements: 45,
      };
      setStats(fallbackStats);
      onStatsLoaded?.(fallbackStats);
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K+`;
    }
    return num.toString();
  };

  const statItems = [
    { 
      label: "Properties Listed", 
      value: stats.totalProperties,
      formattedValue: formatNumber(stats.totalProperties),
      icon: Home,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    { 
      label: "Happy Tenants", 
      value: stats.totalTenants,
      formattedValue: formatNumber(stats.totalTenants),
      icon: Shield,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    { 
      label: "Verified Owners", 
      value: stats.totalLandlords,
      formattedValue: formatNumber(stats.totalLandlords),
      icon: Search,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    { 
      label: "Agreements Generated", 
      value: stats.totalAgreements,
      formattedValue: formatNumber(stats.totalAgreements),
      icon: FileText,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600"
    },
  ];

  return (
    <div className={className}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statItems.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
            >
              {/* Decorative gradient bar on top */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              <div className="p-6 flex flex-col items-center text-center">
                {/* Icon Container */}
                <div className={`w-14 h-14 rounded-xl ${stat.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-7 h-7 ${stat.iconColor}`} />
                </div>
                
                {/* Value */}
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                  {isLoading && showLoader ? (
                    <div className="flex justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                    </div>
                  ) : (
                    stat.formattedValue
                  )}
                </div>
                
                {/* Label */}
                <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
                
                {/* Decorative dots at bottom */}
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className={`w-1 h-1 rounded-full bg-gradient-to-r ${stat.color}`} />
                  <div className={`w-1 h-1 rounded-full bg-gradient-to-r ${stat.color} delay-75`} />
                  <div className={`w-1 h-1 rounded-full bg-gradient-to-r ${stat.color} delay-150`} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}