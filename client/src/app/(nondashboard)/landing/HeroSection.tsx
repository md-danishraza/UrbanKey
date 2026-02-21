"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Search, MapPin, TrendingUp, Zap, Shield, Users } from "lucide-react";
import heroImgOne from "@/assets/landing/hero.jpg";
import styles from "@/styles/Landing.module.css";
import { cn } from "@/lib/utils";

function HeroSection() {
  const trendingTags = [
    { label: "Near Metro", icon: MapPin },
    { label: "2 BHK", icon: Users },
    { label: "No Brokerage", icon: Shield },
    { label: "Fully Furnished", icon: Zap },
  ];

  return (
    <div className="relative w-full h-[calc(100vh-64px)] min-h-[600px] flex items-center justify-center overflow-hidden bg-black">
      {/* Background Image with Parallax Effect */}
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5 }}
      >
        <Image
          src={heroImgOne}
          alt="Modern Apartment Interior"
          fill
          className="object-cover opacity-90"
          priority
          placeholder="blur"
          sizes="100vw"
        />
        <div className={cn("absolute inset-0", styles.heroOverlay)} />
      </motion.div>

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
          {/* Glassmorphism Container */}
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
                size="lg" 
                className="w-full md:w-auto rounded-full px-8 h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-300 shadow-lg relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center">
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </motion.div>
          </div>
          
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

          {/* Stats Counter */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-12 flex justify-center gap-8 text-sm"
          >
            <div className="text-center">
              <div className="text-2xl font-bold">10K+</div>
              <div className="text-gray-300">Properties</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">5K+</div>
              <div className="text-gray-300">Happy Tenants</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">2K+</div>
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