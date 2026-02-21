"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Train,
  BedDouble,
  Bath,
  Square,
  Calendar,
  Shield,
  Zap,
  Droplet,
  Flame,
  Wifi,
  Car,
  Users,
  Building2,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Star,
  Phone,
  MessageCircle,
  Clock,
  CheckCircle,
  XCircle,
  Home,
  FileText,
  AlertCircle
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

// Types
interface Property {
  id: string;
  title: string;
  description: string;
  bhk: string;
  rent: number;
  furnishing: string;
  tenant_type: string;
  is_broker: boolean;
  brokerage_fee?: number;
  
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  pincode: string;
  
  latitude?: number;
  longitude?: number;
  
  has_water_247: boolean;
  has_power_backup: boolean;
  has_igl_pipeline: boolean;
  
  nearest_metro_station?: string;
  distance_to_metro_km?: number;
  
  images: string[];
  
  landlord_id: string;
  landlord_name: string;
  landlord_phone: string;
  landlord_avatar?: string;
  landlord_verified: boolean;
  
  amenities: string[];
  floor_plan?: string;
  available_from: string;
  minimum_lease: string;
  security_deposit: number;
  maintenance_charges?: number;
  parking_available: boolean;
  pet_friendly: boolean;
  age_of_property: string;
  
  created_at: string;
  updated_at: string;
}

// Mock data - Replace with actual API call
const fetchProperty = async (id: string): Promise<Property> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    id: id,
    title: "Modern 2BHK Apartment in Whitefield",
    description: "Spacious 2BHK apartment with modern amenities located in the heart of Whitefield. Perfect for families and working professionals. The apartment features a large balcony with garden view, modular kitchen, and ample natural light. Located close to IT parks, schools, and hospitals.",
    bhk: "2 BHK",
    rent: 25000,
    furnishing: "Semi-Furnished",
    tenant_type: "family",
    is_broker: false,
    
    address_line1: "123, Oakwood Residency",
    address_line2: "Whitefield Main Road",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560066",
    
    latitude: 12.9698,
    longitude: 77.7499,
    
    has_water_247: true,
    has_power_backup: true,
    has_igl_pipeline: false,
    
    nearest_metro_station: "Baiyappanahalli",
    distance_to_metro_km: 1.2,
    
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=800",
      "https://images.unsplash.com/photo-1560448204-61dc36dc98c8?w=800",
    ],
    
    landlord_id: "l1",
    landlord_name: "Rajesh Kumar",
    landlord_phone: "9876543210",
    landlord_avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    landlord_verified: true,
    
    amenities: [
      "24/7 Water Supply",
      "Power Backup",
      "Lift",
      "Security",
      "Parking",
      "Gym",
      "Children's Play Area",
      "Club House"
    ],
    floor_plan: "/images/floor-plan.jpg",
    available_from: "2024-04-01",
    minimum_lease: "11 months",
    security_deposit: 50000,
    maintenance_charges: 2500,
    parking_available: true,
    pet_friendly: false,
    age_of_property: "3 years",
    
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};

export default function PropertyPage() {
  const params = useParams();
  const propertyId = params.id as string;
  
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadProperty();
  }, [propertyId]);

  const loadProperty = async () => {
    try {
      const data = await fetchProperty(propertyId);
      setProperty(data);
    } catch (error) {
      toast.error("Failed to load property details");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    if (!mounted) return price.toString();
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const nextImage = () => {
    if (property) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  const handleScheduleVisit = () => {
    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }
    toast.success(`Visit scheduled for ${selectedDate.toLocaleDateString()}`);
    setIsScheduleDialogOpen(false);
  };

  const handleWhatsAppChat = () => {
    if (!property) return;
    const message = encodeURIComponent(
      `Hi, I'm interested in your property "${property.title}" listed on Urban Key. Is it still available?`
    );
    window.open(`https://wa.me/${property.landlord_phone}?text=${message}`, '_blank');
  };

  if (loading) {
    return <PropertyPageSkeleton />;
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 pt-4 flex items-center justify-center">
        <Card className="p-8 text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Property Not Found</h2>
          <p className="text-gray-600 mb-4">The property you're looking for doesn't exist or has been removed.</p>
          <Link href="/properties/search">
            <Button>Browse Other Properties</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-4">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link 
          href="/properties/search" 
          className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Search
        </Link>

        {/* Image Gallery */}
        <div className="relative mb-8">
          <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden">
            <Image
              src={property.images[currentImageIndex]}
              alt={property.title}
              fill
              className="object-cover"
              priority
            />
            
            {/* Navigation Arrows */}
            {property.images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {property.images.length}
            </div>
          </div>

          {/* Thumbnail Strip */}
          {property.images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              {property.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 transition-all ${
                    index === currentImageIndex ? 'ring-2 ring-blue-600 scale-105' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`Thumbnail ${index + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Key Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{property.address_line1}, {property.city}, {property.state} - {property.pincode}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => setIsInWishlist(!isInWishlist)}
                          >
                            <Heart className={isInWishlist ? "fill-red-500 text-red-500" : ""} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{isInWishlist ? "Remove from wishlist" : "Save to wishlist"}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon">
                            <Share2 />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Share property</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mb-4">
                  <Badge className="bg-blue-600 text-white border-0 text-sm px-3 py-1">
                    {property.bhk}
                  </Badge>
                  <Badge variant="outline" className="text-sm px-3 py-1 capitalize">
                    {property.furnishing}
                  </Badge>
                  <Badge variant="outline" className="text-sm px-3 py-1 capitalize">
                    {property.tenant_type}
                  </Badge>
                  {property.is_broker ? (
                    <Badge variant="secondary" className="text-sm px-3 py-1">
                      Broker
                    </Badge>
                  ) : (
                    <Badge className="bg-green-600 text-white border-0 text-sm px-3 py-1">
                      Direct Owner
                    </Badge>
                  )}
                </div>

                {/* Metro Distance */}
                {property.distance_to_metro_km && (
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-center gap-2 mb-4">
                    <Train className="h-5 w-5 text-blue-600" />
                    <span className="text-blue-800">
                      <span className="font-semibold">{property.distance_to_metro_km} km</span> from {property.nearest_metro_station} Metro Station
                    </span>
                  </div>
                )}

                {/* Price */}
                <div className="mb-4">
                  <p className="text-3xl font-bold text-blue-600">
                    ₹{formatPrice(property.rent)} <span className="text-sm font-normal text-gray-600">/month</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-3">About this property</h2>
                <p className="text-gray-600 leading-relaxed">{property.description}</p>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {/* Basic Amenities */}
                  {property.has_water_247 && (
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <Droplet className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">24/7 Water</span>
                    </div>
                  )}
                  {property.has_power_backup && (
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <Zap className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm">Power Backup</span>
                    </div>
                  )}
                  {property.has_igl_pipeline && (
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <Flame className="h-4 w-4 text-orange-600" />
                      <span className="text-sm">IGL Pipeline</span>
                    </div>
                  )}
                  {property.parking_available && (
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <Car className="h-4 w-4 text-purple-600" />
                      <span className="text-sm">Parking</span>
                    </div>
                  )}
                  {/* Additional Amenities */}
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Property Details Tabs */}
            <Card>
              <CardContent className="p-6">
                <Tabs defaultValue="details" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="floorplan">Floor Plan</TabsTrigger>
                    <TabsTrigger value="nearby">Nearby</TabsTrigger>
                  </TabsList>
                  <TabsContent value="details" className="mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500">Bedrooms</p>
                        <p className="font-medium">{property.bhk}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500">Bathrooms</p>
                        <p className="font-medium">2</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500">Area</p>
                        <p className="font-medium">1050 sq.ft</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500">Floor</p>
                        <p className="font-medium">3rd of 5</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500">Available From</p>
                        <p className="font-medium">{formatDate(property.available_from)}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500">Minimum Lease</p>
                        <p className="font-medium">{property.minimum_lease}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500">Security Deposit</p>
                        <p className="font-medium">₹{formatPrice(property.security_deposit)}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500">Maintenance</p>
                        <p className="font-medium">₹{formatPrice(property.maintenance_charges || 0)}/month</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500">Age of Property</p>
                        <p className="font-medium">{property.age_of_property}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500">Pet Friendly</p>
                        <p className="font-medium">
                          {property.pet_friendly ? (
                            <span className="text-green-600">Yes</span>
                          ) : (
                            <span className="text-red-600">No</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="floorplan">
                    <div className="h-[300px] bg-gray-100 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">Floor plan coming soon</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="nearby">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span>Metro Station</span>
                        <span className="font-medium">{property.distance_to_metro_km} km</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span>Bus Stop</span>
                        <span className="font-medium">0.3 km</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span>Hospital</span>
                        <span className="font-medium">1.5 km</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span>School</span>
                        <span className="font-medium">0.8 km</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span>Mall</span>
                        <span className="font-medium">2.1 km</span>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Contact & Actions */}
          <div className="space-y-6">
            {/* Owner Card */}
            <Card className="sticky top-20 z-20">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Contact Owner</h2>
                
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={property.landlord_avatar} />
                    <AvatarFallback>{property.landlord_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{property.landlord_name}</p>
                    <div className="flex items-center gap-1 text-sm">
                      {property.landlord_verified ? (
                        <>
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          <span className="text-green-600">Verified Owner</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3 text-yellow-600" />
                          <span className="text-yellow-600">Verification Pending</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {property.is_broker && property.brokerage_fee && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-orange-800">
                      <span className="font-semibold">Brokerage:</span> ₹{formatPrice(property.brokerage_fee)} 
                      ({(property.brokerage_fee / property.rent).toFixed(1)} months rent)
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={handleWhatsAppChat}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Chat on WhatsApp
                  </Button>

                  <Button 
                    className="w-full"
                    variant="outline"
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Call Now
                  </Button>

                  <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        <Calendar className="mr-2 h-4 w-4" />
                        Schedule Visit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Schedule a Visit</DialogTitle>
                        <DialogDescription>
                          Choose a date to visit this property
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <CalendarComponent
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={(date) => date < new Date()}
                          className="rounded-md border mx-auto"
                        />
                        <div className="mt-4 space-y-2">
                          <p className="text-sm text-gray-500">Available time slots:</p>
                          <div className="flex gap-2 flex-wrap">
                            {["10:00 AM", "11:00 AM", "2:00 PM", "4:00 PM", "5:00 PM"].map((time) => (
                              <Badge key={time} variant="outline" className="cursor-pointer hover:bg-blue-50">
                                {time}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleScheduleVisit}>
                          Confirm Visit
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <Separator className="my-4" />

                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Listed on {formatDate(property.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>50+ people viewed today</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rent Agreement Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Rent Agreement</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Generate a legally valid rent agreement instantly
                </p>
                <Button variant="outline" className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Agreement
                </Button>
              </CardContent>
            </Card>

            {/* Similar Properties */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Similar Properties</h3>
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <Link href={`/properties/${i}`} key={i}>
                      <div className="flex gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200"
                            alt="Similar property"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-sm">2BHK in Whitefield</p>
                          <p className="text-xs text-gray-500">1.5 km from metro</p>
                          <p className="text-sm font-bold text-blue-600">₹25,000</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Skeleton Loader
function PropertyPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-6 w-32 mb-6" />
        
        {/* Image Gallery Skeleton */}
        <Skeleton className="w-full h-[400px] md:h-[500px] rounded-2xl mb-4" />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <div className="flex gap-2 mb-4">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="h-10 w-40" />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-40 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="flex items-center gap-3 mb-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <Skeleton className="h-10 w-full mb-2" />
                <Skeleton className="h-10 w-full mb-2" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}