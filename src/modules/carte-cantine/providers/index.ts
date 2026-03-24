import { AbstractPaymentProvider } from "@medusajs/framework/utils"

type Options = {}

export class CarteCantineProvider extends AbstractPaymentProvider<Options> {
  static identifier = "carte-cantine"

  async authorizePayment(input: any): Promise<any> {
    const walletService = this.container_.resolve("walletModuleService") as any
    const customerId = input.context?.customer?.id
    if (!customerId) {
      return { status: "error", data: { error: "Customer required" } }
    }

    const { balance } = await walletService.getBalance(customerId)
    if (balance < input.amount) {
      return { status: "requires_more", data: input.data }
    }

    return {
      status: "authorized",
      data: { ...input.data, customer_id: customerId, authorized_amount: input.amount },
    }
  }

  async capturePayment(input: any): Promise<any> {
    const customerId = input.data?.customer_id
    if (!customerId) {
      return { data: { ...input.data, error: "Missing customer_id" } }
    }
    const walletService = this.container_.resolve("walletModuleService") as any
    const amount = input.data?.authorized_amount || input.amount

    await walletService.spend(customerId, amount, input.data?.order_id || "unknown")

    return {
      data: { ...input.data, captured_at: new Date().toISOString() },
    }
  }

  async refundPayment(input: any): Promise<any> {
    const walletService = this.container_.resolve("walletModuleService") as any
    const customerId = input.data?.customer_id

    await walletService.refund(customerId, input.amount, input.data?.order_id || "unknown")

    return {
      data: { ...input.data, refunded_at: new Date().toISOString() },
    }
  }

  async cancelPayment(input: any): Promise<any> {
    return { data: input.data }
  }

  async getPaymentStatus(input: any): Promise<any> {
    return { status: input.data?.captured_at ? "captured" : "authorized" }
  }

  async initiatePayment(input: any): Promise<any> {
    return { data: input.data || {} }
  }

  async deletePayment(input: any): Promise<any> {
    return { data: input.data }
  }

  async updatePayment(input: any): Promise<any> {
    return { data: input.data }
  }

  async retrievePayment(input: any): Promise<any> {
    return { data: input.data }
  }

  async getWebhookActionAndData(input: any): Promise<any> {
    return { action: "not_supported" }
  }
}

export default CarteCantineProvider
