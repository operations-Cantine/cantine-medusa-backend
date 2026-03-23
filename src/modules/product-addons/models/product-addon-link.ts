import { model } from "@medusajs/framework/utils"

export const ProductAddonLink = model.define("product_addon_link", {
  id: model.id().primaryKey(),
  product_id: model.text().index("IDX_product_addon_product"),
  addon_category_id: model.text().index("IDX_product_addon_category"),
  created_at: model.dateTime(),
})

export default ProductAddonLink
