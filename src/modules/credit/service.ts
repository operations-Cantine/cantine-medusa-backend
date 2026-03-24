import { MedusaService } from "@medusajs/framework/utils"
import { CustomerCredit } from "./models/customer-credit"
import { CreditTransaction } from "./models/credit-transaction"

export default class CreditModuleService extends MedusaService({
  CustomerCredit,
  CreditTransaction,
}) {
  async getOrCreateCredit(customerId: string) {
    const existing = await this.listCustomerCredits({
      customer_id: customerId,
    })
    if (existing.length > 0) return existing[0]

    return await this.createCustomerCredits({
      customer_id: customerId,
      credit_balance: 0,
      credit_limit: 0,
      is_active: true,
    })
  }

  async giveCredit(
    customerId: string,
    amount: number,
    description: string,
    orderId?: string
  ) {
    const credit = await this.getOrCreateCredit(customerId)
    const newBalance = credit.credit_balance + amount

    await this.createCreditTransactions({
      customer_id: customerId,
      amount,
      type: "credit_given",
      description,
      order_id: orderId || null,
      balance_after: newBalance,
    })

    await this.updateCustomerCredits({ id: credit.id,
      credit_balance: newBalance,
    })

    return { credit_balance: newBalance }
  }

  async repayCredit(
    customerId: string,
    amount: number,
    walletReloadId?: string
  ) {
    const credit = await this.getOrCreateCredit(customerId)
    const repayAmount = Math.min(amount, credit.credit_balance)
    const newBalance = credit.credit_balance - repayAmount

    if (repayAmount > 0) {
      await this.createCreditTransactions({
        customer_id: customerId,
        amount: -repayAmount,
        type: "credit_repayment",
        description: walletReloadId
          ? `Auto-repayment from wallet reload ${walletReloadId}`
          : "Manual credit repayment",
        wallet_reload_id: walletReloadId || null,
        balance_after: newBalance,
      })

      await this.updateCustomerCredits({ id: credit.id,
        credit_balance: newBalance,
      })
    }

    return { repaid: repayAmount, credit_balance: newBalance }
  }

  /**
   * Called when customer reloads Carte Cantine.
   * If they have credit debt, deduct from deposit first.
   * Returns how much was repaid and how much goes to wallet.
   */
  async autoRepayFromDeposit(customerId: string, depositAmount: number) {
    const credit = await this.getOrCreateCredit(customerId)

    if (credit.credit_balance <= 0) {
      return { creditRepaid: 0, remainingForWallet: depositAmount }
    }

    const repayAmount = Math.min(depositAmount, credit.credit_balance)
    const remainingForWallet = depositAmount - repayAmount

    await this.repayCredit(customerId, repayAmount)

    return { creditRepaid: repayAmount, remainingForWallet }
  }

  async getCustomerCredit(customerId: string) {
    return await this.getOrCreateCredit(customerId)
  }

  async getCreditHistory(customerId: string, limit = 50, offset = 0) {
    return await this.listCreditTransactions(
      { customer_id: customerId },
      { order: { created_at: "DESC" }, take: limit, skip: offset }
    )
  }
}
