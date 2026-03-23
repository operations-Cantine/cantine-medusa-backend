const zones = [
  { name: "Aci 2000", slug: "aci-2000", delivery_fee: 500, estimated_time_minutes: 20 },
  { name: "Badalabougou", slug: "badalabougou", delivery_fee: 500, estimated_time_minutes: 25 },
  { name: "Lafiabougou", slug: "lafiabougou", delivery_fee: 750, estimated_time_minutes: 30 },
  { name: "Quinzanbougou", slug: "quinzanbougou", delivery_fee: 500, estimated_time_minutes: 15 },
  { name: "Hamdallaye", slug: "hamdallaye", delivery_fee: 500, estimated_time_minutes: 20 },
  { name: "Hippodrome", slug: "hippodrome", delivery_fee: 750, estimated_time_minutes: 25 },
  { name: "Kalaban Coura", slug: "kalaban-coura", delivery_fee: 1000, estimated_time_minutes: 35 },
  { name: "Magnambougou", slug: "magnambougou", delivery_fee: 1000, estimated_time_minutes: 40 },
]

console.log("Delivery zone seed data ready:")
for (const z of zones) {
  console.log(`  ${z.name}: ${z.delivery_fee} FCFA, ~${z.estimated_time_minutes}min`)
}
console.log(`Total: ${zones.length} zones`)

export { zones }
