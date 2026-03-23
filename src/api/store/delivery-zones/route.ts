import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const service = req.scope.resolve("deliveryZoneModuleService") as any
  const city = req.query.city as string
  const zones = await service.getActiveZones(city)
  res.json({ zones })
}
