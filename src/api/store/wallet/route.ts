import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const customerId = (req as any).auth_context?.actor_id
  if (!customerId) return res.status(401).json({ error: "Unauthorized" })
  const service = req.scope.resolve("walletModuleService") as any
  const balance = await service.getBalance(customerId)
  res.json(balance)
}
