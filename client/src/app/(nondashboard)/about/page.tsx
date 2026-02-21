"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  Search, 
  CalendarCheck, 
  Home,
  MessageCircle,
  Shield,
  CreditCard,
  ArrowLeft
} from "lucide-react";

export default function AboutPage() {
  // Get hash from URL to scroll to specific section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-4">
      <div className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8 group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 px-4 py-1 bg-blue-100 text-blue-800 border-blue-200">
            About Us
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            How Urban Key Works
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're revolutionizing the rental market in India with transparency, 
            technology, and trust.
          </p>
        </motion.div>

        {/* Process Details */}
        <div className="max-w-4xl mx-auto space-y-8">
          {[
            {
              id: "search",
              icon: Search,
              title: "1. Search Properties",
              description: "Use our advanced filters to find properties that match your preferences. Search by location, budget, BHK type, furnishing, and specific amenities like 24/7 water supply, power backup, or IGL pipeline.",
              details: [
                "AI-powered search recommendations",
                "Real-time availability updates",
                "Save your favorite properties",
                "Get alerts for new listings"
              ]
            },
            {
              id: "schedule",
              icon: CalendarCheck,
              title: "2. Schedule Visit",
              description: "Book visits at your convenience. Choose between physical tours or virtual video calls. Get instant confirmation and reminders.",
              details: [
                "Flexible timing options",
                "Virtual tour available",
                "Instant booking confirmation",
                "Calendar integration"
              ]
            },
            {
              id: "connect",
              icon: MessageCircle,
              title: "3. Connect on WhatsApp",
              description: "Chat directly with property owners via WhatsApp. No need to switch between apps. Discuss details, negotiate rent, and clear doubts instantly.",
              details: [
                "One-click WhatsApp chat",
                "Pre-filled property details",
                "Save chat history",
                "Quick response tracking"
              ]
            },
            {
              id: "verify",
              icon: Shield,
              title: "4. Verify Documents",
              description: "We verify all property documents and owner credentials. Get auto-generated rent agreements that are legally compliant.",
              details: [
                "Document verification by experts",
                "Digital rent agreement",
                "e-signature support",
                "Legal compliance check"
              ]
            },
            {
              id: "payment",
              icon: CreditCard,
              title: "5. Secure Payment",
              description: "Pay rent and deposits securely through our platform. Track all payments and get instant receipts.",
              details: [
                "Multiple payment options",
                "Secure transactions",
                "Payment history tracking",
                "Automated rent reminders"
              ]
            },
            {
              id: "movein",
              icon: Home,
              title: "6. Move In",
              description: "Get your keys and move in hassle-free. We provide post-move support for any issues.",
              details: [
                "Move-in checklist",
                "Utility connections support",
                "Maintenance requests",
                "24/7 customer support"
              ]
            }
          ].map((step, index) => {
            const Icon = step.icon;
            
            return (
              <motion.div
                key={step.id}
                id={step.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 scroll-mt-24"
              >
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-3">{step.title}</h2>
                    <p className="text-gray-600 mb-4">{step.description}</p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {step.details.map((detail, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <Link href="/properties/search">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8">
              Start Your Search Now
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}