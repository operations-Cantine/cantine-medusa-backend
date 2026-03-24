import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { sendWebhook } from "./helpers/webhook"

export default async function orderCompletedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  try {
    const query = container.resolve("query") as any
    const loyaltyService = container.resolve("loyaltyModuleService") as any

    const result = await query.graph({
      entity: "order",
      fields: ["id", "display_id", "customer_id", "total"],
      filters: { id: data.id },
    })

    const order = result?.data?.[0]
    if (!order) {
      console.error(`[Subscriber] order.completed: order ${data.id} not found`)
      return
    }

    // Award loyalty points only when order is COMPLETED (paid + fulfilled)
    if (order.customer_id) {
      const loyalty = await loyaltyService.getOrCreateCustomerLoyalty(order.customer_id)
      const points = await loyaltyService.calculatePointsForOrder(order.total, loyalty.tier_id)
      if (points > 0) {
        await loyaltyService.awardPoints(order.customer_id, points, "Order completed", order.id)
      }
    }

    await sendWebhook("order-completed", {
      event: "order.completed",
      order_id: order.id,
      display_id: order.display_id,
      customer_id: order.customer_id,
      total: order.total,
    })
  } catch (error: any) {
    console.error("[Subscriber] order.completed error:", error.message)
  }
}

export const config: SubscriberConfig = { event: "order.completed" }
