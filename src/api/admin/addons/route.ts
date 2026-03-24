import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const service = req.scope.resolve("addonModuleService") as any
  const categories = await service.listAddonCategories({}, { order: { display_order: "ASC" } })
  res.json({ categories })
}
