import { model } from "@medusajs/framework/utils"

export const AddonItem = model.define("addon_item", {
  id: model.id().primaryKey(),
  addon_category_id: model.text().index("IDX_addon_item_category"),
  name: model.text(),
  description: model.text().nullable(),
  price: model.number().default(0),
  is_active: model.boolean().default(true),
  display_order: model.number().default(0),
  created_at: model.dateTime(),
  updated_at: model.dateTime(),
})

export default AddonItem
