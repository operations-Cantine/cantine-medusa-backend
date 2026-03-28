import { defineLink } from "@medusajs/framework/utils"
import ProductModule from "@medusajs/medusa/product"
import { SANITY_MODULE } from "../modules/sanity"

/**
 * Links each Medusa product to its corresponding Sanity document.
 * readOnly: true — Medusa does not own the Sanity record, just references it.
 * Enables `sanity_product.*` field access when querying products.
 */
export default defineLink(
  ProductModule.linkable.product,
  {
    serviceName: SANITY_MODULE,
    alias: "sanity_product",
    primaryKey: "id",
  },
  { readOnly: true }
)
