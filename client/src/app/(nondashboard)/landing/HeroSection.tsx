"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Search, MapPin, TrendingUp, Zap, Shield, Users, Loader2 } from "lucide-react";

import styles from "@/styles/Landing.module.css";
import { cn } from "@/lib/utils";
import { apiClient } from '@/lib/api/api-client';
import { toast } from 'sonner';
import { AntigravityBackground } from '@/components/common/AntigravityBackground';

// Define stats interface
interface Stats {
  totalProperties: number;
  totalTenants: number;
  totalLandlords: number;
}
function HeroSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalTenants: 0,
    totalLandlords: 0,
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Load stats on mount
  useEffect(() => {
    loadStats();
  },[]);

  const loadStats = async () => {
    try {
      // Fetch stats from your backend
      const statsResponse = await apiClient.get<Stats>("/api/properties/stats");
      
      setStats({
        totalProperties: statsResponse.totalProperties,
        totalTenants: statsResponse.totalTenants,
        totalLandlords: statsResponse.totalLandlords,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
      toast.error("Error loading statistics");
      // Fallback to mock data
      setStats({
        totalProperties: 150,
        totalTenants: 380,
        totalLandlords: 52,
      });
    } finally {
      setIsLoadingStats(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      // Use semantic search if available, otherwise regular search
      const response: any = await apiClient.get(
        `/api/properties/semantic?q=${encodeURIComponent(searchQuery)}`
      );
      
      // Store search results in sessionStorage to persist across pages
      sessionStorage.setItem('searchResults', JSON.stringify(response.results || []));
      sessionStorage.setItem('searchQuery', searchQuery);
      
      // Navigate to search page
      router.push(`/properties/search?q=${encodeURIComponent(searchQuery)}`);
    } catch (error) {
      console.error('Search failed:', error);
      // Fallback to regular search
      router.push(`/properties/search?q=${encodeURIComponent(searchQuery)}`);
    } finally {
      setIsSearching(false);
    }
  };

  const handleTrendingTagClick = (tag: string) => {
    let searchTerm = '';
    switch (tag) {
      case 'Near Metro':
        searchTerm = 'near metro station';
        break;
      case '2 BHK':
        searchTerm = '2BHK apartment';
        break;
      case 'No Brokerage':
        searchTerm = 'direct owner no brokerage';
        break;
      case 'Fully Furnished':
        searchTerm = 'fully furnished';
        break;
      default:
        searchTerm = tag;
    }
    setSearchQuery(searchTerm);
    router.push(`/properties/search?q=${encodeURIComponent(searchTerm)}`);
  };

  const trendingTags = [
    { label: "Near Metro", icon: MapPin, query: "near metro station" },
    { label: "2 BHK", icon: Users, query: "2BHK apartment" },
    { label: "No Brokerage", icon: Shield, query: "direct owner" },
    { label: "Fully Furnished", icon: Zap, query: "fully furnished" },
  ];

  return (
    <div className="relative w-full h-[100vh] min-h-[600px] flex items-center justify-center overflow-hidden ">
      {/* Background Image with Overlay */}
      <AntigravityBackground/>
      {/* <div className="absolute inset-0 z-0">
        <Image
          src={heroImgOne}
          alt="Modern Apartment Interior"
          fill
          className="object-cover opacity-50"
          priority
          placeholder="blur"
          sizes="100vw"
        />
        <div className={cn("absolute inset-0 bg-black/60", styles.heroOverlay)} />
      </div> */}

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center text-white space-y-8">
        
        {/* Main Heading & Subtext */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 drop-shadow-lg">
            Find Your <span className="text-blue-400 relative">
              Sanctuary
              <motion.span 
                className="absolute -bottom-2 left-0 w-full h-1 bg-blue-400/50 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 1, duration: 0.8 }}
              />
            </span> <br />
            in the Heart of the City
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md">
            Seamlessly connect with verified landlords. No brokerage. <br className="hidden md:block"/>
            AI-powered search tailored for the modern Indian tenant.
          </p>
        </motion.div>

        {/* Enhanced Search Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="w-full max-w-3xl px-2"
        >
          <form onSubmit={handleSearch}>
            <div className={cn(
              "p-2 rounded-4xl md:rounded-full flex flex-col md:flex-row items-center gap-2",
              styles.glassSearch
            )}>
              
              {/* Location Input */}
              <div className="flex-1 flex items-center w-full px-4 md:border-r border-white/20 mb-2 md:mb-0">
                <MapPin className="w-5 h-5 text-blue-300 mr-3 shrink-0" />
                <Input 
                  type="text" 
                  placeholder="Search by city, neighborhood, or landmark..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(
                    "border-none shadow-none focus-visible:ring-0 h-12 text-base w-full",
                    styles.glassSearchInput
                  )}
                />
              </div>

              {/* Search Button with Hover Effect */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full md:w-auto"
              >
                <Button 
                  type="submit"
                  size="lg" 
                  disabled={isSearching}
                  className="w-full md:w-auto rounded-full px-8 h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-300 shadow-lg relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center">
                    {isSearching ? (
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                      <Search className="w-5 h-5 mr-2" />
                    )}
                    {isSearching ? 'Searching...' : 'Search'}
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </motion.div>
            </div>
          </form>
          
          {/* Trending Tags with Icons */}
          <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm font-medium">
            <span className="text-gray-300 self-center mr-2 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              Trending:
            </span>
            {trendingTags.map((tag, i) => {
              const Icon = tag.icon;
              return (
                <motion.span 
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleTrendingTagClick(tag.label)}
                  className={cn(
                    "px-4 py-1.5 rounded-full flex items-center gap-1.5 cursor-pointer text-white",
                    styles.tagPill
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tag.label}
                </motion.span>
              );
            })}
          </div>

          {/* Stats Counter - Now dynamic */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-12 flex justify-center gap-8 text-sm"
          >
            <div className="text-center">
              <div className="text-2xl font-bold">
                {isLoadingStats ? '...' : `${Math.floor(stats.totalProperties )}+`}
              </div>
              <div className="text-gray-300">Properties</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {isLoadingStats ? '...' : `${Math.floor(stats.totalTenants )}+`}
              </div>
              <div className="text-gray-300">Happy Tenants</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {isLoadingStats ? '...' : `${Math.floor(stats.totalLandlords)}+`}
              </div>
              <div className="text-gray-300">Verified Owners</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-2 bg-white/50 rounded-full mt-2" />
        </div>
      </motion.div>
    </div>
  );
}

export default HeroSection;