import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const service = req.scope.resolve("deliveryZoneModuleService") as any
  const zones = await service.getActiveZones()
  res.json({ zones })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const service = req.scope.resolve("deliveryZoneModuleService") as any
  const zone = await service.createDeliveryZones(req.body)
  res.json(zone)
}
