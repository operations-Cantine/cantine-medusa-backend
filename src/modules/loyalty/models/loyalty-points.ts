import { model } from "@medusajs/framework/utils"

export const LoyaltyPoints = model.define("loyalty_points", {
  id: model.id().primaryKey(),
  customer_id: model.text().index("IDX_loyalty_points_customer"),
  points: model.number(),
  reason: model.text(),
  order_id: model.text().nullable(),
  tier_at_time: model.text().nullable(),
  created_at: model.dateTime(),
})

export default LoyaltyPoints
