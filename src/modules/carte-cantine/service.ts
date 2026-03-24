import { MedusaService } from "@medusajs/framework/utils"
import { Wallet } from "./models/wallet"
import { WalletTransaction } from "./models/wallet-transaction"

const MIN_DEPOSIT = 1000
const MAX_DEPOSIT = 100000
const MAX_BALANCE = 500000
const LOW_BALANCE_THRESHOLD = 1000
const DEFAULT_BONUS_PCT = 10

type InjectedDependencies = {
  logger: any
  creditModuleService?: any
}

export default class WalletModuleService extends MedusaService({
  Wallet,
  WalletTransaction,
}) {
  protected logger_: any
  protected creditService_: any

  constructor(deps: InjectedDependencies) {
    super(...arguments)
    this.logger_ = deps.logger
    this.creditService_ = deps.creditModuleService
  }

  async getOrCreateWallet(customerId: string) {
    const existing = await this.listWallets({ customer_id: customerId })
    if (existing.length > 0) return existing[0]

    return await this.createWallets({
      customer_id: customerId,
      balance: 0,
      status: "active",
    })
  }

  async getBalance(customerId: string) {
    const wallet = await this.getOrCreateWallet(customerId)
    return {
      balance: wallet.balance,
      status: wallet.status,
      low_balance: wallet.balance < LOW_BALANCE_THRESHOLD,
    }
  }

  async deposit(
    customerId: string,
    amount: number,
    source: string,
    reference?: string
  ) {
    if (amount < MIN_DEPOSIT) throw new Error(`Minimum deposit is ${MIN_DEPOSIT} FCFA`)
    if (amount > MAX_DEPOSIT) throw new Error(`Maximum deposit is ${MAX_DEPOSIT} FCFA`)

    const wallet = await this.getOrCreateWallet(customerId)
    if (wallet.status !== "active") throw new Error("Wallet is frozen or suspended")

    let runningBalance = wallet.balance
    let actualDeposit = amount
    let creditRepaid = 0

    // Auto-repay credit debt first
    if (this.creditService_) {
      const repayResult = await this.creditService_.autoRepayFromDeposit(customerId, amount)
      creditRepaid = repayResult.creditRepaid
      actualDeposit = repayResult.remainingForWallet

      if (creditRepaid > 0) {
        // Credit repayment doesn't change wallet balance — money goes to debt
        await this.createWalletTransactions({
          wallet_id: wallet.id,
          customer_id: customerId,
          type: "credit_repayment",
          amount: -creditRepaid,
          balance_after: runningBalance,
          source: "credit_repayment",
          reference,
          description: `Credit repayment of ${creditRepaid} FCFA from deposit`,
        })
      }
    }

    // Check MAX_BALANCE cap before adding
    const bonus = Math.floor(actualDeposit * DEFAULT_BONUS_PCT / 100)
    const totalToAdd = actualDeposit + bonus
    const cappedTotal = Math.min(totalToAdd, MAX_BALANCE - runningBalance)

    if (cappedTotal <= 0) {
      throw new Error(`Wallet balance would exceed maximum of ${MAX_BALANCE} FCFA`)
    }

    // Proportionally reduce deposit and bonus if capped
    const cappedDeposit = cappedTotal === totalToAdd ? actualDeposit : Math.min(actualDeposit, cappedTotal)
    const cappedBonus = cappedTotal - cappedDeposit

    // Record deposit transaction
    runningBalance += cappedDeposit
    await this.createWalletTransactions({
      wallet_id: wallet.id,
      customer_id: customerId,
      type: "deposit",
      amount: cappedDeposit,
      balance_after: runningBalance,
      source,
      reference,
      description: creditRepaid > 0
        ? `Deposit after ${creditRepaid} FCFA credit repayment`
        : null,
    })

    // Record bonus transaction
    if (cappedBonus > 0) {
      runningBalance += cappedBonus
      await this.createWalletTransactions({
        wallet_id: wallet.id,
        customer_id: customerId,
        type: "bonus",
        amount: cappedBonus,
        balance_after: runningBalance,
        source: "system",
        description: `${DEFAULT_BONUS_PCT}% deposit bonus`,
      })
    }

    await this.updateWallets({ id: wallet.id, balance: runningBalance })

    return {
      balance: runningBalance,
      deposited: cappedDeposit,
      bonus: cappedBonus,
      credit_repaid: creditRepaid,
      capped: cappedTotal < totalToAdd,
    }
  }

  async spend(
    customerId: string,
    amount: number,
    orderId: string,
    description?: string
  ) {
    const wallet = await this.getOrCreateWallet(customerId)
    if (wallet.status !== "active") throw new Error("Wallet is frozen")
    if (wallet.balance < amount) throw new Error("Insufficient balance")

    const newBalance = wallet.balance - amount

    await this.createWalletTransactions({
      wallet_id: wallet.id,
      customer_id: customerId,
      type: "spend",
      amount: -amount,
      balance_after: newBalance,
      source: "system",
      order_id: orderId,
      description,
    })

    await this.updateWallets({ id: wallet.id, balance: newBalance })
    return { balance: newBalance }
  }

  async refund(
    customerId: string,
    amount: number,
    orderId: string,
    description?: string
  ) {
    const wallet = await this.getOrCreateWallet(customerId)
    const newBalance = wallet.balance + amount

    await this.createWalletTransactions({
      wallet_id: wallet.id,
      customer_id: customerId,
      type: "refund",
      amount,
      balance_after: newBalance,
      source: "system",
      order_id: orderId,
      description: description || "Order refund",
    })

    await this.updateWallets({ id: wallet.id, balance: newBalance })
    return { balance: newBalance }
  }

  async getTransactions(customerId: string, limit = 50, offset = 0) {
    return await this.listWalletTransactions(
      { customer_id: customerId },
      { order: { created_at: "DESC" }, take: limit, skip: offset }
    )
  }

  async freezeWallet(customerId: string) {
    const wallet = await this.getOrCreateWallet(customerId)
    await this.updateWallets({ id: wallet.id, status: "frozen" })
    return { status: "frozen" }
  }

  async unfreezeWallet(customerId: string) {
    const wallet = await this.getOrCreateWallet(customerId)
    await this.updateWallets({ id: wallet.id, status: "active" })
    return { status: "active" }
  }
}
