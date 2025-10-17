// lib/integrations/hubspot.ts
import type { OnboardingData } from "@/lib/types/onboarding-types"

export async function sendToHubspot(data: OnboardingData) {
  if (!data.step1) return { success: false, error: "Faltan datos de contacto" }

  const payload = {
    properties: {
      email: data.step1.email,
      firstname: data.step1.firstName,
      lastname: data.step1.lastName,
      phone: data.step1.phone,
    //   tipo_de_compania_en_usa_test: data.step2?.entityType || "",
    //   tipo_de_sociedad_de_la_compania_americana: data.step3?.membershipType || "",
    //   estado_de_la_compania_americana: data.step4?.state || "",
    },
  }

  try {
    const res = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const error = await res.json()
      console.error("[HubSpot] Error:", error)
      return { success: false, error: error.message || "Error al enviar a HubSpot" }
    }

    const result = await res.json()
    console.log("[HubSpot] Contacto creado:", result.id)
    return { success: true, contactId: result.id }
  } catch (error) {
    console.error("[HubSpot] Error inesperado:", error)
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" }
  }
}

export async function createCompanyInHubspot(data: OnboardingData) {

const membershipTypeMap : Record<string, string> = {
  SINGLE: "Single Member",
  MULTI: "Multi Member",
}

const stateMap: Record<string, string> = {
  WY: "Wyoming",
  NM: "New Mexico",
  FL: "Florida",
  DE: "Dellaware",
}
const membership = data.step3?.membershipType ?? ""
const stateType = data.step4?.state ?? ""

  const payload = {
    properties: {
      // name: `${data.step2?.entityType} | ${data.step1?.firstName} ${data.step1?.lastName} ` ,
      tipo_de_compania_en_usa_test: data.step2?.entityType || "",
      tipo_de_sociedad_de_la_compania_americana: membershipTypeMap[membership]|| "",
      estado_de_la_compania_americana: stateMap[stateType] || "",
    },
  }

  try {
    const res = await fetch("https://api.hubapi.com/crm/v3/objects/companies", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const error = await res.json()
      console.error("[HubSpot] Error al crear empresa:", error)
      return { success: false, error: error.message || "Error al crear empresa en HubSpot" }
    }

    const result = await res.json()
    console.log("[HubSpot] Empresa creada:", result.id)
    return { success: true, companyId: result.id }
  } catch (error) {
    console.error("[HubSpot] Error inesperado (empresa):", error)
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" }
  }
}

// Link company with contact
export async function linkContactToCompany(contactId: string, companyId: string) {
  try {
    const res = await fetch(
      `https://api.hubapi.com/crm/v3/objects/contacts/${contactId}/associations/companies/${companyId}/contact_to_company`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    )

    if (!res.ok) {
      const error = await res.json()
      console.error("[HubSpot] Falló la asociación contacto-empresa:", error)
      return { success: false, error: error.message || "Error al asociar contacto con empresa" }
    }

    console.log("[HubSpot] Asociación contacto-empresa exitosa")
    return { success: true }
  } catch (error) {
    console.error("[HubSpot] Error inesperado (asociación):", error)
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" }
  }
}

