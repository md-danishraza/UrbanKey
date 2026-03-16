"use client";

import { useSyncUser } from "@/hooks/useSyncUser";

export default function UserSyncProvider({ children }: { children: React.ReactNode }) {
  // This hook will now run automatically in the background on every page
  // useSyncUser(); 

  return <>{children}</>;
}