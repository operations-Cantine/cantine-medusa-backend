import { model } from "@medusajs/framework/utils"

export const Wallet = model.define("wallet", {
  id: model.id().primaryKey(),
  customer_id: model.text().unique(),
  balance: model.number().default(0),
  status: model.text().default("active"), // active, frozen, suspended
  created_at: model.dateTime(),
  updated_at: model.dateTime(),
})

export default Wallet
