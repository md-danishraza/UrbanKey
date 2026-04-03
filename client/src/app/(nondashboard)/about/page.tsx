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
  Brain,
  FileSignature,
  Sparkles,
  ArrowLeft,
  CheckCircle,

  TrendingUp,

} from "lucide-react";
import Logo from "@/components/Logo";
import { StatsLight } from "@/components/common/StatsLight";

export default function AboutPage() {
 

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Search",
      description: "Find properties using natural language. Just describe what you're looking for, and our AI finds the perfect match.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Shield,
      title: "Verified Profiles",
      description: "Mandatory Aadhar verification for tenants and landlords ensures a trusted, fraud-free community.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: FileSignature,
      title: "Digital Agreements",
      description: "Generate legally compliant rent agreements instantly with e-signature support for both parties.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: MessageCircle,
      title: "WhatsApp Integration",
      description: "Chat directly with property owners via WhatsApp. Instant communication for faster decisions.",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: CalendarCheck,
      title: "Smart Scheduling",
      description: "Book property visits online. Get instant confirmation and reminders for your appointments.",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: TrendingUp,
      title: "Payment Tracking",
      description: "Track rent payments, security deposits, and get digital receipts for all transactions.",
      color: "from-rose-500 to-pink-500"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white pt-4">
      <div className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center text-rose-600 hover:text-blue-700 mb-8 group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-6">
           
              <Logo height={400} width={200}/>
          
          </div>
          <Badge className="mb-4 px-4 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-blue-200">
            About UrbanKey
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Revolutionizing Rentals in{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              India
            </span>
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            UrbanKey is India's first AI-powered, broker-free rental platform connecting verified tenants 
            directly with verified landlords. We're making renting simple, transparent, and trustworthy.
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
          
        >
          <StatsLight/>
        </motion.div>

        {/* Our Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 mb-20 text-white"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Mission</h2>
            <p className="text-blue-100 max-w-2xl mx-auto">
              To democratize the rental market by eliminating brokerage, leveraging AI for better matches, 
              and building a trusted community of verified tenants and landlords.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">Zero Brokerage</h3>
              <p className="text-sm text-blue-100">Direct owner listings with no hidden fees</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">AI-Powered</h3>
              <p className="text-sm text-blue-100">Smart search and personalized recommendations</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">Fully Verified</h3>
              <p className="text-sm text-blue-100">KYC verification for all users and properties</p>
            </div>
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose UrbanKey?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We've built features that make renting easier, faster, and more transparent for everyone.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Process Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How UrbanKey Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Your journey to finding the perfect home, simplified in 6 easy steps.
            </p>
          </div>

          <div className="space-y-8">
            {[
              {
                id: "search",
                icon: Search,
                title: "1. Search Properties",
                description: "Use our AI-powered search to find properties that match your preferences. Search by location, budget, BHK, and amenities.",
                details: [
                  "AI-powered semantic search",
                  "Real-time availability",
                  "Save to wishlist",
                  "Get alerts for new listings"
                ]
              },
              {
                id: "schedule",
                icon: CalendarCheck,
                title: "2. Schedule Visit",
                description: "Book visits at your convenience. Choose between physical tours or virtual calls.",
                details: [
                  "Flexible timing options",
                  "Virtual tours available",
                  "Instant confirmation",
                  "Calendar integration"
                ]
              },
              {
                id: "connect",
                icon: MessageCircle,
                title: "3. Connect on WhatsApp",
                description: "Chat directly with property owners via WhatsApp. Discuss details and clear doubts instantly.",
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
                description: "Complete Aadhar verification and document submission for a trusted rental experience.",
                details: [
                  "Document verification by experts",
                  "Digital rent agreements",
                  "e-signature support",
                  "Legal compliance check"
                ]
              },
              {
                id: "agree",
                icon: FileSignature,
                title: "5. Sign Agreement",
                description: "Review and sign the digitally generated rent agreement. Both parties sign online.",
                details: [
                  "Legally compliant templates",
                  "Customizable terms",
                  "PDF download available",
                  "E-signature support"
                ]
              },
              {
                id: "movein",
                icon: Home,
                title: "6. Move In",
                description: "Get your keys and move in hassle-free. Track payments and maintenance requests.",
                details: [
                  "Move-in checklist",
                  "Payment tracking",
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
                  <div className="flex flex-col md:flex-row items-start gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-3">{step.title}</h2>
                      <p className="text-gray-600 mb-4">{step.description}</p>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {step.details.map((detail, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 text-green-500" />
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
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for India, by Indians</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            We understand the unique challenges of the Indian rental market and have designed UrbanKey 
            to address them with technology and transparency.
          </p>
          <Link href="/properties/search">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8">
              Start Your Search Now
            </Button>
          </Link>
        </motion.div>

        {/* Footer Note */}
        <div className="text-center text-sm text-gray-400 mt-16 pt-8 border-t border-gray-200">
          <p>© 2026 UrbanKey. All rights reserved. Made with ❤️ in India.</p>
        </div>
      </div>
    </div>
  );
}