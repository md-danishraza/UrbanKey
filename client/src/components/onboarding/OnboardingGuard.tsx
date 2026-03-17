'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useOnboarding } from '@/contexts/OnboardingContext';

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const { user, isSignedIn } = useUser();
  const { isLoading, completedSteps, isCompleted, resetOnboarding } = useOnboarding();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isSignedIn || isLoading) return;

    const isOnboardingPage = pathname.includes('/onboarding');
    const role = (user?.publicMetadata?.role as string)?.toLowerCase() || 'tenant';
    
    // Get completed steps count from metadata or context
    const metadataCompleted = user?.publicMetadata?.onboardingCompleted === true;
    const hasCompletedOnboarding = isCompleted || metadataCompleted;

    // If on onboarding page but already completed, redirect to dashboard
    if (isOnboardingPage && hasCompletedOnboarding) {
      const dashboardUrl = role === 'tenant' ? '/properties/search' : '/landlord/dashboard';
      router.push(dashboardUrl);
      return;
    }

    // If not on onboarding page and not completed, redirect to onboarding
    if (!isOnboardingPage && !hasCompletedOnboarding && !pathname.startsWith('/auth')) {
      // Only redirect if we have a role
      if (role) {
        router.push(`/onboarding/${role}`);
      }
    }

    // Reset onboarding context when leaving onboarding pages
    if (!isOnboardingPage) {
      resetOnboarding();
    }
  }, [isSignedIn, user, pathname, isLoading, completedSteps, isCompleted, router, resetOnboarding]);

  return <>{children}</>;
}