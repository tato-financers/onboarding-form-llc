import type { EntityType, MembershipType } from "../types/onboarding-types"

// Pricing decision table using state codes
export const PRICING = {
  C_CORP: 1300, // Flat rate for all C Corps
  LLC: {
    DE: { SINGLE: 1300, MULTI: 1400 }, // Delaware
    FL: { SINGLE: 1000, MULTI: 1000 }, // Florida
    NM: { SINGLE: 700, MULTI: 800 }, // New Mexico
    WA: { SINGLE: 700, MULTI: 800 }, // Washington
    WY: { SINGLE: 700, MULTI: 800 }, // Wyoming
    NV: { SINGLE: 700, MULTI: 800 }, // Nevada
  },
} as const

/**
 * Calculate the price based on entity type, membership type, and state code
 */
export function calculatePrice(
  entityType: EntityType,
  membershipType: MembershipType | null,
  stateCode: string,
): number {
  // C Corp has a flat rate regardless of state or membership
  if (entityType === "C_CORP") {
    return PRICING.C_CORP
  }

  // LLC pricing depends on state and membership type
  if (entityType === "LLC" && membershipType) {
    const statePricing = PRICING.LLC[stateCode as keyof typeof PRICING.LLC]

    if (statePricing) {
      return membershipType === "SINGLE" ? statePricing.SINGLE : statePricing.MULTI
    }
  }

  // Fallback for states not in pricing table
  return 0
}

/**
 * Format price as USD currency
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

/**
 * Check if a state has pricing available
 */
export function hasStatePricing(stateCode: string): boolean {
  return stateCode in PRICING.LLC
}
