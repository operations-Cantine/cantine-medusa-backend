import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { sanitySyncProductsWorkflow } from "../workflows/sanity-sync-products"

/**
 * Fires on product.created and product.updated.
 * Triggers the Sanity sync workflow for the affected product only.
 */
export default async function sanityProductSyncHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  try {
    await sanitySyncProductsWorkflow(container).run({
      input: { product_ids: [data.id] },
    })
  } catch (error: any) {
    console.error("[Subscriber] sanity-product-sync error:", error.message)
  }
}

export const config: SubscriberConfig = {
  event: ["product.created", "product.updated"],
}
