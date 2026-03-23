import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const service = req.scope.resolve("walletModuleService") as any
  const { customer_id, amount, source, reference } = req.body as any
  if (!customer_id || !amount || !source) {
    return res.status(400).json({ error: "customer_id, amount, and source required" })
  }
  const result = await service.deposit(customer_id, amount, source, reference)
  res.json(result)
}
