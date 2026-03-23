import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { sendWebhook } from "./helpers/webhook"

export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const loyaltyService = container.resolve("loyaltyModuleService") as any

  try {
    const query = container.resolve("query") as any
    const { data: [order] } = await query.graph({
      entity: "order",
      fields: ["id", "display_id", "customer_id", "total", "items.*"],
      filters: { id: data.id },
    })

    if (order?.customer_id) {
      const loyalty = await loyaltyService.getOrCreateCustomerLoyalty(order.customer_id)
      const points = await loyaltyService.calculatePointsForOrder(order.total, loyalty.tier_id)
      if (points > 0) {
        await loyaltyService.awardPoints(order.customer_id, points, "Order placed", order.id)
      }
    }

    await sendWebhook("order-placed", {
      event: "order.placed",
      order_id: order?.id,
      display_id: order?.display_id,
      customer_id: order?.customer_id,
      total: order?.total,
      items_count: order?.items?.length || 0,
    })
  } catch (error: any) {
    console.error("[Subscriber] order.placed error:", error.message)
  }
}

export const config: SubscriberConfig = { event: "order.placed" }
