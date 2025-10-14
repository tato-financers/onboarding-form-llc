"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useOnboardingStore } from "@/lib/stores/onboarding-store"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Edit2, Loader2 } from "lucide-react"
import { calculatePrice, formatPrice } from "@/lib/utils/pricing"
import { saveApplication } from "@/lib/actions/applications"
import { useToast } from "@/hooks/use-toast"

interface Step5SummaryProps {
  onNext: () => void
}

const US_STATES_MAP: Record<string, string> = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
}

export function Step5Summary({ onNext }: Step5SummaryProps) {
  const { step1, step2, step3, step4, setCurrentStep, applicationId } = useOnboardingStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!step1 || !step2 || !step4) {
      toast({
        title: "Error",
        description: "Por favor completa todos los pasos requeridos",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const result = await saveApplication(
        {
          step1,
          step2,
          step3,
          step4,
          step5: null,
          currentStep: 5,
          completedSteps: [],
        },
        applicationId || undefined,
      )

      if (result.success) {
        console.log("[v0] Application saved with ID:", result.applicationId)
        onNext()
      } else {
        console.error("[v0] Failed to save application:", result.error)
        toast({
          title: "Error al enviar",
          description: result.error || "Hubo un problema al enviar tu solicitud. Por favor intenta de nuevo.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Unexpected error during submission:", error)
      toast({
        title: "Error inesperado",
        description: "Hubo un problema al enviar tu solicitud. Por favor intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (step: number) => {
    const routes = {
      1: "/onboarding/contact",
      2: "/onboarding/entity-type",
      3: "/onboarding/members",
      4: "/onboarding/state",
    }

    if (step === 3 && step2?.entityType === "C_CORP") {
      router.push(routes[2])
    } else {
      router.push(routes[step as keyof typeof routes])
    }
  }

  const finalPrice =
    step2?.entityType && step3?.membershipType && step4?.state
      ? calculatePrice(step2.entityType, step3.membershipType, step4.state)
      : null

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Card className="p-4">
        <div className="space-y-3">
          {/* Contact Data */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Datos de contacto</h3>
              <Button type="button" variant="ghost" size="sm" className="h-8" onClick={() => handleEdit(1)}>
                <Edit2 className="h-3 w-3 mr-1" />
                Editar
              </Button>
            </div>
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-muted-foreground">Nombre:</span> {step1?.firstName} {step1?.lastName}
              </p>
              <p>
                <span className="text-muted-foreground">Email:</span> {step1?.email}
              </p>
              <p>
                <span className="text-muted-foreground">Teléfono:</span> {step1?.phone}
              </p>
            </div>
          </div>

          <Separator />

          {/* Entity Type */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Tipo de entidad</span>
              <span className="text-sm font-semibold truncate">
                {step2?.entityType === "LLC" ? "LLC" : "C Corporation"}
              </span>
            </div>
            <Button type="button" variant="ghost" size="sm" className="h-8 shrink-0" onClick={() => handleEdit(2)}>
              <Edit2 className="h-3 w-3 mr-1" />
              Editar
            </Button>
          </div>

          <Separator />

          {/* Membership */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Membresía</span>
              <span className="text-sm font-semibold truncate">
                {step3?.membershipType === "SINGLE" ? "Single Member" : "Multi Member"}
              </span>
            </div>
            <Button type="button" variant="ghost" size="sm" className="h-8 shrink-0" onClick={() => handleEdit(3)}>
              <Edit2 className="h-3 w-3 mr-1" />
              Editar
            </Button>
          </div>

          <Separator />

          {/* State */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Estado</span>
              <span className="text-sm font-semibold truncate">{step4?.state ? US_STATES_MAP[step4.state] : ""}</span>
            </div>
            <Button type="button" variant="ghost" size="sm" className="h-8 shrink-0" onClick={() => handleEdit(4)}>
              <Edit2 className="h-3 w-3 mr-1" />
              Editar
            </Button>
          </div>
        </div>
      </Card>

      {finalPrice !== null && (
        <Card className="p-4 bg-primary/5 border-primary">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              Total a pagar cuando {step2?.entityType === "LLC" ? "LLC" : "C Corporation"} este constituida{" "}
            </span>
            <span className="text-2xl font-bold text-primary data-hj-allow">{formatPrice(finalPrice)}</span>
          </div>
        </Card>
      )}

      <div className="flex justify-between pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/onboarding/state")}
          disabled={isSubmitting}
        >
          Anterior
        </Button>
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            "Enviar solicitud"
          )}
        </Button>
      </div>
    </form>
  )
}
