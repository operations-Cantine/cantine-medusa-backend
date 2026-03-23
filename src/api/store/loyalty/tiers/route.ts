import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const service = req.scope.resolve("loyaltyModuleService") as any
  const tiers = await service.listLoyaltyTiers({}, { order: { min_points: "ASC" } })
  res.json({ tiers })
}
