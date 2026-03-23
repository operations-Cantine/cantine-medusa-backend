import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const service = req.scope.resolve("walletModuleService") as any
  const { customer_id, action } = req.body as any
  if (!customer_id) return res.status(400).json({ error: "customer_id required" })
  const result = action === "unfreeze"
    ? await service.unfreezeWallet(customer_id)
    : await service.freezeWallet(customer_id)
  res.json(result)
}
