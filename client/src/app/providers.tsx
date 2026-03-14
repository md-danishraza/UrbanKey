"use client";

import React, { Suspense } from "react";
import StoreProvider from "@/state/StoreProvider";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import {ClerkProvider} from "@clerk/nextjs";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: undefined, // or dark for dark mode
        variables: {
          colorPrimary: '#3b82f6', // Match your primary color
          colorText: '#1f2937',
          borderRadius: '0.5rem',
        },
        elements: {
          card: 'shadow-xl',
          formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
        },
      }}
    >
    <StoreProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <TooltipProvider>
          {children}
          <Toaster richColors closeButton />
        </TooltipProvider>
      </Suspense>
    </StoreProvider>
    </ClerkProvider>
  );
};

export default Providers;