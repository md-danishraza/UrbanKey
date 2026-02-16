"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Search, MapPin } from "lucide-react";
import heroImgOne from "@/assets/landing/hero.jpg"; // Ensure this image exists

function HeroSection() {
  return (
    <div className="relative w-full h-[calc(100vh-64px)] min-h-[600px] flex items-center justify-center overflow-hidden bg-black">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroImgOne}
          alt="Modern Apartment Interior"
          fill
          className="object-cover opacity-90"
          priority
          placeholder="blur" // Works if image is imported statically
          sizes="100vw"
        />
        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

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
            Find Your <span className="text-primary-foreground">Sanctuary</span> <br />
            in the Heart of the City
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md">
            Seamlessly connect with verified landlords. No brokerage. <br className="hidden md:block"/>
            AI-powered search tailored for the modern Indian tenant.
          </p>
        </motion.div>

        {/* Elegant Search Bar Template */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="w-full max-w-3xl px-2"
        >
          {/* Glassmorphism Container */}
          <div className="bg-white/50 backdrop-blur-md p-2 rounded-4xl md:rounded-full shadow-2xl flex flex-col md:flex-row items-center gap-2 border border-white/20 ring-1 ring-white/5">
            
            {/* Input Field */}
            <div className="flex-1 flex items-center w-full px-4 md:border-r border-gray-200 mb-2 md:mb-0">
              <MapPin className="w-5 h-5 text-primary mr-3 opacity-70 shrink-0" />
              <Input 
                type="text" 
                placeholder="Search by city, neighborhood, or landmark..." 
                className="border-none shadow-none focus-visible:ring-0 bg-transparent text-gray-800 placeholder:text-gray-200 h-12 text-base placeholder:text-wrap  w-full"
              />
            </div>

            {/* Search Button */}
            <Button 
              size="lg" 
              className="w-full md:w-auto rounded-full px-8 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all duration-300 shadow-lg"
            >
              <Search className="w-5 h-5 mr-2" />
              Search
            </Button>
          </div>
          
          {/* Quick Tags / Trending */}
          <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm font-medium">
            <span className="text-gray-300 self-center mr-2">Trending:</span>
            {["Near Metro", "2 BHK", "No Brokerage", "Fully Furnished"].map((tag, i) => (
               <motion.span 
                 key={i}
                 whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
                 className="px-4 py-1.5 rounded-full border border-white/30 bg-black/30 backdrop-blur-sm text-white cursor-pointer transition-colors"
               >
                 {tag}
               </motion.span>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}

export default HeroSection;