import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { syncStep } from "./steps/sync"

export type SanitySyncProductsInput = {
  product_ids?: string[]
}

/**
 * Syncs Medusa products to Sanity CMS.
 * - Pass product_ids to sync specific products (used by the subscriber)
 * - Pass nothing to bulk-sync all products (used for initial migration)
 */
export const sanitySyncProductsWorkflow = createWorkflow(
  "sanity-sync-products",
  (input: SanitySyncProductsInput) => {
    const result = syncStep(input)
    return new WorkflowResponse(result)
  }
)
