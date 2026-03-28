import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { SANITY_MODULE } from "../../../modules/sanity"
import SanityModuleService from "../../../modules/sanity/service"

export type SyncStepInput = {
  product_ids?: string[]
}

export const syncStep = createStep(
  "sanity-sync-step",
  async (input: SyncStepInput, { container }) => {
    const sanity: SanityModuleService = container.resolve(SANITY_MODULE)
    const query = container.resolve(ContainerRegistrationKeys.QUERY)

    let offset = 0
    const batchSize = 100
    let hasMore = true
    let total = 0
    const errors: string[] = []

    const filters: Record<string, unknown> = input.product_ids?.length
      ? { id: input.product_ids }
      : {}

    while (hasMore) {
      const { data: products, metadata } = await query.graph({
        entity: "product",
        fields: ["id", "title", "handle"],
        filters,
        pagination: { skip: offset, take: batchSize, order: { id: "ASC" } },
      })

      const count = (metadata as any)?.count ?? 0

      // Use allSettled so one failure doesn't abort the rest of the batch
      await Promise.allSettled(
        products.map(async (product: any) => {
          try {
            await sanity.upsertProduct(product)
            total++
          } catch (err: any) {
            errors.push(`${product.id}: ${err.message}`)
          }
        })
      )

      offset += batchSize
      hasMore = offset < count
    }

    if (errors.length > 0) {
      console.error(`[Sanity sync] ${errors.length} error(s):`, errors)
    }

    return new StepResponse({ total, errors })
  }
)
