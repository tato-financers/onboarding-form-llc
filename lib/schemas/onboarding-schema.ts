import { z } from "zod"

// E.164 phone validation regex
const phoneRegex = /^\+[1-9]\d{1,14}$/

// Name validation: letters, spaces, accents, hyphens
const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s-]+$/

export const contactSchema = z.object({
  firstName: z
    .string()
    .min(1, "El nombre es obligatorio")
    .regex(nameRegex, "El nombre solo puede contener letras, espacios y guiones"),
  lastName: z
    .string()
    .min(1, "El apellido es obligatorio")
    .regex(nameRegex, "El apellido solo puede contener letras, espacios y guiones"),
  email: z.string().min(1, "El correo electrónico es obligatorio").email("Formato de correo electrónico inválido"),
  phone: z
    .string()
    .min(1, "El teléfono es obligatorio")
    .regex(phoneRegex, "El teléfono debe incluir el código de país y código interurbano (ej: +12025551234)"),
})

export type ContactFormData = z.infer<typeof contactSchema>

export const entityTypeSchema = z.object({
  entityType: z.enum(["LLC", "C_CORP"], {
    required_error: "Debes seleccionar un tipo de entidad",
  }),
})

export type EntityTypeFormData = z.infer<typeof entityTypeSchema>

export const membershipSchema = z.object({
  membershipType: z.enum(["SINGLE", "MULTI"], {
    required_error: "Debes seleccionar un tipo de membresía",
  }),
})

export type MembershipFormData = z.infer<typeof membershipSchema>

export const stateSchema = z.object({
  state: z.string().min(1, "Debes seleccionar un estado"),
})

export type StateFormData = z.infer<typeof stateSchema>

export const summarySchema = z.object({
  confirmed: z.boolean().refine((val) => val === true, {
    message: "Debes confirmar la información antes de enviar",
  }),
})

export type SummaryFormData = z.infer<typeof summarySchema>
