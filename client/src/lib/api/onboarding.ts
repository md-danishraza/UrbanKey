import { apiClient } from "./api-client";

export interface OnboardingProgress {
  id: string;
  userId: string;
  currentStep: string;
  completedSteps: string[];
  data: Record<string, any>;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OnboardingResponse {
  success: boolean;
  progress?: OnboardingProgress;
  error?: string;
}

export interface OnboardingData {
  step: string;
  completedSteps: string[];
  data: Record<string, any>;
}

export async function saveProgress(
  data: OnboardingData,
  token: string | null
): Promise<OnboardingResponse> {
  if (!token) throw new Error("No auth token");

  return apiClient.post("/api/onboarding/progress", data, token);
}

export async function getProgress(
  token: string | null
): Promise<OnboardingResponse> {
  if (!token) throw new Error("No auth token");

  return apiClient.get("/api/onboarding/progress", token);
}

export async function completeOnboarding(
  role: string,
  token: string | null
): Promise<{ success: boolean }> {
  if (!token) throw new Error("No auth token");

  return apiClient.post("/api/onboarding/complete", { role }, token);
}
