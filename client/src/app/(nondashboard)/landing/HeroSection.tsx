"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';


import { motion } from "framer-motion";
import {  MapPin, TrendingUp, Zap, Shield, Users } from "lucide-react";

import styles from "@/styles/Landing.module.css";
import { cn } from "@/lib/utils";
import { apiClient } from '@/lib/api/api-client';
import { toast } from 'sonner';
import { AntigravityBackground } from '@/components/common/AntigravityBackground';
import { TextTypeHeader } from '@/components/common/TextTypeHeader';
import { SearchBar } from '@/components/common/SearchBar';

// Define stats interface
interface Stats {
  totalProperties: number;
  totalTenants: number;
  totalLandlords: number;
}
function HeroSection() {
  const router = useRouter();
 
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

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const response: any = await apiClient.get(
        // Use semantic search if available, otherwise regular search
        `/api/properties/semantic?q=${encodeURIComponent(query)}`
      );
       // Store search results in sessionStorage to persist across pages
      sessionStorage.setItem('searchResults', JSON.stringify(response.results || []));
      sessionStorage.setItem('searchQuery', query);
        // Navigate to search page
      router.push(`/properties/search?q=${encodeURIComponent(query)}`);
    } catch (error) {
            // Fallback to regular search
      console.error('Search failed:', error);
      router.push(`/properties/search?q=${encodeURIComponent(query)}`);
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
    
      

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center text-white space-y-8">
        
        {/* Main Heading & Subtext */}
        
        <TextTypeHeader 
            words={[
              'Find your dream home with zero broker fees.',
              'Search smarter with AI-powered matching.',
              'Connect directly with verified landlords.',
              'Sign rental agreements instantly online.'
            ]}
            subheading="UrbanKey makes renting simple, transparent, and completely broker-free."
            headingSize="text-3xl md:text-4xl lg:text-6xl"
          />

        {/* Enhanced Search Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="w-full max-w-3xl px-2"
        >
          <SearchBar
            onSearch={handleSearch}
            isLoading={isSearching}
            placeholder="Search by city, neighborhood, or landmark..."
            variant="glass"
            size="lg"
            showSparkle={true}
          />
          
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
            className="mt-12 flex justify-center gap-8 text-sm text-purple-500"
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
        className="absolute bottom-20 left-1/2 transform -translate-x-1/2"
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