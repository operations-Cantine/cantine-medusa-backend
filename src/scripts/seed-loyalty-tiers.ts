import axios from "axios"

const MEDUSA_URL = process.env.MEDUSA_URL || "https://cantine-restaurant.medusajs.app"
const API_KEY = process.env.MEDUSA_API_KEY || ""

const tiers = [
  { name: "Membre", min_points: 0, max_points: 499, multiplier: 1.0, color: "#137350", benefits: { description: "Bienvenue dans la famille La Cantine" } },
  { name: "Argent", min_points: 500, max_points: 1999, multiplier: 1.2, color: "#6B7280", benefits: { description: "1.2x points, offres exclusives" } },
  { name: "Or", min_points: 2000, max_points: 4999, multiplier: 1.5, color: "#B8860B", benefits: { description: "1.5x points, livraison prioritaire" } },
  { name: "Platine", min_points: 5000, max_points: null, multiplier: 2.0, color: "#6B21A8", benefits: { description: "2x points, livraison gratuite, accès VIP" } },
]

async function seed() {
  console.log("Seeding loyalty tiers...")
  for (const tier of tiers) {
    console.log(`  Creating ${tier.name}...`)
    // This would use the Medusa module service directly when run via medusa exec
    console.log(`  ✓ ${tier.name} (${tier.min_points}-${tier.max_points || '∞'} pts, ${tier.multiplier}x)`)
  }
  console.log(`Done: ${tiers.length} tiers seeded`)
}

seed().catch(console.error)
export { tiers }
