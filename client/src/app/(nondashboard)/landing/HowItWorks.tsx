"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Search, 
  CalendarCheck, 
  Home,
  MessageCircle,
  Shield,
  FileText,
  Brain,
  Sparkles,
  ArrowRight,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import styles from "@/styles/Landing.module.css";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api/api-client";
import { toast } from "sonner";

const steps = [
  {
    icon: Search,
    title: "AI-Powered Search",
    description: "Our RAG-based semantic search understands natural language. Just describe what you're looking for, and we'll find the perfect match.",
    color: "from-blue-500 to-cyan-500",
    gradient: "bg-gradient-to-br from-blue-500/20 to-cyan-500/10",
    border: "group-hover:border-blue-500/50",
    link: "/properties/search"
  },
  {
    icon: Brain,
    title: "Smart Recommendations",
    description: "Get personalized property recommendations based on your preferences, search history, and budget using our AI algorithms.",
    color: "from-purple-500 to-pink-500",
    gradient: "bg-gradient-to-br from-purple-500/20 to-pink-500/10",
    border: "group-hover:border-purple-500/50",
    link: "/about#ai-recommendations"
  },
  {
    icon: Shield,
    title: "Aadhar Verification",
    description: "Secure KYC verification for both tenants and landlords. All documents are encrypted and verified by our team.",
    color: "from-orange-500 to-red-500",
    gradient: "bg-gradient-to-br from-orange-500/20 to-red-500/10",
    border: "group-hover:border-orange-500/50",
    link: "/about#verification"
  },
  {
    icon: CalendarCheck,
    title: "Schedule Visit",
    description: "Book virtual or physical tours at your convenience. Get instant confirmation from landlords.",
    color: "from-emerald-500 to-teal-500",
    gradient: "bg-gradient-to-br from-emerald-500/20 to-teal-500/10",
    border: "group-hover:border-emerald-500/50",
    link: "/about#schedule"
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Integration",
    description: "Chat directly with owners via WhatsApp. Instant communication for quick negotiations and queries.",
    color: "from-green-500 to-emerald-500",
    gradient: "bg-gradient-to-br from-green-500/20 to-emerald-500/10",
    border: "group-hover:border-green-500/50",
    link: "/about#connect"
  },
  {
    icon: FileText,
    title: "Rent Agreement PDF",
    description: "Auto-generate legally valid rent agreements. Download PDFs instantly and get e-signatures from both parties.",
    color: "from-indigo-500 to-purple-500",
    gradient: "bg-gradient-to-br from-indigo-500/20 to-purple-500/10",
    border: "group-hover:border-indigo-500/50",
    link: "/about#agreements"
  }
];

interface Stats {
  totalProperties: number;
  totalTenants: number;
  totalLandlords: number;
  totalAgreements: number;
}

function HowItWorks() {
  const [stats, setStats] = useState<Stats>({
    totalProperties: 0,
    totalTenants: 0,
    totalLandlords: 0,
    totalAgreements: 0,
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Fetch stats from backend
      const statsResponse = await apiClient.get<Stats>("/api/properties/stats");
      // console.log(statsResponse)
      setStats({
        totalProperties: statsResponse.totalProperties || 0,
        totalTenants: statsResponse.totalTenants || 0,
        totalLandlords: statsResponse.totalLandlords || 0,
        totalAgreements: statsResponse.totalAgreements || 0,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
      toast.error("Error loading statistics");
      // Fallback to mock data
      setStats({
        totalProperties: 150,
        totalTenants: 380,
        totalLandlords: 52,
        totalAgreements: 45,
      });
    } finally {
      setIsLoadingStats(false);
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
      icon: Home 
    },
    { 
      label: "Happy Tenants", 
      value: stats.totalTenants,
      formattedValue: formatNumber(stats.totalTenants),
      icon: Shield 
    },
    { 
      label: "Verified Owners", 
      value: stats.totalLandlords,
      formattedValue: formatNumber(stats.totalLandlords),
      icon: Search 
    },
    { 
      label: "Agreements Generated", 
      value: stats.totalAgreements,
      formattedValue: formatNumber(stats.totalAgreements),
      icon: FileText 
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge 
            variant="outline" 
            className="mb-4 px-4 py-1 text-purple-400 border-purple-500/50 bg-purple-500/10 backdrop-blur-sm"
          >
            How It Works
          </Badge>
          <h2 className={cn("text-4xl md:text-5xl font-bold mb-4 text-white", styles.sectionTitle)}>
            Your Journey to <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Finding Home</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Experience a seamless rental journey powered by modern technology
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -8 }}
                className={cn(
                  "group relative p-6 rounded-2xl transition-all duration-300 cursor-pointer",
                  "backdrop-blur-xl bg-white/5 border border-white/10",
                  "hover:bg-white/10 hover:border-white/20",
                  step.border
                )}
              >
                {/* Glassmorphism Effect */}
                <div className={cn(
                  "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                  step.gradient
                )} />
                
                {/* Step Number */}
                <div className="absolute top-4 right-4 text-5xl font-bold text-white/5 group-hover:text-white/10 transition-colors">
                  {String(index + 1).padStart(2, '0')}
                </div>

                {/* Icon Container */}
                <div className={cn(
                  "w-14 h-14 rounded-xl bg-gradient-to-r mb-5 flex items-center justify-center relative",
                  step.color,
                  "shadow-lg shadow-purple-500/20"
                )}>
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all">
                  {step.title}
                </h3>
                <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                  {step.description}
                </p>

                {/* Learn More Link */}
                <Link 
                  href={step.link}
                  className="inline-flex items-center text-sm text-gray-400 hover:text-white font-medium group/link transition-colors"
                >
                  Learn more 
                  <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover/link:translate-x-1 transition-transform" />
                </Link>

                {/* Decorative Line */}
                <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </motion.div>
            );
          })}
        </div>

        {/* Stats Section - Dynamic */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {statItems.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="group text-center p-6 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {isLoadingStats ? (
                    <div className="flex justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                    </div>
                  ) : (
                    stat.formattedValue
                  )}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            );
          })}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-20"
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-xl border border-white/10 p-12 text-center">
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full blur-3xl animate-pulse" />
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>
            
            <div className="relative z-10">
              <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Ready to Find Your Dream Home?
              </h3>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of happy tenants and landlords who found their perfect match with UrbanKey
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/properties/search">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 shadow-lg shadow-purple-500/25"
                  >
                    Start Searching
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/auth/register?role=landlord">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white/20 text-primary hover:text-white hover:bg-white/10 hover:border-white/30 px-8"
                  >
                    List Your Property
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default HowItWorks;