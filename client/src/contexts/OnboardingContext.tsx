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
  completeAndGoNext: (step: string, stepData?: any) => Promise<void>; // <-- NEW SAFE METHOD
  finishOnboarding: (role: string) => Promise<void>;
  resetOnboarding: () => void;
  setRole: (role: 'tenant' | 'landlord') => void;
}

// Unified step orders for both roles
const UNIFIED_STEPS = ['profile', 'documents', 'agreement', 'complete'];

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
  const [userRole, setUserRole] = useState<'tenant' | 'landlord'>('tenant');

  useEffect(() => {
    setIsOnboardingPage(pathname?.includes('/onboarding') || false);
    if (pathname?.includes('/onboarding/landlord')) setUserRole('landlord');
    else if (pathname?.includes('/onboarding/tenant')) setUserRole('tenant');
  }, [pathname]);

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
      }
    } catch (error) {
      console.error('Failed to load onboarding progress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveToBackend = async (step: string, steps: string[], stepData: Record<string, any>) => {
    if (!isOnboardingPage) return;
    try {
      const token = await getToken();
      await saveProgress({ step, completedSteps: steps, data: stepData }, token);
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  const setStep = async (step: string) => {
    setCurrentStep(step);
    await saveToBackend(step, completedSteps, data);
  };

  // FIX: This single method prevents the React state race condition!
  const completeAndGoNext = async (step: string, stepData?: any) => {
    // 1. Calculate new state immediately
    const newCompletedSteps = Array.from(new Set([...completedSteps, step]));
    const newData = { ...data, ...stepData };
    
    // 2. Determine next step
    const currentIndex = UNIFIED_STEPS.indexOf(currentStep);
    const nextStep = currentIndex < UNIFIED_STEPS.length - 1 
      ? UNIFIED_STEPS[currentIndex + 1] 
      : currentStep;

    // 3. Update React State
    setCompletedSteps(newCompletedSteps);
    setData(newData);
    setCurrentStep(nextStep);
    
    // 4. Send ONE perfect payload to the backend
    await saveToBackend(nextStep, newCompletedSteps, newData);
  };

  const finishOnboarding = async (role: string) => {
    try {
      const token = await getToken();
      await completeOnboarding(role, token);
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
        currentStep, completedSteps, data, isLoading, isCompleted,
        setStep, completeAndGoNext, finishOnboarding, resetOnboarding, setRole: setUserRole,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) throw new Error('useOnboarding must be used within OnboardingProvider');
  return context;
}