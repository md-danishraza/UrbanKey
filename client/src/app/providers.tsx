"use client";

import React, { Suspense } from "react";
import StoreProvider from "@/state/StoreProvider";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <TooltipProvider>
          {children}
          <Toaster richColors closeButton />
        </TooltipProvider>
      </Suspense>
    </StoreProvider>
  );
};

export default Providers;