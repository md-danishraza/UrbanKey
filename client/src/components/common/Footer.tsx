'use client';

import Link from 'next/link';
import { 
  Home, 
  Building2, 
  Users, 
  FileText, 
  HelpCircle, 
  Shield, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Youtube,
  ArrowRight,
  Heart
} from 'lucide-react';
import Logo from '../Logo';

const navigation = {
  explore: [
    { name: 'Search Properties', href: '/properties/search', icon: Home },
    { name: 'How It Works', href: '/about', icon: Building2 },
    { name: 'For Tenants', href: '/tenant/dashboard', icon: Users },
    { name: 'For Landlords', href: '/landlord/dashboard', icon: FileText },
  ],
  resources: [
    { name: 'FAQs', href: '/faqs', icon: HelpCircle },
    { name: 'About Us', href: '/about', icon: Users },
    { name: 'Contact', href: '/contact', icon: Mail },
    { name: 'Blog', href: '/blog', icon: FileText },
  ],
  legal: [
    { name: 'Terms & Conditions', href: '/terms', icon: Shield },
    { name: 'Privacy Policy', href: '/privacy', icon: Shield },
    { name: 'Cookie Policy', href: '/cookies', icon: Shield },
    { name: 'Disclaimer', href: '/disclaimer', icon: Shield },
  ],
};

const socialLinks = [
  { name: 'Facebook', href: 'https://facebook.com/urbankey', icon: Facebook, color: 'hover:bg-[#1877f2]' },
  { name: 'Twitter', href: 'https://twitter.com/urbankey', icon: Twitter, color: 'hover:bg-[#1da1f2]' },
  { name: 'LinkedIn', href: 'https://linkedin.com/company/urbankey', icon: Linkedin, color: 'hover:bg-[#0a66c2]' },
  { name: 'Instagram', href: 'https://instagram.com/urbankey', icon: Instagram, color: 'hover:bg-gradient-to-tr from-[#f09433] to-[#bc1888]' },
  { name: 'YouTube', href: 'https://youtube.com/urbankey', icon: Youtube, color: 'hover:bg-[#ff0000]' },
];

const contactInfo = [
  { icon: MapPin, text: 'New Delhi, India', href: null },
  { icon: Mail, text: 'support@urbankey.com', href: 'mailto:support@urbankey.com' },
  { icon: Phone, text: '+91 98765 43210', href: 'tel:+919876543210' },
];

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-1 space-y-4">
            <Link href="/" className="inline-block">
              <Logo />
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed">
              India's first AI-powered, broker-free rental platform connecting verified tenants directly with verified landlords.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-9 h-9 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center transition-all duration-300 hover:scale-110 ${social.color} hover:text-white`}
                    aria-label={social.name}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Explore Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Explore
            </h3>
            <ul className="space-y-3">
              {navigation.explore.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-gray-600 hover:text-rose-600 text-sm transition-colors duration-200 flex items-center gap-2 group"
                    >
                      <Icon className="w-4 h-4 opacity-80 group-hover:opacity-100 transition-opacity" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Resources Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              {navigation.resources.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-gray-600 hover:text-rose-600 text-sm transition-colors duration-200 flex items-center gap-2 group"
                    >
                      <Icon className="w-4 h-4 opacity-80 group-hover:opacity-100 transition-opacity" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Legal Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              {navigation.legal.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-gray-600 hover:text-rose-600 text-sm transition-colors duration-200 flex items-center gap-2 group"
                    >
                      <Icon className="w-4 h-4 opacity-80 group-hover:opacity-100 transition-opacity" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              {contactInfo.map((item, index) => {
                const Icon = item.icon;
                const content = item.href ? (
                  <a href={item.href} className="text-gray-600 hover:text-rose-600 text-sm transition-colors">
                    {item.text}
                  </a>
                ) : (
                  <span className="text-gray-600 text-sm">{item.text}</span>
                );
                return (
                  <li key={index} className="flex items-start gap-3">
                    <Icon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    {content}
                  </li>
                );
              })}
            </ul>

            {/* Newsletter Signup */}
            <div className="mt-6">
              <p className="text-sm font-medium text-gray-900 mb-2">Subscribe to our newsletter</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-r-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <span>© {currentYear} UrbanKey. All rights reserved.</span>
            <span className="hidden md:inline">•</span>
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-red-500 animate-pulse" /> in India
            </span>
          </div>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-rose-600 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-rose-600 transition-colors">
              Terms
            </Link>
            <Link href="/sitemap" className="hover:text-rose-600 transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}