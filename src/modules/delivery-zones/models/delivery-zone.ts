import { model } from "@medusajs/framework/utils"

export const DeliveryZone = model.define("delivery_zone", {
  id: model.id().primaryKey(),
  name: model.text(),
  slug: model.text().unique(),
  city: model.text().default("Bamako"),
  delivery_fee: model.number(),
  estimated_time_minutes: model.number().nullable(),
  is_active: model.boolean().default(true),
  display_order: model.number().default(0),
  coordinates: model.json().nullable(),
  created_at: model.dateTime(),
  updated_at: model.dateTime(),
})

export default DeliveryZone
