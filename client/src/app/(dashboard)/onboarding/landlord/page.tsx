'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { Building2, Shield, CheckCircle, ArrowRight, FileText } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { DocumentUpload } from '@/components/onboarding/DocumentUpload';
import { ProfileForm } from '@/components/onboarding/ProfileForm';
import { updateUserRole, uploadVerificationDocument } from '@/app/actions/auth';
import { cn } from '@/lib/utils';
import { apiClient } from '@/lib/api-client';

type Step = 'profile' | 'documents' | 'agreement' | 'complete';

export default function LandlordOnboarding() {
  const { getToken } = useAuth();
  const router = useRouter();
  const { user } = useUser();
  const [currentStep, setCurrentStep] = useState<Step>('profile');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const steps = [
    { id: 'profile', label: 'Profile', icon: Building2 },
    { id: 'documents', label: 'Documents', icon: Shield },
    { id: 'agreement', label: 'Agreement', icon: FileText },
    { id: 'complete', label: 'Complete', icon: CheckCircle },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleProfileSubmit = async (data: any) => {
    try {
      // 1. Update Clerk metadata with landlord role
      const formData = new FormData();
      formData.append('role', 'landlord');
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
            role: 'landlord',
          },
          token
        );
        
        console.log("✅ Landlord synced to backend during onboarding");
        
        setCompletedSteps(prev => [...prev, 'profile']);
        setCurrentStep('documents');
      }
    } catch (error) {
      console.error('Profile submission error:', error);
    }
  };

  // After document upload:
const handleDocumentUpload = async (file: File) => {
  const formData = new FormData();
  formData.append('documentType', 'aadhar');
  formData.append('file', file);
  
  const result = await uploadVerificationDocument(formData);
  
  if (result.success) {
    // Update backend with verification status
    const token = await getToken();
    await apiClient.post(
      "/api/users/sync",
      {
        email: user?.primaryEmailAddress?.emailAddress,
        role: 'landlord',
        verificationDocs: {
          aadhar: {
            uploadedAt: new Date().toISOString(),
            status: 'pending'
          }
        }
      },
      token
    );
    
    setCompletedSteps(prev => [...prev, 'documents']);
    setCurrentStep('agreement');
  }
};



  const handleAgreementSubmit = async () => {
    // Sign landlord agreement
    setCompletedSteps(prev => [...prev, 'agreement']);
    setCurrentStep('complete');
  };


      // Update handleComplete function:
    const handleComplete = () => {
      // Final sync before redirect
      const finalSync = async () => {
        const token = await getToken();
        await apiClient.post(
          "/api/users/sync",
          {
            email: user?.primaryEmailAddress?.emailAddress,
            fullName: user?.fullName,
            avatarUrl: user?.imageUrl,
            role: 'landlord',
            onboardingCompleted: true,
            verified: 'pending' // Set verification status
          },
          token
        );
      };
      
      finalSync();
      router.push('/landlord/dashboard');
    };

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Welcome to UrbanKey, {user?.firstName}!
          </h1>
          <p className="text-gray-600 mt-2">
            Let's get you verified and ready to list properties
          </p>
        </motion.div>

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
                    isActive ? "text-purple-600 font-medium" : 
                    isCompleted ? "text-green-600" : "text-gray-400"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center mb-1",
                    isActive ? "bg-purple-100 text-purple-600" :
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
                <p className="text-gray-600">Tell us about your property experience</p>
              </div>
              <ProfileForm role="landlord" onSubmit={handleProfileSubmit} />
            </div>
          )}

          {currentStep === 'documents' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold">Verification Documents</h2>
                <p className="text-gray-600">Upload documents to verify your identity</p>
              </div>
              
              <DocumentUpload
                title="Aadhar Card"
                description="Upload a clear image of your Aadhar card"
                documentType="aadhar"
                onUpload={handleDocumentUpload}
              />

              <DocumentUpload
                title="Property Documents (Optional)"
                description="Upload ownership documents or rental agreements"
                documentType="property"
                onUpload={async () => {}}
                onSkip={() => {}}
              />
            </div>
          )}

          {currentStep === 'agreement' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold">Landlord Agreement</h2>
                <p className="text-gray-600">Review and sign the landlord agreement</p>
              </div>

              <Card className="bg-gray-50">
                <CardContent className="p-4 text-sm text-gray-600 max-h-60 overflow-y-auto">
                  <h3 className="font-semibold mb-2">Terms and Conditions</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>You confirm that you have the legal right to rent out the property</li>
                    <li>All property details provided must be accurate and truthful</li>
                    <li>You agree to respond to tenant inquiries within 24 hours</li>
                    <li>UrbanKey may verify your property details</li>
                    <li>You agree to our commission structure for successful rentals</li>
                  </ul>
                </CardContent>
              </Card>

              <Button onClick={handleAgreementSubmit} className="w-full">
                I Agree & Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {currentStep === 'complete' && (
            <div className="text-center py-8 space-y-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold">Verification in Progress!</h2>
              <p className="text-gray-600">
                Your documents are being reviewed. You can start listing properties while we verify.
              </p>
              <Button onClick={handleComplete} size="lg" className="mt-4">
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}