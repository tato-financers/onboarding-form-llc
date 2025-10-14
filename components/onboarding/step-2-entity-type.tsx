"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useOnboardingStore } from "@/lib/stores/onboarding-store"
import { entityTypeSchema, type EntityTypeFormData } from "@/lib/schemas/onboarding-schema"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useRef, useEffect } from "react"

interface Step2EntityTypeProps {
  onNext: () => void
}

const ENTITY_OPTIONS = [
  {
    value: "LLC" as const,
    title: "LLC",
    subtitle: "Limited Liability Company",
    pros: ["Ideal para freelancers, consultores y pequeños negocios", "Estructura flexible y simple de mantener", "Los beneficios o pérdidas pasan directamente a los dueños (no paga impuesto corporativo)", "Recomendable si buscás simplicidad y protección personal"],
  },
  {
    value: "C_CORP" as const,
    title: "C Corp",
    subtitle: "C Corporation",
    pros: ["Ideal para startups con inversores o planes de crecer a gran escala", "Permite emitir acciones y atraer capital de inversión", "Requiere reportes y mayor formalidad administrativa", "Recomendable si pensás reinvertir utilidades y expandir tu negocio"],
  },
]

export function Step2EntityType({ onNext }: Step2EntityTypeProps) {
  const router = useRouter()
  const { step2, setStep2Data, setStep3Data } = useOnboardingStore()
  const [hasScrolled, setHasScrolled] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<EntityTypeFormData>({
    resolver: zodResolver(entityTypeSchema),
    defaultValues: {
      entityType: step2?.entityType || undefined,
    },
  })

  const selectedEntity = watch("entityType")

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      if (!hasScrolled && container.scrollLeft > 10) {
        setHasScrolled(true)
      }

      const cardWidth = container.scrollWidth / ENTITY_OPTIONS.length
      const newIndex = Math.round(container.scrollLeft / cardWidth)
      setActiveIndex(newIndex)
    }

    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
  }, [hasScrolled])

  const onSubmit = (data: EntityTypeFormData) => {
    setStep2Data(data)

    if (data.entityType === "C_CORP") {
      setStep3Data({ membershipType: "MULTI" })
      setTimeout(() => {
        router.push("/onboarding/state")
      }, 0)
    } else {
      onNext()
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div
        className={cn(
          "md:hidden sticky top-0 z-10 bg-background/95 backdrop-blur-sm py-3 px-1 -mx-1 transition-opacity duration-300",
          hasScrolled ? "opacity-0 pointer-events-none" : "opacity-100",
        )}
      >
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span>Desliza para ver las {ENTITY_OPTIONS.length} opciones</span>
          <ChevronRight className="h-4 w-4 animate-pulse" />
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex md:grid gap-6 md:grid-cols-2 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory md:snap-none scrollbar-hide pb-2"
      >
        {ENTITY_OPTIONS.map((option) => (
          <Card
            key={option.value}
            className={cn(
              "relative cursor-pointer border-2 p-6 transition-all hover:border-primary/50 flex-shrink-0 w-[80vw] md:w-auto snap-center",
              selectedEntity === option.value ? "border-primary bg-primary/5" : "border-border",
            )}
            onClick={() => setValue("entityType", option.value, { shouldValidate: true })}
          >
            <div className="absolute right-4 top-4">
              {selectedEntity === option.value ? (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                  <Check className="h-4 w-4 text-primary-foreground" />
                </div>
              ) : (
                <div className="h-6 w-6 rounded-full border-2 border-gray-300" />
              )}
            </div>

            <div className="mb-4">
              <h3 className="text-2xl font-bold text-foreground">{option.title}</h3>
              <p className="text-sm text-muted-foreground">{option.subtitle}</p>
            </div>

            <div className="space-y-4">
              <div>
                <ul className="space-y-1.5">
                  {option.pros.map((pro, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-0.5 shrink-0">•</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex md:hidden justify-center gap-2 py-2">
        {ENTITY_OPTIONS.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => {
              const container = scrollContainerRef.current
              if (container) {
                const cardWidth = container.scrollWidth / ENTITY_OPTIONS.length
                container.scrollTo({ left: cardWidth * index, behavior: "smooth" })
              }
            }}
            className={cn(
              "h-2 rounded-full transition-all",
              activeIndex === index ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30",
            )}
            aria-label={`Ver opción ${index + 1}`}
          />
        ))}
      </div>

      {errors.entityType && <p className="text-sm text-destructive">{errors.entityType.message}</p>}

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={() => router.push("/onboarding/contact")}>
          Anterior
        </Button>
        <Button type="submit">Siguiente</Button>
      </div>
    </form>
  )
}
