import { model } from "@medusajs/framework/utils"

export const LoyaltyTier = model.define("loyalty_tier", {
  id: model.id().primaryKey(),
  name: model.text(),
  min_points: model.number(),
  max_points: model.number().nullable(),
  multiplier: model.float().default(1.0),
  color: model.text().default("#137350"),
  benefits: model.json().nullable(),
  created_at: model.dateTime(),
  updated_at: model.dateTime(),
})

export default LoyaltyTier
