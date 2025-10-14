"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Step3Membership } from "@/components/onboarding/step-3-membership"
import { useOnboardingStore } from "@/lib/stores/onboarding-store"
import { StepPlaceholder } from "@/components/onboarding/step-placeholder"

export default function MembersPage() {
  const router = useRouter()
  const { completedSteps, setCurrentStep } = useOnboardingStore()

  useEffect(() => {
    setCurrentStep(3)
    if (!completedSteps.includes(2)) {
      router.replace("/onboarding/entity-type")
    }
  }, [completedSteps, router, setCurrentStep])

  const handleNext = () => {
    router.push("/onboarding/state")
  }

  if (!completedSteps.includes(2)) {
    return (
      <StepPlaceholder stepNumber={3} title="Estructura de membresía" description="Completa el Paso 2 para continuar" />
    )
  }

  return <Step3Membership onNext={handleNext} />
}
