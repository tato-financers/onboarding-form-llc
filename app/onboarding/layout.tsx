"use client"

import type React from "react"
import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { useOnboardingStore } from "@/lib/stores/onboarding-store"
import { StepIndicator } from "@/components/onboarding/step-indicator"
import { OnboardingNavbar } from "@/components/onboarding/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Toaster } from "@/components/ui/toaster"

const STEPS = [
  { number: 1, label: "Contacto" },
  { number: 2, label: "Tipo de entidad" },
  { number: 3, label: "Membresía" },
  { number: 4, label: "Estado" },
  { number: 5, label: "Resumen" },
  { number: 6, label: "Confirmación" },
]

const STEP_CONFIG: Record<
  string,
  {
    step: number
    title: string
    description: string
  }
> = {
  "/onboarding/contact": {
    step: 1,
    title: "Datos de contacto",
    description: "Ingresa tu información personal para comenzar",
  },
  "/onboarding/entity-type": {
    step: 2,
    title: "Tipo de entidad",
    description: "Selecciona el tipo de entidad que deseas crear",
  },
  "/onboarding/members": {
    step: 3,
    title: "Estructura de membresía",
    description: "Define la estructura de propiedad de tu empresa",
  },
  "/onboarding/state": {
    step: 4,
    title: "Estado de incorporación",
    description: "Elige el estado donde deseas incorporar tu empresa",
  },
  "/onboarding/summary": {
    step: 5,
    title: "Resumen",
    description: "Revisa toda la información antes de enviar",
  },
  "/onboarding/thanks": {
    step: 6,
    title: "¡Solicitud enviada!",
    description: "Tu solicitud ha sido recibida exitosamente",
  },
}

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { completedSteps } = useOnboardingStore()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  if (pathname === "/onboarding") {
    return children
  }

  const config = STEP_CONFIG[pathname]

  if (!config) {
    return children
  }

  if (pathname === "/onboarding/thanks") {
    return (
      <div className="min-h-screen bg-background">
        <OnboardingNavbar />
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <Card>
              <CardContent className="pt-6">{children}</CardContent>
            </Card>
          </div>
        </div>
        <Toaster />
      </div>
    )
  }

  const visibleCompletedSteps = completedSteps.filter((step) => step <= config.step)

  return (
    <div className="min-h-screen bg-background">
      <OnboardingNavbar />

      <div className="py-8">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <StepIndicator currentStep={config.step} completedSteps={visibleCompletedSteps} steps={STEPS} />
          </div>

          {/* Mobile: No Card wrapper, just title and content */}
          <div className="md:hidden">
            <div className="mb-6 px-4">
              <h1 className="text-balance text-2xl font-semibold">{config.title}</h1>
              <p className="text-muted-foreground mt-2">{config.description}</p>
            </div>
            {children}
          </div>

          {/* Desktop: Card wrapper with padding */}
          <Card className="hidden md:block">
            <CardHeader>
              <CardTitle className="text-balance text-2xl sm:text-3xl">{config.title}</CardTitle>
              <CardDescription>{config.description}</CardDescription>
            </CardHeader>
            <CardContent>{children}</CardContent>
          </Card>
        </div>
      </div>
      <Toaster />
    </div>
  )
}
