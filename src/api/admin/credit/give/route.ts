import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const service = req.scope.resolve("creditModuleService") as any
  const { customer_id, amount, description, order_id } = req.body as any
  if (!customer_id || !amount || !description) {
    return res.status(400).json({ error: "customer_id, amount, and description required" })
  }
  const result = await service.giveCredit(customer_id, amount, description, order_id)
  res.json(result)
}
