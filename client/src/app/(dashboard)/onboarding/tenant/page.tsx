'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { Home, Shield, CheckCircle, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { Progress } from '@/components/ui/progress';
import { DocumentUpload } from '@/components/onboarding/DocumentUpload';
import { ProfileForm } from '@/components/onboarding/ProfileForm';
import { updateUserRole, uploadVerificationDocument } from '@/app/actions/auth';
import { cn } from '@/lib/utils';
import { apiClient } from '@/lib/api-client';

type Step = 'profile' | 'documents' | 'preferences' | 'complete';

export default function TenantOnboarding() {
  const { getToken } = useAuth();
  const router = useRouter();
  const { user } = useUser();
  const [currentStep, setCurrentStep] = useState<Step>('profile');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const steps = [
    { id: 'profile', label: 'Profile', icon: Home },
    { id: 'documents', label: 'Documents', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Home },
    { id: 'complete', label: 'Complete', icon: CheckCircle },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  
    const handleProfileSubmit = async (data: any) => {
      try {
        // 1. Update Clerk metadata with tenant role
        const formData = new FormData();
        formData.append('role', 'tenant');
        formData.append('fullName', data.fullName);
        formData.append('phone', data.phone);
        
        const result = await updateUserRole(formData);
        
        if (result.success) {
          // 2. EXPLICITLY SYNC TO BACKEND HERE
          const token = await getToken();
          
          await apiClient.post(
            "/api/users/sync",
            {
              email: user?.primaryEmailAddress?.emailAddress,
              fullName: data.fullName,
              phone: data.phone,
              avatarUrl: user?.imageUrl,
              role: 'tenant',
            },
            token
          );
          
          console.log("✅ Tenant synced to backend during onboarding");
          
          setCompletedSteps(prev => [...prev, 'profile']);
          setCurrentStep('documents');
        }
      } catch (error) {
        console.error('Profile submission error:', error);
      }
    };

  const handleDocumentUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('documentType', 'aadhar');
    formData.append('file', file);
    
    const result = await uploadVerificationDocument(formData);
    
    if (result.success) {
      setCompletedSteps(prev => [...prev, 'documents']);
      setCurrentStep('preferences');
    }
  };

  const handlePreferencesSubmit = async () => {
    // Save preferences to backend
    setCompletedSteps(prev => [...prev, 'preferences']);
    setCurrentStep('complete');
  };

  const handleComplete = () => {
    // Final sync to ensure everything is up to date
    const finalSync = async () => {
      const token = await getToken();
      await apiClient.post(
        "/api/users/sync",
        {
          email: user?.primaryEmailAddress?.emailAddress,
          fullName: user?.fullName,
          avatarUrl: user?.imageUrl,
          role: 'tenant',
          onboardingCompleted: true
        },
        token
      );
    };
    
    finalSync();
    router.push('/properties/search');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Welcome to UrbanKey, {user?.firstName}!
          </h1>
          <p className="text-gray-600 mt-2">
            Let's set up your tenant profile in a few steps
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-2">
            {steps.map((step, idx) => {
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
              <ProfileForm role="tenant" onSubmit={handleProfileSubmit} />
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
                description="Upload a clear image of your Aadhar card (front & back)"
                documentType="aadhar"
                onUpload={handleDocumentUpload}
                onSkip={() => {
                  setCompletedSteps(prev => [...prev, 'documents']);
                  setCurrentStep('preferences');
                }}
              />

              <p className="text-xs text-gray-500 text-center mt-4">
                Your documents are encrypted and securely stored
              </p>
            </div>
          )}

          {currentStep === 'preferences' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold">Your Preferences</h2>
                <p className="text-gray-600">Help us find your perfect home</p>
              </div>

              <div className="space-y-4">
                {/* Add preference form here */}
                <Button onClick={handlePreferencesSubmit} className="w-full">
                  Continue to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
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