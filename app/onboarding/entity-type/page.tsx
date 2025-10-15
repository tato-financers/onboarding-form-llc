"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Step2EntityType } from "@/components/onboarding/step-2-entity-type"
import { useOnboardingStore } from "@/lib/stores/onboarding-store"
import { StepPlaceholder } from "@/components/onboarding/step-placeholder"

export default function EntityTypePage() {
  const router = useRouter()
  const { completedSteps, setCurrentStep } = useOnboardingStore()

  useEffect(() => {
    setCurrentStep(2)
    if (!completedSteps.includes(1)) {
      router.replace("/onboarding/contact")
    }
  }, [completedSteps, router, setCurrentStep])

  const handleNext = () => {
    router.push("/onboarding/members")
  }

  if (!completedSteps.includes(1)) {
    return <StepPlaceholder stepNumber={2} title="Tipo de entidad" description="Completa el Paso 1 para continuar" />
  }

  return <Step2EntityType onNext={handleNext} />
}


// "use client"

// import { useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { useOnboardingStore } from "@/lib/stores/onboarding-store"

// export default function EntityTypePage() {
//   const router = useRouter()
//   const { completedSteps, setCurrentStep, setStep2Data } = useOnboardingStore()

//   useEffect(() => {
//     setCurrentStep(2)

//     if (!completedSteps.includes(1)) {
//       router.replace("/onboarding/contact")
//     } else {
//       // NOTE: Paso 2 desactivado temporalmente. Se fuerza LLC y se redirige al paso 3.
//       setStep2Data({ entityType: "LLC" })
//       router.replace("/onboarding/members")
//     }
//   }, [completedSteps, router, setCurrentStep, setStep2Data])

//   return null
// }