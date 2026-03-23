import { MedusaService } from "@medusajs/framework/utils"
import { DeliveryZone } from "./models/delivery-zone"

export default class DeliveryZoneModuleService extends MedusaService({
  DeliveryZone,
}) {
  async getActiveZones(city?: string) {
    const filters: any = { is_active: true }
    if (city) filters.city = city
    return await this.listDeliveryZones(filters, { order: { display_order: "ASC" } })
  }

  async getDeliveryFee(zoneId: string) {
    const zone = await this.retrieveDeliveryZone(zoneId)
    return { fee: zone.delivery_fee, name: zone.name, estimated_minutes: zone.estimated_time_minutes }
  }

  async findZoneByName(name: string) {
    const zones = await this.listDeliveryZones({ is_active: true })
    const normalized = name.toLowerCase().trim()
    return zones.find((z: any) =>
      z.name.toLowerCase().includes(normalized) ||
      z.slug.includes(normalized)
    ) || null
  }
}
