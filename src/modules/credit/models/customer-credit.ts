import { model } from "@medusajs/framework/utils"

export const CustomerCredit = model.define("customer_credit", {
  id: model.id().primaryKey(),
  customer_id: model.text().unique(),
  credit_balance: model.number().default(0),
  credit_limit: model.number().default(0),
  is_active: model.boolean().default(true),
  created_at: model.dateTime(),
  updated_at: model.dateTime(),
})

export default CustomerCredit
