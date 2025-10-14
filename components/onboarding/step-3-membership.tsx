"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { membershipSchema, type MembershipFormData } from "@/lib/schemas/onboarding-schema"
import { useOnboardingStore } from "@/lib/stores/onboarding-store"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, User, Users, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useRef, useEffect } from "react"

interface Step3MembershipProps {
  onNext: () => void
}

const MEMBERSHIP_OPTIONS = [
  {
    value: "SINGLE" as const,
    title: "Single Member",
    subtitle: "Un solo propietario",
    icon: User,
    description: "Ideal para freelancers y negocios unipersonales en etapa inicial. Para operaciones individuales que priorizan simplicidad y control directo. Estructura ágil, administración mínima y costos previsibles. Ingresos y gastos se consolidan en la tributación personal del titular, facilitando el seguimiento financiero.",
  },
  {
    value: "MULTI" as const,
    title: "Multi Member",
    subtitle: "Múltiples propietarios",
    icon: Users,
    description: "Diseñada para dos o más socios con reglas claras, disciplina operativa y transparencia. Las utilidades se asignan según lo pactado entre los socios. Exige mayor formalidad y registros ordenados; a cambio, habilita a sumar capital, profesionalizar la gestión y escalar con gobierno corporativo.",
  },
]

export function Step3Membership({ onNext }: Step3MembershipProps) {
  const router = useRouter()
  const { step3, setStep3Data } = useOnboardingStore()
  const [hasScrolled, setHasScrolled] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<MembershipFormData>({
    resolver: zodResolver(membershipSchema),
    defaultValues: {
      membershipType: step3?.membershipType || undefined,
    },
  })

  const selectedMembership = watch("membershipType")

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      if (!hasScrolled && container.scrollLeft > 10) {
        setHasScrolled(true)
      }

      const cardWidth = container.scrollWidth / MEMBERSHIP_OPTIONS.length
      const newIndex = Math.round(container.scrollLeft / cardWidth)
      setActiveIndex(newIndex)
    }

    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
  }, [hasScrolled])

  const onSubmit = (data: MembershipFormData) => {
    setStep3Data(data)
    onNext()
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
          <span>Desliza para ver las {MEMBERSHIP_OPTIONS.length} opciones</span>
          <ChevronRight className="h-4 w-4 animate-pulse" />
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex md:grid gap-6 md:grid-cols-2 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory md:snap-none scrollbar-hide pb-2"
      >
        {MEMBERSHIP_OPTIONS.map((option) => {
          const Icon = option.icon
          return (
            <Card
              key={option.value}
              className={cn(
                "relative cursor-pointer border-2 p-6 transition-all hover:border-primary/50 flex-shrink-0 w-[80vw] md:w-auto snap-center",
                selectedMembership === option.value ? "border-primary bg-primary/5" : "border-border",
              )}
              onClick={() => setValue("membershipType", option.value, { shouldValidate: true })}
            >
              <div className="absolute right-4 top-4">
                {selectedMembership === option.value ? (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                    <Check className="h-4 w-4 text-primary-foreground" />
                  </div>
                ) : (
                  <div className="h-6 w-6 rounded-full border-2 border-gray-300" />
                )}
              </div>

              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{option.title}</h3>
                  <p className="text-sm text-muted-foreground">{option.subtitle}</p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">{option.description}</p>
            </Card>
          )
        })}
      </div>

      <div className="flex md:hidden justify-center gap-2 py-2">
        {MEMBERSHIP_OPTIONS.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => {
              const container = scrollContainerRef.current
              if (container) {
                const cardWidth = container.scrollWidth / MEMBERSHIP_OPTIONS.length
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

      {errors.membershipType && <p className="text-sm text-destructive">{errors.membershipType.message}</p>}

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={() => router.push("/onboarding/entity-type")}>
          Anterior
        </Button>
        <Button type="submit">Siguiente</Button>
      </div>
    </form>
  )
}
