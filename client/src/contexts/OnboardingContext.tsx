'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { saveProgress, getProgress, completeOnboarding, OnboardingProgress } from '@/lib/api/onboarding';

interface OnboardingContextType {
  currentStep: string;
  completedSteps: string[];
  data: Record<string, any>;
  isLoading: boolean;
  setStep: (step: string) => Promise<void>;
  completeStep: (step: string, stepData?: any) => Promise<void>;
  goToNextStep: () => Promise<void>;
  finishOnboarding: (role: string) => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ 
  children,
  role 
}: { 
  children: React.ReactNode;
  role: 'tenant' | 'landlord';
}) {
  const { getToken } = useAuth();
  const [currentStep, setCurrentStep] = useState('profile');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [data, setData] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load saved progress on mount
  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const token = await getToken();
      const response = await getProgress(token);
      
      // Check if response has progress property
      if (response && 'progress' in response && response.progress) {
        const progress = response.progress as OnboardingProgress;
        setCurrentStep(progress.currentStep || 'profile');
        setCompletedSteps(progress.completedSteps || []);
        setData(progress.data || {});
      } else {
        // No progress found, start fresh
        setCurrentStep('profile');
        setCompletedSteps([]);
        setData({});
      }
    } catch (error) {
      console.error('Failed to load onboarding progress:', error);
      // Start fresh on error
      setCurrentStep('profile');
      setCompletedSteps([]);
      setData({});
    } finally {
      setIsLoading(false);
    }
  };

  const saveToBackend = async (
    step: string,
    steps: string[],
    stepData: Record<string, any>
  ) => {
    try {
      const token = await getToken();
      await saveProgress(
        {
          step,
          completedSteps: steps,
          data: { ...data, ...stepData },
        },
        token
      );
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  const setStep = async (step: string) => {
    setCurrentStep(step);
    await saveToBackend(step, completedSteps, {});
  };

  const completeStep = async (step: string, stepData?: any) => {
    const newCompletedSteps = [...completedSteps, step];
    const newData = { ...data, ...stepData };
    
    setCompletedSteps(newCompletedSteps);
    setData(newData);
    
    await saveToBackend(currentStep, newCompletedSteps, newData);
  };

  const goToNextStep = async () => {
    const steps = role === 'tenant' 
      ? ['profile', 'documents', 'preferences', 'complete']
      : ['profile', 'documents', 'agreement', 'complete'];
    
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1];
      setCurrentStep(nextStep);
      await saveToBackend(nextStep, completedSteps, data);
    }
  };

  const finishOnboarding = async (userRole: string) => {
    try {
      const token = await getToken();
      await completeOnboarding(userRole, token);
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
    }
  };

  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        completedSteps,
        data,
        isLoading,
        setStep,
        completeStep,
        goToNextStep,
        finishOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
}