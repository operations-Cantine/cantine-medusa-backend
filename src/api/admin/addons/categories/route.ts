import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const service = req.scope.resolve("addonModuleService") as any
  const result = await service.createAddonCategorys(req.body)
  res.json(result)
}
