import { model } from "@medusajs/framework/utils"

export const WalletTransaction = model.define("wallet_transaction", {
  id: model.id().primaryKey(),
  wallet_id: model.text().index("IDX_wallet_tx_wallet"),
  customer_id: model.text().index("IDX_wallet_tx_customer"),
  type: model.text(), // deposit, spend, refund, bonus, adjustment, reverse, transfer, credit_repayment
  amount: model.number(), // positive for deposits, negative for spends
  balance_after: model.number(),
  source: model.text(), // orange_money, moov_money, wave, cash, bank_transfer, bank_deposit, admin, system, credit_repayment
  reference: model.text().nullable(),
  order_id: model.text().nullable(),
  description: model.text().nullable(),
  created_at: model.dateTime(),
})

export default WalletTransaction
