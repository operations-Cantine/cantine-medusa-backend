import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { sendWebhook } from "./helpers/webhook"

export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  try {
    const query = container.resolve("query") as any
    const result = await query.graph({
      entity: "order",
      fields: ["id", "display_id", "customer_id", "total", "items.*"],
      filters: { id: data.id },
    })

    const order = result?.data?.[0]
    if (!order) {
      console.error(`[Subscriber] order.placed: order ${data.id} not found`)
      return
    }

    await sendWebhook("order-placed", {
      event: "order.placed",
      order_id: order.id,
      display_id: order.display_id,
      customer_id: order.customer_id,
      total: order.total,
      items_count: order.items?.length || 0,
    })
  } catch (error: any) {
    console.error("[Subscriber] order.placed error:", error.message)
  }
}

export const config: SubscriberConfig = { event: "order.placed" }
