/**
 * Seed loyalty tiers — run via: medusa exec src/scripts/seed-loyalty-tiers.ts
 */
import type { ExecArgs } from "@medusajs/framework/types"

export default async function seedLoyaltyTiers({ container }: ExecArgs) {
  const loyaltyService = container.resolve("loyaltyModuleService") as any

  const tiers = [
    { name: "Membre", min_points: 0, max_points: 499, multiplier: 1.0, color: "#137350", benefits: { description: "Bienvenue dans la famille La Cantine" } },
    { name: "Argent", min_points: 500, max_points: 1999, multiplier: 1.2, color: "#6B7280", benefits: { description: "1.2x points, offres exclusives" } },
    { name: "Or", min_points: 2000, max_points: 4999, multiplier: 1.5, color: "#B8860B", benefits: { description: "1.5x points, livraison prioritaire" } },
    { name: "Platine", min_points: 5000, max_points: null, multiplier: 2.0, color: "#6B21A8", benefits: { description: "2x points, livraison gratuite, accès VIP" } },
  ]

  for (const tier of tiers) {
    const existing = await loyaltyService.listLoyaltyTiers({ name: tier.name })
    if (existing.length > 0) {
      console.log(`  ⊘ ${tier.name} already exists, skipping`)
      continue
    }
    await loyaltyService.createLoyaltyTiers(tier)
    console.log(`  ✓ ${tier.name} (${tier.min_points}-${tier.max_points || '∞'} pts, ${tier.multiplier}x)`)
  }

  console.log(`Done: ${tiers.length} tiers processed`)
}
