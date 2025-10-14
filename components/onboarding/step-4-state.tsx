"use client"

import { useEffect, useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { stateSchema, type StateFormData } from "@/lib/schemas/onboarding-schema"
import { useOnboardingStore } from "@/lib/stores/onboarding-store"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check } from "lucide-react"
import { calculatePrice, formatPrice } from "@/lib/utils/pricing"
import { cn } from "@/lib/utils"

interface Step4StateProps {
  onNext: () => void
}

const AVAILABLE_STATES = [
  {
    code: "WY",
    name: "Wyoming",
    description: "Bajos impuestos y privacidad",
    bullets: [
      "Uno de los estados más pro-negocios en EE. UU.",
      "Bajo costo anual y requisitos de mantenimiento simples",
      "Alta privacidad en registros públicos",
      "Popular entre emprendedores que buscan flexibilidad y bajo costo",
    ],
  },
  {
    code: "NM",
    name: "New Mexico",
    description: "Bajos costos de formación",
    bullets: [
      "Estado con menor costo inicial y sin tasas de renovación estatales",
      "No exige reporte anual",
      "Datos de los dueños fuera de registros públicos",
      "Opción simple y económica para mantener en el tiempo",
    ],
  },
  {
    code: "DE",
    name: "Delaware",
    description: "Más popular para startups y corporaciones",
    bullets: [
      "Jurisdicción más reconocida en EE. UU. e internacionalmente",
      "Corte especializada en asuntos corporativos (Court of Chancery)",
      "Elegida por startups, fondos e inversores institucionales",
      "Requiere pago de Franchise Tax y presentación de Annual Report",
    ],
  },
  {
    code: "FL",
    name: "Florida",
    description: "Sin impuesto estatal sobre la renta",
    bullets: [
      "Conveniente si tu negocio tiene presencia u operaciones en el estado",
      "Marco regulatorio claro y acceso a bancos locales",
      "Atractivo para eCommerce y Real Estate",
      "Exige Annual Report y obligaciones estatales",
    ],
  },
]

export function Step4State({ onNext }: Step4StateProps) {
  const router = useRouter()
  const { step4, step2, step3, setStep4Data } = useOnboardingStore()
  const [selectedState, setSelectedState] = useState<string>(step4?.state || "")
  const [showScrollHint, setShowScrollHint] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<StateFormData>({
    resolver: zodResolver(stateSchema),
    defaultValues: step4 || { state: "" },
  })

  useEffect(() => {
    if (step4?.state) {
      setSelectedState(step4.state)
      setValue("state", step4.state)
    }
  }, [step4, setValue])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      if (showScrollHint) {
        setShowScrollHint(false)
      }

      const scrollLeft = container.scrollLeft
      const cardWidth = container.scrollWidth / AVAILABLE_STATES.length
      const newIndex = Math.round(scrollLeft / cardWidth)
      setActiveIndex(newIndex)
    }

    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
  }, [showScrollHint])

  const onSubmit = (data: StateFormData) => {
    setStep4Data(data)
    onNext()
  }

  const handleStateSelect = (stateCode: string) => {
    setSelectedState(stateCode)
    setValue("state", stateCode, { shouldValidate: true })
  }

  const handleBack = () => {
    if (step2?.entityType === "C_CORP") {
      router.push("/onboarding/entity-type")
    } else {
      router.push("/onboarding/members")
    }
  }

  const getPriceForState = (stateCode: string): number | null => {
    if (!step2?.entityType || !step3?.membershipType) return null
    return calculatePrice(step2.entityType, step3.membershipType, stateCode)
  }

  const currentPrice =
    selectedState && step2?.entityType && step3?.membershipType
      ? calculatePrice(step2.entityType, step3.membershipType, selectedState)
      : null

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-6">
        {showScrollHint && (
          <div className="md:hidden sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2 text-center text-sm text-muted-foreground animate-pulse">
            Desliza para ver las 5 opciones →
          </div>
        )}

        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-2 lg:grid-cols-2 md:overflow-visible"
        >
          {AVAILABLE_STATES.map((state) => {
            const price = getPriceForState(state.code)
            return (
              <Card
                key={state.code}
                className={cn(
                  "relative cursor-pointer border-2 p-4 transition-all hover:border-primary/50 flex-shrink-0 w-[80vw] snap-center md:w-auto",
                  selectedState === state.code ? "border-primary bg-primary/5" : "border-border",
                )}
                onClick={() => handleStateSelect(state.code)}
              >
                <div className="absolute right-3 top-3">
                  {selectedState === state.code ? (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                      <Check className="h-4 w-4 text-primary-foreground" />
                    </div>
                  ) : (
                    <div className="h-6 w-6 rounded-full border-2 border-gray-300" />
                  )}
                </div>

                <div className="mb-2 pr-8">
                  <h4 className="font-semibold">{state.name}</h4>
                  {price !== null && <p className="text-lg font-bold text-primary mt-1 data-hj-allow">{formatPrice(price)}</p>}
                </div>

                <ul className="space-y-1.5">
                  {state.bullets.map((bullet, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )
          })}
        </div>

        <div className="flex justify-center gap-2 md:hidden">
          {AVAILABLE_STATES.map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-2 w-2 rounded-full transition-all",
                index === activeIndex ? "bg-primary w-4" : "bg-muted-foreground/30",
              )}
            />
          ))}
        </div>

        {errors.state && <p className="text-sm text-destructive">{errors.state.message}</p>}
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={handleBack}>
          Anterior
        </Button>
        <Button type="submit" disabled={!selectedState}>
          Siguiente
        </Button>
      </div>
    </form>
  )
}
