import { create } from "zustand"
import { persist } from "zustand/middleware"
import type {
  OnboardingData,
  ContactData,
  EntityTypeData,
  MembershipData,
  StateData,
  SummaryData,
} from "@/lib/types/onboarding-types"
import { STORAGE_KEY } from "@/lib/types/onboarding-types"

interface OnboardingStore extends OnboardingData {
  applicationId: string | null
  setApplicationId: (id: string) => void
  setStep1Data: (data: ContactData) => void
  setStep2Data: (data: EntityTypeData) => void
  setStep3Data: (data: MembershipData) => void
  setStep4Data: (data: StateData) => void
  setStep5Data: (data: SummaryData) => void
  setCurrentStep: (step: number) => void
  markStepComplete: (step: number) => void
  resetOnboarding: () => void
}

const initialState: OnboardingData = {
  step1: null,
  step2: null,
  step3: null,
  step4: null,
  step5: null,
  currentStep: 1,
  completedSteps: [],
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      ...initialState,
      applicationId: null,
      setApplicationId: (id) => set({ applicationId: id }),
      setStep1Data: (data) =>
        set((state) => ({
          step1: data,
          completedSteps: state.completedSteps.includes(1) ? state.completedSteps : [...state.completedSteps, 1],
        })),
      setStep2Data: (data) =>
        set((state) => ({
          step2: data,
          completedSteps: state.completedSteps.includes(2) ? state.completedSteps : [...state.completedSteps, 2],
        })),
      setStep3Data: (data) =>
        set((state) => ({
          step3: data,
          completedSteps: state.completedSteps.includes(3) ? state.completedSteps : [...state.completedSteps, 3],
        })),
      setStep4Data: (data) =>
        set((state) => ({
          step4: data,
          completedSteps: state.completedSteps.includes(4) ? state.completedSteps : [...state.completedSteps, 4],
        })),
      setStep5Data: (data) =>
        set((state) => ({
          step5: data,
          completedSteps: state.completedSteps.includes(5) ? state.completedSteps : [...state.completedSteps, 5],
        })),
      setCurrentStep: (step) => set({ currentStep: step }),
      markStepComplete: (step) =>
        set((state) => ({
          completedSteps: state.completedSteps.includes(step) ? state.completedSteps : [...state.completedSteps, step],
        })),
      resetOnboarding: () => set({ ...initialState, applicationId: null }),
    }),
    {
      name: STORAGE_KEY,
    },
  ),
)
