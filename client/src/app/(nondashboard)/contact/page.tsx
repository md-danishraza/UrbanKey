'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaXTwitter, 
  FaLinkedin, 
  FaInstagram, 
  FaFacebook 
} from 'react-icons/fa6';

import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle, 
  AlertCircle,
  MessageCircle,
 
} from 'lucide-react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api/api-client';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Valid email is required'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      await apiClient.post('/api/contact/contact', data);
      setIsSuccess(true);
      reset();
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error: any) {
      console.error('Failed to send message:', error);
      toast.error(error.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      details: 'support@urbankey.com',
      description: 'Get a response within 24-48 hours',
      action: 'mailto:support@urbankey.com',
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: '+91 98765 43210',
      description: 'Mon-Fri, 9 AM - 6 PM IST',
      action: 'tel:+919876543210',
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: 'New Delhi',
      description: 'India',
      action: null,
    },
    {
      icon: Clock,
      title: 'Support Hours',
      details: '24/7 Online Support',
      description: 'Email support available round the clock',
      action: null,
    },
  ];

  const socialLinks = [
    { icon: MessageCircle, href: 'https://wa.me/919876543210', label: 'WhatsApp', color: 'hover:bg-green-600' },
    { icon: FaXTwitter, href: 'https://twitter.com/urbankey', label: 'Twitter', color: 'hover:bg-[#1da1f2]' },
    { icon: FaLinkedin, href: 'https://linkedin.com/company/urbankey', label: 'LinkedIn', color: 'hover:bg-[#0a66c2]' },
    { icon: FaInstagram, href: 'https://instagram.com/urbankey', label: 'Instagram', color: 'hover:bg-gradient-to-tr from-[#f09433] to-[#bc1888]' },
    { icon: FaFacebook, href: 'https://facebook.com/urbankey', label: 'Facebook', color: 'hover:bg-[#1877f2]' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Get in <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Touch</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8"
          >
            <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
            
            {isSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-green-700">Message sent successfully! We'll get back to you soon.</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  {...register('name')}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  {...register('email')}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  {...register('phone')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  {...register('subject')}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    errors.subject ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="How can we help you?"
                />
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-500">{errors.subject.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  {...register('message')}
                  rows={5}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none ${
                    errors.message ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Tell us about your query..."
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-semibold mb-4">Let's Talk</h2>
              <p className="text-blue-100 mb-6">
                We're here to help! Choose your preferred way to reach us.
              </p>
              
              <div className="space-y-4">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">{info.title}</p>
                        {info.action ? (
                          <a href={info.action} className="text-sm text-blue-100 hover:text-white transition">
                            {info.details}
                          </a>
                        ) : (
                          <p className="text-sm text-blue-100">{info.details}</p>
                        )}
                        <p className="text-xs text-blue-200 mt-1">{info.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
              <div className="flex gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center transition-all duration-300 hover:scale-110 ${social.color} hover:text-white`}
                      aria-label={social.label}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* FAQ Prompt */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Quick Answers</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Check our FAQ page for answers to common questions.
                  </p>
                  <a
                    href="/faqs"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
                  >
                    Visit FAQs
                    <span className="text-lg">→</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}