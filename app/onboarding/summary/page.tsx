"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Step5Summary } from "@/components/onboarding/step-5-summary"
import { useOnboardingStore } from "@/lib/stores/onboarding-store"
import { StepPlaceholder } from "@/components/onboarding/step-placeholder"

export default function SummaryPage() {
  const router = useRouter()
  const { completedSteps, setCurrentStep } = useOnboardingStore()

  useEffect(() => {
    setCurrentStep(5)
    if (!completedSteps.includes(4)) {
      router.replace("/onboarding/state")
    }
  }, [completedSteps, router, setCurrentStep])

  const handleNext = () => {
    router.push("/onboarding/thanks")
  }

  if (!completedSteps.includes(4)) {
    return (
      <StepPlaceholder stepNumber={5} title="Resumen" description="Completa el Paso 4 para continuar" />
    )
  }

  return <Step5Summary onNext={handleNext} />
}
