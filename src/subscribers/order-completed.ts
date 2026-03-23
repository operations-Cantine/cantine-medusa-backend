import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { sendWebhook } from "./helpers/webhook"

export default async function orderCompletedHandler({
  event: { data },
}: SubscriberArgs<{ id: string }>) {
  await sendWebhook("order-completed", {
    event: "order.completed",
    order_id: data.id,
  })
}

export const config: SubscriberConfig = { event: "order.completed" }
