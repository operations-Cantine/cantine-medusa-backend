import { model } from "@medusajs/framework/utils"

export const CustomerLoyalty = model.define("customer_loyalty", {
  id: model.id().primaryKey(),
  customer_id: model.text().unique(),
  current_points: model.number().default(0),
  lifetime_points: model.number().default(0),
  tier_id: model.text().nullable(),
  last_points_at: model.dateTime().nullable(),
  created_at: model.dateTime(),
  updated_at: model.dateTime(),
})

export default CustomerLoyalty
