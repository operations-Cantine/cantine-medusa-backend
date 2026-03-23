import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { sendWebhook } from "./helpers/webhook"

export default async function customerCreatedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  try {
    const walletService = container.resolve("walletModuleService") as any
    const loyaltyService = container.resolve("loyaltyModuleService") as any

    await walletService.getOrCreateWallet(data.id)
    await loyaltyService.getOrCreateCustomerLoyalty(data.id)

    await sendWebhook("customer-created", {
      event: "customer.created",
      customer_id: data.id,
    })
  } catch (error: any) {
    console.error("[Subscriber] customer.created error:", error.message)
  }
}

export const config: SubscriberConfig = { event: "customer.created" }
