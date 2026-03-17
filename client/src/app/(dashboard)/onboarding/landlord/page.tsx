'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useAuth } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Shield, 
  CheckCircle, 
  ArrowRight, 
  User, 
  Phone, 
  FileText,
  Home,
  Briefcase,
  Hash,
  Loader2
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
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
  { id: 'agreement', label: 'Agreement', icon: FileText },
  { id: 'complete', label: 'Complete', icon: CheckCircle },
];

function LandlordOnboardingContent() {
  const router = useRouter();
  const { user } = useUser();
  const { getToken } = useAuth();
  const { currentStep, completedSteps, data, isLoading, completeStep, goToNextStep, finishOnboarding } = useOnboarding();
  const [submitting, setSubmitting] = useState(false);
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: data?.fullName || user?.fullName || '',
    phone: data?.phone || '',
    businessName: data?.businessName || '',
    propertyCount: data?.propertyCount || '',
    experience: data?.experience || '',
    gstNumber: data?.gstNumber || '',
  });

  // Show loader while initial data is loading
  if (isLoading) {
    return <LoadingSpinner/>;
  }

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Update Clerk metadata
      const formDataObj = new FormData();
      formDataObj.append('role', 'landlord');
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
          role: 'LANDLORD',
          businessName: formData.businessName,
          metadata: {
            propertyCount: formData.propertyCount,
            experience: formData.experience,
            gstNumber: formData.gstNumber,
          }
        },
        token
      );

      await completeStep('profile', formData);
      await goToNextStep();
    } catch (error) {
      console.error('Profile submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDocumentUpload = async (file: File) => {
    setSubmitting(true);
    try {
      // Upload document to backend/storage
      const token = await getToken();
      const formData = new FormData();
      formData.append('documentType', 'aadhar');
      formData.append('file', file);
      
      // You would upload to your storage here
      console.log('Uploading document:', file.name);
      
      // Update backend with document status
      await apiClient.post(
        '/api/landlord/documents',
        {
          type: 'aadhar',
          fileName: file.name,
          uploadedAt: new Date().toISOString(),
          status: 'pending'
        },
        token
      );
      
      await completeStep('documents', { 
        aadharUploaded: true,
        aadharFileName: file.name 
      });
      await goToNextStep();
    } catch (error) {
      console.error('Document upload error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAgreementSubmit = async () => {
    if (!agreementAccepted) return;
    
    setSubmitting(true);
    try {
      const token = await getToken();
      
      // Record agreement acceptance
      await apiClient.post(
        '/api/landlord/agreement',
        {
          acceptedAt: new Date().toISOString(),
          terms: 'v1',
          ipAddress: 'client-side', // You might want to capture this server-side
        },
        token
      );
      
      await completeStep('agreement', { 
        agreementAccepted: true,
        acceptedAt: new Date().toISOString()
      });
      await goToNextStep();
    } catch (error) {
      console.error('Agreement submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleComplete = async () => {
    await finishOnboarding('landlord');
    router.push('/landlord/dashboard');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
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
          <p className="text-gray-600 mt-2">
            Let's get you set up as a verified landlord
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
                <p className="text-gray-600">Tell us about yourself and your property experience</p>
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

                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name (Optional)</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      className="pl-10"
                      placeholder="e.g., Kumar Properties"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="propertyCount">Number of Properties</Label>
                    <div className="relative">
                      <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="propertyCount"
                        type="number"
                        value={formData.propertyCount}
                        onChange={handleChange}
                        className="pl-10"
                        placeholder="5"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience</Label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="experience"
                        type="number"
                        value={formData.experience}
                        onChange={handleChange}
                        className="pl-10"
                        placeholder="3"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gstNumber">GST Number (Optional)</Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="gstNumber"
                      value={formData.gstNumber}
                      onChange={handleChange}
                      className="pl-10"
                      placeholder="22AAAAA0000A1Z5"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? (
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
                <p className="text-gray-600">Upload documents to verify your identity</p>
              </div>
              
              <DocumentUpload
                title="Aadhar Card"
                description="Upload a clear image of your Aadhar card"
                documentType="aadhar"
                onUpload={handleDocumentUpload}
              />

              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Your documents will be verified by our team within 24-48 hours. 
                  You'll receive an email once verification is complete.
                </p>
              </div>
            </div>
          )}

          {currentStep === 'agreement' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold">Landlord Agreement</h2>
                <p className="text-gray-600">Please review and accept the terms and conditions</p>
              </div>

              <Card className="bg-gray-50 border-gray-200">
                <CardContent className="p-6">
                  <div className="prose prose-sm max-h-96 overflow-y-auto">
                    <h3 className="text-lg font-semibold mb-4">Terms and Conditions for Landlords</h3>
                    
                    <div className="space-y-4 text-gray-600">
                      <section>
                        <h4 className="font-medium text-gray-900">1. Property Listing</h4>
                        <p>You confirm that you have the legal right to rent out the property. All property details provided must be accurate and truthful. Any misrepresentation may result in account suspension.</p>
                      </section>

                      <section>
                        <h4 className="font-medium text-gray-900">2. Verification</h4>
                        <p>You agree to provide valid identity and property ownership documents for verification. UrbanKey may verify your property details through third-party services.</p>
                      </section>

                      <section>
                        <h4 className="font-medium text-gray-900">3. Communication</h4>
                        <p>You agree to respond to tenant inquiries within 24 hours. All communication should be professional and respectful.</p>
                      </section>

                      <section>
                        <h4 className="font-medium text-gray-900">4. Fees and Commission</h4>
                        <p>You agree to our commission structure for successful rentals. Commission rates are clearly displayed during property listing and may vary based on the package chosen.</p>
                      </section>

                      <section>
                        <h4 className="font-medium text-gray-900">5. Tenant Screening</h4>
                        <p>While UrbanKey provides basic tenant verification, you are responsible for final tenant selection and background checks.</p>
                      </section>

                      <section>
                        <h4 className="font-medium text-gray-900">6. Rent Agreements</h4>
                        <p>All rental agreements generated through the platform are legally valid. You agree to use the platform's agreement templates or upload your own.</p>
                      </section>

                      <section>
                        <h4 className="font-medium text-gray-900">7. Dispute Resolution</h4>
                        <p>Any disputes with tenants should first be attempted to be resolved through the platform's mediation services before legal action.</p>
                      </section>

                      <section>
                        <h4 className="font-medium text-gray-900">8. Platform Rules</h4>
                        <p>You agree not to:
                          <ul className="list-disc pl-5 mt-2">
                            <li>List fake or non-existent properties</li>
                            <li>Discriminate against tenants based on religion, caste, or gender</li>
                            <li>Charge tenants outside the platform without documentation</li>
                            <li>Share contact information of other landlords</li>
                          </ul>
                        </p>
                      </section>

                      <section>
                        <h4 className="font-medium text-gray-900">9. Termination</h4>
                        <p>UrbanKey reserves the right to suspend or terminate accounts that violate these terms or engage in fraudulent activities.</p>
                      </section>

                      <section>
                        <h4 className="font-medium text-gray-900">10. Changes to Terms</h4>
                        <p>We may update these terms periodically. Continued use of the platform constitutes acceptance of updated terms.</p>
                      </section>
                    </div>

                    <p className="text-xs text-gray-500 mt-4">
                      Last updated: March 2024 | Version 1.0
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  checked={agreementAccepted}
                  onChange={(e) => setAgreementAccepted(e.target.checked)}
                  className="mt-1 h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                />
                <label htmlFor="acceptTerms" className="text-sm text-gray-700">
                  I have read and agree to the Terms and Conditions for Landlords. I confirm that I have the legal right to rent out properties and that all information provided is accurate.
                </label>
              </div>

              <Button 
                onClick={handleAgreementSubmit} 
                className="w-full"
                disabled={!agreementAccepted || submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Accept & Continue'
                )}
              </Button>
            </div>
          )}

          {currentStep === 'complete' && (
            <div className="text-center py-8 space-y-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold">Verification in Progress!</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Your documents are being reviewed. You can start listing properties while we verify your information.
              </p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4 text-left">
                <h3 className="font-medium text-yellow-800 mb-2">What happens next?</h3>
                <ul className="space-y-2 text-sm text-yellow-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span>Our team will verify your documents within 24-48 hours</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span>You'll receive an email once verification is complete</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span>You can start listing properties immediately (they'll be marked as "pending verification")</span>
                  </li>
                </ul>
              </div>

              <Button onClick={handleComplete} size="lg" className="mt-6">
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

export default function LandlordOnboardingPage() {
  return (
    <OnboardingProvider role="landlord">
      <LandlordOnboardingContent />
    </OnboardingProvider>
  );
}