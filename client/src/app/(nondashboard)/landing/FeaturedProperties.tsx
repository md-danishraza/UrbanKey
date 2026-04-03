"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { apiClient } from "@/lib/api/api-client";
import styles from "@/styles/Landing.module.css";
import { toast } from "sonner";

interface Property {
  id: string;
  title: string;
  rent: number;
  bhk: string;
  city: string;
  images: { imageUrl: string; isPrimary: boolean }[];
  nearestMetroStation?: string;
  distanceToMetroKm?: number;
  isBroker?: boolean;
  brokerageFee?: number;
}

function FeaturedProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFeaturedProperties();
  }, []);

  const loadFeaturedProperties = async () => {
    setIsLoading(true);
    try {
      // Fetch properties - you can add filters like sort by latest or most viewed
      const response: any = await apiClient.get('/api/properties?limit=4&sort=createdAt');
      
      if (response.data) {
        setProperties(response.data);
      } else if (Array.isArray(response)) {
        setProperties(response);
      } else {
        setProperties([]);
      }
    } catch (error) {
      console.error('Failed to load featured properties:', error);
      toast.error('Failed to load featured properties');
      setProperties([]);
    } finally {
      setIsLoading(false);
    }
  };


  if (isLoading) {
    return (
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 px-4 py-1 text-blue-600 border-blue-200 bg-blue-50">
              Featured Properties
            </Badge>
            <h2 className="text-3xl text-white md:text-4xl font-bold mb-4">Handpicked for You</h2>
            <p className="text-gray-800 max-w-2xl mx-auto ">
              Loading our most sought-after properties...
            </p>
          </div>
          
          {/* Loading Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[500px] bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (properties.length === 0) {
    return (
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 px-4 py-1 text-blue-600 border-blue-200 bg-blue-50">
              Featured Properties
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Handpicked for You</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              No properties available at the moment. Check back soon!
            </p>
          </div>
          
          {/* Empty State */}
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No featured properties found</p>
            <Link href="/properties/search">
              <Button variant="outline">Browse All Properties</Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className={cn("absolute inset-0 opacity-30", styles.gridPattern)} />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4 px-4 py-1 text-primary bg-blue-50">
            Featured Properties
          </Badge>
          <h2 className={cn("text-3xl md:text-4xl font-bold mb-4", styles.sectionTitle)}>
            Handpicked for You
          </h2>
          <p className="text-purple-500 max-w-2xl mx-auto">
            Discover our most sought-after properties, verified and ready for you to move in
          </p>
        </motion.div>

        {/* Properties Grid - Using PropertyCard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {properties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="h-full"
            >
              <PropertyCard 
              property={property} 
              showActions={true}  
              showWishlist={false}  
              // Disable wishlist on landing 
              />
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link href="/properties/search">
            <Button 
              size="lg" 
             
              className="rounded-full cursor-pointer px-8  transition-all group"
            >
              View All Properties
              <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default FeaturedProperties;