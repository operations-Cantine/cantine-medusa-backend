import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const service = req.scope.resolve("creditModuleService") as any
  const credits = await service.listCustomerCredits({})
  res.json({ credits, count: credits.length })
}
