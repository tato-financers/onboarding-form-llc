"use server"

import { createClient } from "@/lib/supabase/server"
import type { OnboardingData } from "@/lib/types/onboarding-types"
import { sendToHubspot, createCompanyInHubspot, linkContactToCompany } from "@/lib/integrations/hubspot"

/**
 * Saves lead data (Step 1 only) to the database
 * Returns the application ID for later updates
 */
export async function saveLead(firstName: string, lastName: string, email: string, phone: string) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("applications")
      .insert({
        status: "lead",
        name: `${firstName} ${lastName}`,
        email: email,
        phone: phone,
      })
      .select("id")
      .single()

    if (error) {
      console.error("[v0] Error saving lead:", error)
      return { success: false, error: error.message }
    }

    console.log("[v0] Lead saved successfully:", data.id)
    return { success: true, applicationId: data.id }
  } catch (error) {
    console.error("[v0] Unexpected error saving lead:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Saves or updates a completed application (all steps)
 * If applicationId is provided, updates existing record
 * Otherwise, creates new record or updates by email
 */
export async function saveApplication(data: OnboardingData, applicationId?: string) {
  try {
    if (!data.step1 || !data.step2 || !data.step4) {
      return { success: false, error: "Datos incompletos" }
    }

    if (data.step2.entityType === "LLC" && !data.step3) {
      return { success: false, error: "Tipo de membresía requerido para LLC" }
    }

    const supabase = await createClient()
    const price = calculatePrice(data.step2.entityType, data.step3?.membershipType, data.step4.state)

    const applicationData = {
      status: "completed",
      name: `${data.step1.firstName} ${data.step1.lastName}`,
      email: data.step1.email,
      phone: data.step1.phone,
      entity_type: data.step2.entityType,
      membership_type: data.step3?.membershipType || null,
      state: data.step4.state,
      price,
    }

    let finalApplicationId: string | null = null

    // Caso 1: actualizar por applicationId
    if (applicationId) {
      const { data: updatedData, error } = await supabase
        .from("applications")
        .update(applicationData)
        .eq("id", applicationId)
        .select("id")
        .single()

      if (error) {
        console.error("[v0] Error updating application:", error)
        return { success: false, error: error.message }
      }

      console.log("[v0] Application updated successfully:", updatedData.id)
      finalApplicationId = updatedData.id
    } else {
      // Caso 2: actualizar lead existente
      const { data: existingLead, error: leadError } = await supabase
        .from("applications")
        .select("id")
        .eq("email", data.step1.email)
        .eq("status", "lead")
        .maybeSingle()

      if (leadError) {
        console.error("[v0] Error checking for existing lead:", leadError)
        return { success: false, error: leadError.message }
      }

      if (existingLead) {
        const { data: updatedData, error } = await supabase
          .from("applications")
          .update(applicationData)
          .eq("id", existingLead.id)
          .select("id")
          .single()

        if (error) {
          console.error("[v0] Error updating lead to completed:", error)
          return { success: false, error: error.message }
        }

        console.log("[v0] Lead updated to completed application:", updatedData.id)
        finalApplicationId = updatedData.id
      } else {
        // Caso 3: crear nueva aplicación
        const { data: newData, error } = await supabase
          .from("applications")
          .insert(applicationData)
          .select("id")
          .single()

        if (error) {
          console.error("[v0] Error creating application:", error)
          return { success: false, error: error.message }
        }

        console.log("[v0] Application created successfully:", newData.id)
        finalApplicationId = newData.id
      }
    }

    // Enviar a HubSpot solo una vez
    if (finalApplicationId) {
  // 1. Crear empresa en HubSpot
  const companyResult = await createCompanyInHubspot(data)
  if (!companyResult.success) {
    console.warn("[HubSpot] Falló la creación de empresa:", companyResult.error)
  }

  // 2. Crear contacto en HubSpot
  const hubspotResult = await sendToHubspot(data)
  if (!hubspotResult.success) {
    console.warn("[HubSpot] Falló el envío de contacto:", hubspotResult.error)
  }

  // 3. Asociarlas
  if (companyResult.success && hubspotResult.success) {
  await linkContactToCompany(hubspotResult.contactId, companyResult.companyId)
}

  return {
    success: true,
    applicationId: finalApplicationId,
    contactId: hubspotResult.contactId,
    companyId: companyResult.companyId,
  }
}


    // Fallback por si algo raro pasa
    return { success: false, error: "No se pudo guardar la aplicación" }
  } catch (error) {
    console.error("[v0] Unexpected error saving application:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Helper function to calculate price based on selections
 */
function calculatePrice(
  entityType: "LLC" | "C_CORP",
  membershipType?: "SINGLE" | "MULTI",
  state?: string,
): number | null {
  if (!state) return null

  // C Corp is always $1,300
  if (entityType === "C_CORP") {
    return 1300
  }

  // LLC pricing by state and membership type
  if (!membershipType) return null

  const llcPricing: Record<string, { SINGLE: number; MULTI: number }> = {
    DE: { SINGLE: 1300, MULTI: 1400 },
    FL: { SINGLE: 1000, MULTI: 1000 },
    NM: { SINGLE: 700, MULTI: 800 },
    WA: { SINGLE: 700, MULTI: 800 },
    WY: { SINGLE: 700, MULTI: 800 },
  }

  return llcPricing[state]?.[membershipType] ?? null
}
