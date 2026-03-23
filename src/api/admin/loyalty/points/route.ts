import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const service = req.scope.resolve("loyaltyModuleService") as any
  const { customer_id, points, reason } = req.body as any
  if (!customer_id || !points || !reason) {
    return res.status(400).json({ error: "customer_id, points, and reason required" })
  }
  const result = points > 0
    ? await service.awardPoints(customer_id, points, reason)
    : await service.deductPoints(customer_id, Math.abs(points), reason)
  res.json(result)
}
