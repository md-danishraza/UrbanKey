'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import Link from 'next/link';

import { PropertyForm } from '@/components/properties/PropertyForm';
import { apiClient } from '@/lib/api/api-client';
import { Property } from '@/types';

export default function CreatePropertyPage() {
  const router = useRouter();
  const { getToken } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (formData: any, images: File[]) => {
    setIsSubmitting(true);
    setSubmitStatus('loading');
    
    // Show loading toast
    const loadingToast = toast.loading('Creating your property...');
    
    try {
      const token = await getToken();
      
      // First, create the property
      const property: Property = await apiClient.post('/api/properties', formData, token);
      
      // Then, upload images if any
      if (images.length > 0) {
        const formDataWithImages = new FormData();
        images.forEach(image => {
          formDataWithImages.append('images', image);
        });
        
        const uploadResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/images/properties/${property.id}/images`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formDataWithImages,
          }
        );
        
        if (!uploadResponse.ok) {
          throw new Error('Image upload failed');
        }
      }
      
      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      setSubmitStatus('success');
      toast.success('Property created successfully!', {
        icon: <CheckCircle className="h-4 w-4 text-green-500" />,
        duration: 3000,
      });
      
      // Small delay before redirect for better UX
      setTimeout(() => {
        router.push('/landlord/properties');
      }, 1500);
    } catch (error) {
      console.error('Failed to create property:', error);
      toast.dismiss(loadingToast);
      setSubmitStatus('error');
      toast.error('Failed to create property. Please try again.', {
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
      // Reset status after a delay
      setTimeout(() => setSubmitStatus('idle'), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with back button and status */}
        <div className="mb-6 flex items-center justify-between">
          <Link 
            href="/landlord/properties" 
            className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Properties
          </Link>
          
          {/* Status Indicator */}
          {submitStatus === 'loading' && (
            <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full animate-in fade-in slide-in-from-right-5">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Creating property...</span>
            </div>
          )}
          
          {submitStatus === 'success' && (
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full animate-in fade-in slide-in-from-right-5">
              <CheckCircle className="h-3 w-3" />
              <span>Property created!</span>
            </div>
          )}
          
          {submitStatus === 'error' && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-1 rounded-full animate-in fade-in slide-in-from-right-5">
              <span>Creation failed</span>
            </div>
          )}
        </div>
        
        {/* Main Form Card */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="border-b border-gray-100 px-6 py-4">
            <h1 className="text-2xl font-bold">List a New Property</h1>
            <p className="text-gray-500 text-sm mt-1">
              Fill in the details below to list your property
            </p>
          </div>
          
          <div className="p-6">
            <PropertyForm 
              onSubmit={handleSubmit}
              isLoading={isSubmitting}
            />
          </div>
        </div>
        
        {/* Tips Card */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-100">
          <h3 className="font-semibold text-blue-800 mb-2">💡 Tips for a great listing</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Add high-quality photos of each room</li>
            <li>• Include amenities like parking, power backup, and water supply</li>
            <li>• Mention nearby metro stations and landmarks</li>
            <li>• Be accurate about rent and deposit amounts</li>
          </ul>
        </div>
        
        {/* Success Overlay (Optional) */}
        {submitStatus === 'success' && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 animate-in fade-in">
            <div className="bg-white rounded-xl p-6 text-center shadow-xl max-w-sm mx-4 animate-in zoom-in-95">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Property Created!</h3>
              <p className="text-gray-600 text-sm mb-4">
                Your property has been listed successfully.
                Redirecting to properties page...
              </p>
              <div className="w-full bg-gray-200 rounded-full h-1 overflow-hidden">
                <div className="h-full bg-green-500 rounded-full animate-progress" style={{ width: '100%', animation: 'progress 1.5s linear forwards' }} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}