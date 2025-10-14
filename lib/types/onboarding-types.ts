export interface ContactData {
  firstName: string
  lastName: string
  email: string
  phone: string
}

export interface EntityTypeData {
  entityType: "LLC" | "C_CORP"
}

export interface MembershipData {
  membershipType: "SINGLE" | "MULTI"
}

export interface StateData {
  state: string
}

export interface SummaryData {
  confirmed: boolean
}

export interface OnboardingData {
  step1: ContactData | null
  step2: EntityTypeData | null
  step3: MembershipData | null
  step4: StateData | null
  step5: SummaryData | null
  currentStep: number
  completedSteps: number[]
}

export const STORAGE_KEY = "onboarding_v1"
