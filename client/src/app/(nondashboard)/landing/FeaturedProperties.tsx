"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  MapPin, 
  Train, 
  Bath, 
  BedDouble, 
  Square,
  Heart,
  Eye,
  ChevronRight,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import styles from "@/styles/Landing.module.css";

// Mock data for featured properties
const featuredProperties = [
  {
    id: 1,
    title: "Modern 2BHK in Whitefield",
    location: "Whitefield, Bangalore",
    price: 25000,
    bhk: "2 BHK",
    area: "1050 sq.ft",
    furnishing: "Semi-Furnished",
    metro: "1.2 km from Baiyappanahalli",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500",
    features: ["24/7 Water", "Power Backup", "Parking"],
    rating: 4.5,
    isNew: true,
    isVerified: true
  },
  {
    id: 2,
    title: "Luxury 3BHK with Terrace",
    location: "Koramangala, Bangalore",
    price: 45000,
    bhk: "3 BHK",
    area: "1650 sq.ft",
    furnishing: "Fully Furnished",
    metro: "2.5 km from MG Road",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500",
    features: ["24/7 Water", "Power Backup", "IGL Pipeline", "Gym"],
    rating: 4.8,
    isNew: false,
    isVerified: true
  },
  {
    id: 3,
    title: "Cozy 1BHK near Metro",
    location: "Indiranagar, Bangalore",
    price: 18000,
    bhk: "1 BHK",
    area: "650 sq.ft",
    furnishing: "Fully Furnished",
    metro: "0.5 km from Indiranagar",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500",
    features: ["24/7 Water", "Power Backup"],
    rating: 4.3,
    isNew: true,
    isVerified: true
  },
  {
    id: 4,
    title: "Spacious 2BHK with Balcony",
    location: "HSR Layout, Bangalore",
    price: 32000,
    bhk: "2 BHK",
    area: "1200 sq.ft",
    furnishing: "Semi-Furnished",
    metro: "3.0 km from Silk Board",
    image: "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=500",
    features: ["24/7 Water", "Power Backup", "Parking", "Security"],
    rating: 4.6,
    isNew: false,
    isVerified: true
  }
];

function FeaturedProperties() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatPrice = (price: number) => {
    if (!mounted) return price.toString();
    return new Intl.NumberFormat('en-IN').format(price);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
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
          <Badge variant="outline" className="mb-4 px-4 py-1 text-blue-600 border-blue-200 bg-blue-50">
            Featured Properties
          </Badge>
          <h2 className={cn("text-3xl md:text-4xl font-bold mb-4", styles.sectionTitle)}>
            Handpicked for You
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our most sought-after properties, verified and ready for you to move in
          </p>
        </motion.div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProperties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              onHoverStart={() => setHoveredId(property.id)}
              onHoverEnd={() => setHoveredId(null)}
              className="h-full"
            >
              <Card className={cn(
                "h-full overflow-hidden group cursor-pointer border-0 shadow-lg",
                styles.propertyCard
              )}>
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={property.image}
                    alt={property.title}
                    fill
                    className={cn("object-cover", styles.propertyImage)}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  
                  {/* Overlay Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    {property.isNew && (
                      <Badge className="bg-blue-600 text-white border-0">
                        New
                      </Badge>
                    )}
                    {property.isVerified && (
                      <Badge className="bg-green-600 text-white border-0">
                        Verified
                      </Badge>
                    )}
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-black/70 text-white border-0 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      {property.rating}
                    </Badge>
                  </div>

                  {/* Quick Actions */}
                  <motion.div 
                    className="absolute inset-0 bg-black/50 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                    animate={hoveredId === property.id ? { opacity: 1 } : { opacity: 0 }}
                  >
                    <Button size="icon" variant="secondary" className="rounded-full">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="secondary" className="rounded-full">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </motion.div>
                </div>

                <CardContent className="p-4">
                  {/* Title and Price */}
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg line-clamp-1">{property.title}</h3>
                    <p className="font-bold text-lg text-blue-600">
                      ₹{formatPrice(property.price)}
                    </p>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-1 text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm truncate">{property.location}</span>
                  </div>

                  {/* Metro Distance */}
                  <div className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded-md mb-3">
                    <Train className="h-4 w-4" />
                    <span className="text-xs">{property.metro}</span>
                  </div>

                  {/* Specs */}
                  <div className="flex gap-3 mb-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <BedDouble className="h-4 w-4" />
                      {property.bhk}
                    </span>
                    <span className="flex items-center gap-1">
                      <Square className="h-4 w-4" />
                      {property.area}
                    </span>
                  </div>

                  {/* Features Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {property.features.slice(0, 3).map((feature, i) => (
                      <Badge key={i} variant="outline" className="text-xs bg-gray-50">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  {/* View Details Button */}
                  <Link href={`/properties/${property.id}`}>
                    <Button 
                      variant="ghost" 
                      className="w-full group relative overflow-hidden border border-gray-200 hover:border-blue-600 hover:text-blue-600 transition-all"
                    >
                      <span className="relative z-10">View Details</span>
                      <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      <span className="absolute inset-0 bg-blue-50 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* View All Button - Now navigates to properties search page */}
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
              variant="outline" 
              className="rounded-full px-8 border-2 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all group"
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