import { model } from "@medusajs/framework/utils"

export const CreditTransaction = model.define("credit_transaction", {
  id: model.id().primaryKey(),
  customer_id: model.text().index("IDX_credit_tx_customer"),
  amount: model.number(),
  type: model.text(), // credit_given, credit_repayment, credit_adjustment
  description: model.text(),
  order_id: model.text().nullable(),
  wallet_reload_id: model.text().nullable(),
  balance_after: model.number(),
  created_at: model.dateTime(),
})

export default CreditTransaction
