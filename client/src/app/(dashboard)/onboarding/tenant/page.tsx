'use client';

import {   useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useAuth } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { Home, Shield, CheckCircle, ArrowRight, User, Phone, MapPin, Calendar, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Progress } from '@/components/ui/progress';
import { DocumentUpload } from '@/components/onboarding/DocumentUpload';
import { OnboardingProvider, useOnboarding } from '@/contexts/OnboardingContext';
import { apiClient } from '@/lib/api/api-client';
import { updateUserRole } from '@/app/actions/auth';
import { cn } from '@/lib/utils';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const steps = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'documents', label: 'Documents', icon: Shield },
  { id: 'preferences', label: 'Preferences', icon: Home },
  { id: 'complete', label: 'Complete', icon: CheckCircle },
];

function TenantOnboardingContent() {
  const router = useRouter();
  const { user } = useUser();
  const { getToken } = useAuth();
  const { currentStep, completedSteps, data,isLoading, completeStep, goToNextStep, finishOnboarding,setStep } = useOnboarding();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: data?.fullName || user?.fullName || '',
    phone: data?.phone || '',
    preferredLocations: data?.preferredLocations || '',
    maxBudget: data?.maxBudget || '',
    moveInDate: data?.moveInDate || '',
  });

  

  // Show loader while initial data is loading
  if (isLoading) {
    return <LoadingSpinner/>  ;
  }

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Update Clerk metadata
      const formDataObj = new FormData();
      formDataObj.append('role', 'tenant');
      formDataObj.append('fullName', formData.fullName);
      formDataObj.append('phone', formData.phone);
      
      await updateUserRole(formDataObj);

      // Sync to backend
      const token = await getToken();
      await apiClient.post(
        '/api/users/sync',
        {
          email: user?.primaryEmailAddress?.emailAddress,
          fullName: formData.fullName,
          phone: formData.phone,
          avatarUrl: user?.imageUrl,
          role: 'TENANT',
        },
        token
      );

      await completeStep('profile', formData);
      await goToNextStep();
    } catch (error) {
      console.error('Profile submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentUpload = async (file: File) => {
    setLoading(true);
    try {
      // Create FormData for server action
      const uploadData = new FormData();
    uploadData.append('documentType', 'aadhar');
    uploadData.append('file', file);
      // Sync with backend
      const token = await getToken();
      
       // Upload directly to backend API (bypasses Server Action)
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/documents/upload`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type - browser will set it with boundary
        },
        body: uploadData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Upload failed');
    }

    const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Upload failed');
      }
  
      console.log('Document uploaded successfully:', result.document);
      
      
      await apiClient.post(
        '/api/users/sync',
        {
          email: user?.primaryEmailAddress?.emailAddress,
          fullName:  user?.fullName || user?.username,
          role: 'TENANT',
          verificationDocs: {
            aadhar: {
              url: result.document.fileUrl,
              status: 'PENDING',
              uploadedAt: new Date().toISOString(),
            }
          }
        },
        token
      );
      
      await completeStep('documents', { 
        documentUploaded: true,
        documentUrl: result.document.fileUrl,
        documentStatus: result.document.status
      });
      
      await goToNextStep();
    } catch (error) {
      console.error('Document upload error:', error);
      // Show error to user
      alert('Failed to upload document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePreferencesSubmit = async () => {
    setLoading(true);
    try {
      await completeStep('preferences', {
        preferredLocations: formData.preferredLocations,
        maxBudget: formData.maxBudget,
        moveInDate: formData.moveInDate,
      });
      await goToNextStep();
    } catch (error) {
      console.error('Preferences submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    await finishOnboarding('tenant');
    router.push('/properties/search');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Welcome to UrbanKey!
          </h1>
          <p className="text-gray-600 mt-2">
            Let's set up your tenant profile in a few steps
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-2">
            {steps.map((step) => {
              const StepIcon = step.icon;
              const isCompleted = completedSteps.includes(step.id);
              const isActive = currentStep === step.id;
              
              return (
                <div
                  key={step.id}
                  className={cn(
                    "flex flex-col items-center text-xs",
                    isActive ? "text-blue-600 font-medium" : 
                    isCompleted ? "text-green-600" : "text-gray-400"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center mb-1",
                    isActive ? "bg-blue-100 text-blue-600" :
                    isCompleted ? "bg-green-100 text-green-600" :
                    "bg-gray-100 text-gray-400"
                  )}>
                    {isCompleted ? <CheckCircle className="h-4 w-4" /> : <StepIcon className="h-4 w-4" />}
                  </div>
                  <span>{step.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-2xl shadow-xl p-6"
        >
          {currentStep === 'profile' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold">Complete Your Profile</h2>
                <p className="text-gray-600">Tell us a bit about yourself</p>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="pl-10"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="pl-10"
                      placeholder="+91 98765 43210"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save & Continue'
                  )}
                </Button>
              </form>
            </div>
          )}

          {currentStep === 'documents' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold">Verification Documents</h2>
                <p className="text-gray-600">Upload your Aadhar card for verification</p>
              </div>
              
              <DocumentUpload
                title="Aadhar Card"
                description="Upload a clear image of your Aadhar card"
                documentType="aadhar"
                onUpload={handleDocumentUpload}
                // onSkip={() => {
                //   completeStep('documents', { skipped: true });
                //   goToNextStep();
                // }}
              />
            </div>
          )}

          {currentStep === 'preferences' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold">Your Preferences</h2>
                <p className="text-gray-600">Help us find your perfect home</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="preferredLocations">Preferred Locations</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="preferredLocations"
                      value={formData.preferredLocations}
                      onChange={handleChange}
                      className="pl-10"
                      placeholder="e.g., Whitefield, Indiranagar"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="maxBudget">Max Budget (₹)</Label>
                    <Input
                      id="maxBudget"
                      type="number"
                      value={formData.maxBudget}
                      onChange={handleChange}
                      placeholder="50000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="moveInDate">Move-in Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="moveInDate"
                        type="date"
                        value={formData.moveInDate}
                        onChange={handleChange}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <Button onClick={handlePreferencesSubmit} className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Continue'
                  )}
                </Button>
              </div>
            </div>
          )}

          {currentStep === 'complete' && (
            <div className="text-center py-8 space-y-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold">You're All Set!</h2>
              <p className="text-gray-600">
                Your profile is complete. Start exploring properties that match your preferences.
              </p>
              <Button onClick={handleComplete} size="lg" className="mt-4">
                Start Browsing Properties
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default function TenantOnboardingPage() {
  return (
    <OnboardingProvider >
      <TenantOnboardingContent />
    </OnboardingProvider>
  );
}