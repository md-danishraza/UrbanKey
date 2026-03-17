'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import { saveProgress, getProgress, completeOnboarding, OnboardingProgress } from '@/lib/api/onboarding';

interface OnboardingContextType {
  currentStep: string;
  completedSteps: string[];
  data: Record<string, any>;
  isLoading: boolean;
  isCompleted: boolean;
  setStep: (step: string) => Promise<void>;
  completeStep: (step: string, stepData?: any) => Promise<void>;
  goToNextStep: () => Promise<void>;
  finishOnboarding: (role: string) => Promise<void>;
  resetOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const { getToken, isSignedIn } = useAuth();
  const pathname = usePathname();
  const [currentStep, setCurrentStep] = useState('profile');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [data, setData] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isOnboardingPage, setIsOnboardingPage] = useState(false);

  // Check if current page is onboarding
  useEffect(() => {
    setIsOnboardingPage(pathname?.includes('/onboarding') || false);
  }, [pathname]);

  // Load progress only on onboarding pages
  useEffect(() => {
    if (!isSignedIn || !isOnboardingPage) {
      setIsLoading(false);
      return;
    }

    loadProgress();
  }, [isSignedIn, isOnboardingPage]);

  const loadProgress = async () => {
    try {
      const token = await getToken();
      const response = await getProgress(token);
      
      if (response && 'progress' in response && response.progress) {
        const progress = response.progress as OnboardingProgress;
        setCurrentStep(progress.currentStep || 'profile');
        setCompletedSteps(progress.completedSteps || []);
        setData(progress.data || {});
        setIsCompleted(progress.completed || false);
      } else {
        // Reset to default
        setCurrentStep('profile');
        setCompletedSteps([]);
        setData({});
        setIsCompleted(false);
      }
    } catch (error) {
      console.error('Failed to load onboarding progress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveToBackend = async (
    step: string,
    steps: string[],
    stepData: Record<string, any>
  ) => {
    if (!isOnboardingPage) return; // Only save on onboarding pages
    
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
    // We need role to determine steps, but we don't have it here
    // This will be overridden in the actual onboarding pages
    const steps = ['profile', 'documents', 'complete'];
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
      setIsCompleted(true);
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
    }
  };

  const resetOnboarding = () => {
    setCurrentStep('profile');
    setCompletedSteps([]);
    setData({});
    setIsCompleted(false);
  };

  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        completedSteps,
        data,
        isLoading,
        isCompleted,
        setStep,
        completeStep,
        goToNextStep,
        finishOnboarding,
        resetOnboarding,
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