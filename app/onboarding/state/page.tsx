"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Step4State } from "@/components/onboarding/step-4-state"
import { useOnboardingStore } from "@/lib/stores/onboarding-store"
import { StepPlaceholder } from "@/components/onboarding/step-placeholder"

export default function StatePage() {
  const router = useRouter()
  const { completedSteps, setCurrentStep } = useOnboardingStore()

  useEffect(() => {
    setCurrentStep(4)
    if (!completedSteps.includes(3)) {
      router.replace("/onboarding/members")
    }
  }, [completedSteps, router, setCurrentStep])

  const handleNext = () => {
    router.push("/onboarding/summary")
  }

  if (!completedSteps.includes(3)) {
    return (
      <StepPlaceholder stepNumber={4} title="Estado de incorporación" description="Completa el Paso 3 para continuar" />
    )
  }

  return <Step4State onNext={handleNext} />
}
