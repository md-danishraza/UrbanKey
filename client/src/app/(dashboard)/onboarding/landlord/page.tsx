'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useAuth } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { User, Shield, FileText, CheckCircle } from 'lucide-react';

import { Progress } from '@/components/ui/progress';
import { OnboardingProvider, useOnboarding } from '@/contexts/OnboardingContext';
import { apiClient } from '@/lib/api/api-client';
import { updateUserRole } from '@/app/actions/auth';
import { cn } from '@/lib/utils';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { ProfileForm } from '@/components/onboarding/ProfileForm';
import { DocumentStep } from '@/components/onboarding/DocumentStep';
import { AgreementForm } from '@/components/onboarding/AgreementForm';
import { CompletionStep } from '@/components/onboarding/CompletionStep';
import { VerificationStatus } from '@/components/onboarding/VerificationStatus';

const steps = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'documents', label: 'Documents', icon: Shield },
  { id: 'agreement', label: 'Agreement', icon: FileText },
  { id: 'complete', label: 'Complete', icon: CheckCircle },
];

function LandlordOnboardingContent() {
  const router = useRouter(); 
  const { user } = useUser();
  const { getToken } = useAuth();
  const { currentStep, completedSteps, data, isLoading, completeAndGoNext, finishOnboarding } = useOnboarding();
  const [submitting, setSubmitting] = useState(false);
  
  const documentStatus = data?.documentStatus || (data?.aadharUploaded ? 'PENDING' : null);
  const rejectionReason = data?.rejectionReason;  
  const documentUploaded = data?.aadharUploaded || false;

  const hasFetchedDocumentRef = useRef(false);

  useEffect(() => {
    const fetchDocumentStatus = async () => {
      if (hasFetchedDocumentRef.current || !user) return;
      try {
        const token = await getToken();
        const response: any = await apiClient.get('/api/documents', token);
        
        if (response.documents?.length > 0) {
          const aadharDoc = response.documents.find((doc: any) => doc.documentType === 'aadhar');
          if (aadharDoc) {
            hasFetchedDocumentRef.current = true;
            if (!data?.aadharUploaded || data?.documentStatus !== aadharDoc.status) {
              // Only updating the state context without advancing the step here
              await completeAndGoNext(currentStep, {
                ...data,
                aadharUploaded: true,
                documentStatus: aadharDoc.status,
                rejectionReason: aadharDoc.rejectionReason,
                aadharUrl: aadharDoc.fileUrl,
              });
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch document status:', error);
      }
    };
    
    if (currentStep === 'documents' || currentStep === 'complete') fetchDocumentStatus();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, user, getToken, data?.documentStatus, data?.aadharUploaded]);

  if (isLoading) return <LoadingSpinner />;

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleProfileSubmit = async (profileData: any) => {
    setSubmitting(true);
    try {
      const formDataObj = new FormData();
      formDataObj.append('role', 'landlord');
      formDataObj.append('fullName', profileData.fullName);
      formDataObj.append('phone', profileData.phone);
      await updateUserRole(formDataObj);

      const token = await getToken();
      await apiClient.post('/api/users/sync', {
        email: user?.primaryEmailAddress?.emailAddress,
        fullName: profileData.fullName,
        phone: profileData.phone,
        avatarUrl: user?.imageUrl,
        role: 'LANDLORD',
        businessName: profileData.businessName,
        metadata: {
          propertyCount: profileData.propertyCount,
          experience: profileData.experience,
          gstNumber: profileData.gstNumber,
        }
      }, token);

      // Safe progression
      await completeAndGoNext('profile', profileData);
    } catch (error) {
      console.error('Profile submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDocumentUpload = async (file: File) => {
    setSubmitting(true);
    try {
      const token = await getToken();
      const uploadData = new FormData();
      uploadData.append('documentType', 'aadhar');
      uploadData.append('file', file);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/documents/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: uploadData,
      });
  
      if (!response.ok) throw new Error((await response.json()).error || 'Upload failed');
      const result = await response.json();

      await apiClient.post('/api/users/sync', {
        email: user?.primaryEmailAddress?.emailAddress,
        fullName: user?.fullName || user?.username,
        role: 'LANDLORD',
        verificationDocs: {
          aadhar: {
            url: result.document.fileUrl,
            status: result.document.status,
            uploadedAt: new Date().toISOString(),
          }
        }
      }, token);
      
      // Safe progression
      await completeAndGoNext('documents', { 
        aadharUploaded: true,
        aadharFileName: file.name,
        aadharUrl: result.document.fileUrl,
        documentStatus: result.document.status
      });            
    } catch (error) {
      console.error('Document upload error:', error);
      alert('Failed to upload document. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAgreementAccept = async () => {
    setSubmitting(true);
    try {
      const token = await getToken();
      await apiClient.post('/api/rent/agreement/landlord', {
        acceptedAt: new Date().toISOString(),
        terms: 'v1',
        ipAddress: 'client-side',
      }, token);
      
      // Safe progression
      await completeAndGoNext('agreement', { 
        agreementAccepted: true,
        acceptedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Agreement submission error:', error);  
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetryUpload = async () => {
    // We stay on the documents step but wipe the data
    await completeAndGoNext('profile', { // 'profile' was the previous step
      ...data,
      aadharUploaded: false,
      documentStatus: null,
      rejectionReason: null
    });
    window.location.reload();
  };

  const handleComplete = async () => {
    setSubmitting(true);
    try {
      const token = await getToken();
      
      // Explicitly call the API here to ensure we catch any backend 500 errors
      // before redirecting, preventing the "silent fail" bug.
      await apiClient.post('/api/onboarding/complete', { role: 'landlord' }, token);
      
      // Update local React Context state
      await finishOnboarding('landlord');
      
      router.push('/landlord/dashboard');
    } catch (error) {
      console.error('Completion error:', error);
      alert("Failed to complete onboarding. Please check your backend terminal for errors!");
      setSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Welcome to UrbanKey!
          </h1>
          <p className="text-gray-600 mt-2">Let's get you set up as a verified landlord</p>
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
                <div key={step.id} className={cn("flex flex-col items-center text-xs", isActive ? "text-purple-600 font-medium" : isCompleted ? "text-green-600" : "text-gray-400")}>
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center mb-1", isActive ? "bg-purple-100 text-purple-600" : isCompleted ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400")}>
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
            <ProfileForm
              role="landlord"
              onSubmit={handleProfileSubmit}
              isLoading={submitting}
              initialData={{
                fullName: data?.fullName || '', phone: data?.phone || '', businessName: data?.businessName || '',
                propertyCount: data?.propertyCount || '', experience: data?.experience || '', gstNumber: data?.gstNumber || '',
              }}
            />
          )}

          {currentStep === 'documents' && (
            <div className="space-y-6">
              {documentUploaded && (
                <VerificationStatus 
                  status={documentStatus as "PENDING" | "APPROVED" | "REJECTED" || 'PENDING'}
                  documentType="Aadhar Card"
                  rejectionReason={rejectionReason}
                  onRetry={documentStatus === 'REJECTED' ? handleRetryUpload : undefined}
                />
              )}
              <DocumentStep
                documentUploaded={documentUploaded}
                documentStatus={documentStatus}
                documentType="Aadhar Card"
                onUpload={handleDocumentUpload}
                rejectionReason={rejectionReason}
                onRetry={handleRetryUpload}
              />
            </div>
          )}

          {currentStep === 'agreement' && (
            <AgreementForm
              onAccept={handleAgreementAccept}
              isLoading={submitting}
            />
          )}

          {currentStep === 'complete' && (
            <div className="space-y-6">
              <VerificationStatus 
                status={documentStatus as "PENDING" | "APPROVED" | "REJECTED" || 'PENDING'}
                documentType="Aadhar Card"
                rejectionReason={rejectionReason}
                onRetry={documentStatus === 'REJECTED' ? handleRetryUpload : undefined}
              />
              <CompletionStep
                verificationStatus={documentStatus || 'PENDING'}
                documentType="Aadhar Card"
                rejectionReason={rejectionReason}
                onComplete={handleComplete}
                onRetry={handleRetryUpload}
              />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default function LandlordOnboardingPage() {
  return (
    <OnboardingProvider>
      <LandlordOnboardingContent />
    </OnboardingProvider>
  );
}