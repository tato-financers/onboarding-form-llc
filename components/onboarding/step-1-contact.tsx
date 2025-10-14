"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { contactSchema, type ContactFormData } from "@/lib/schemas/onboarding-schema"
import { useOnboardingStore } from "@/lib/stores/onboarding-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, Loader2 } from "lucide-react"
import { saveLead } from "@/lib/actions/applications"
import { useToast } from "@/hooks/use-toast"

interface Step1ContactProps {
  onNext: () => void
}

export function Step1Contact({ onNext }: Step1ContactProps) {
  const { step1, setStep1Data, setApplicationId } = useOnboardingStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: "onChange",
    defaultValues: step1 || {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)

    try {
      // Save to database as lead
      const result = await saveLead(data.firstName, data.lastName, data.email, data.phone)

      if (result.success && result.applicationId) {
        console.log("[v0] Lead saved with ID:", result.applicationId)
        // Save application ID to store for later updates
        setApplicationId(result.applicationId)
        // Save contact data to store
        setStep1Data(data)
        onNext()
      } else {
        console.error("[v0] Failed to save lead:", result.error)
        toast({
          title: "Error al guardar",
          description: result.error || "Hubo un problema al guardar tu información. Por favor intenta de nuevo.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Unexpected error saving lead:", error)
      toast({
        title: "Error inesperado",
        description: "Hubo un problema al guardar tu información. Por favor intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4 py-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">
              Nombre <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="firstName"
                  className={errors.firstName ? "border-destructive" : ""}
                  disabled={isSubmitting}
                />
              )}
            />
            {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">
              Apellido <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="lastName"
                  className={errors.lastName ? "border-destructive" : ""}
                  disabled={isSubmitting}
                />
              )}
            />
            {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email">
              Correo electrónico <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="email"
                  type="email"
                  className={errors.email ? "border-destructive" : ""}
                  disabled={isSubmitting}
                />
              )}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="phone">
              Teléfono <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="phone"
                  type="tel"
                  className={errors.phone ? "border-destructive" : ""}
                  disabled={isSubmitting}
                />
              )}
            />
            {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
            <p className="text-xs text-muted-foreground">Por favor incluye el código de país y código interurbano (ej: +12025551234)</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={!isValid || isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              Siguiente
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center hidden">
        Al continuar, aceptas nuestra {" "}
        <a href="#" className="underline hover:text-foreground">
          Política de Privacidad
        </a>
      </p>
    </form>
  )
}
