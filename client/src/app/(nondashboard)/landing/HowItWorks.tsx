"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Search, 
  CalendarCheck, 
  Home,
  MessageCircle,
  Shield,
  CreditCard,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import styles from "@/styles/Landing.module.css";

const steps = [
  {
    icon: Search,
    title: "Search Properties",
    description: "Filter by location, budget, BHK, and amenities. Use our AI-powered search to find your perfect match.",
    color: "from-blue-500 to-cyan-500",
    link: "/properties/search"
  },
  {
    icon: CalendarCheck,
    title: "Schedule Visit",
    description: "Book virtual or physical tours at your convenience. Get instant confirmation from landlords.",
    color: "from-purple-500 to-pink-500",
    link: "/how-it-works#schedule"
  },
  {
    icon: MessageCircle,
    title: "Connect on WhatsApp",
    description: "Chat directly with owners via WhatsApp. Negotiate terms and clear doubts instantly.",
    color: "from-green-500 to-emerald-500",
    link: "/how-it-works#connect"
  },
  {
    icon: Shield,
    title: "Verify Documents",
    description: "Our team verifies all documents. Rent agreements are generated automatically.",
    color: "from-orange-500 to-red-500",
    link: "/how-it-works#verify"
  },
  {
    icon: CreditCard,
    title: "Secure Payment",
    description: "Pay rent and deposit securely online. Get instant receipts and track payments.",
    color: "from-indigo-500 to-purple-500",
    link: "/how-it-works#payment"
  },
  {
    icon: Home,
    title: "Move In",
    description: "Get your keys and move in hassle-free. We're here to help even after you move.",
    color: "from-rose-500 to-pink-500",
    link: "/how-it-works#movein"
  }
];

function HowItWorks() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full filter blur-3xl opacity-30" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-100 rounded-full filter blur-3xl opacity-30" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 px-4 py-1 text-purple-600 border-purple-200 bg-purple-50">
            Simple Process
          </Badge>
          <h2 className={cn("text-3xl md:text-4xl font-bold mb-4", styles.sectionTitle)}>
            How Urban Key Works
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your journey to finding the perfect home, simplified in 6 easy steps
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={cn(
                  "relative p-8 rounded-2xl border border-gray-100",
                  styles.stepCard
                )}
              >
                {/* Step Number */}
                <div className={cn("text-6xl mb-4 opacity-10", styles.stepNumber)}>
                  {index + 1}
                </div>

                {/* Icon Container */}
                <div className={cn(
                  "w-16 h-16 rounded-2xl bg-gradient-to-r mb-6 flex items-center justify-center",
                  step.color,
                  styles.floating
                )}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-600 mb-4">{step.description}</p>

                {/* Learn More Link - Now navigates to about page with section */}
                <Link 
                  href={`/about${step.link.split('#')[1] ? '#' + step.link.split('#')[1] : ''}`}
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium group"
                >
                  Learn more 
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">Ready to Find Your Dream Home?</h3>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of happy tenants who found their perfect home with Urban Key
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/properties/search">
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8"
                >
                  Start Searching
                </Button>
              </Link>
              <Link href="/auth/register?role=landlord">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-primary hover:text-white hover:bg-white/10 px-8"
                >
                  List Your Property
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default HowItWorks;