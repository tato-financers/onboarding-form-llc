"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Step1Contact } from "@/components/onboarding/step-1-contact"
import { useOnboardingStore } from "@/lib/stores/onboarding-store"

export default function ContactPage() {
  const router = useRouter()
  const { setCurrentStep } = useOnboardingStore()

  useEffect(() => {
    setCurrentStep(1)
  }, [setCurrentStep])

  const handleNext = () => {
    router.push("/onboarding/entity-type")
  }

  return <Step1Contact onNext={handleNext} />
}
