import { model } from "@medusajs/framework/utils"

export const AddonCategory = model.define("addon_category", {
  id: model.id().primaryKey(),
  name: model.text(),
  slug: model.text().unique(),
  display_order: model.number().default(0),
  is_required: model.boolean().default(false),
  max_selections: model.number().default(1),
  created_at: model.dateTime(),
  updated_at: model.dateTime(),
})

export default AddonCategory
