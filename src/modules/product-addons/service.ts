import { MedusaService } from "@medusajs/framework/utils"
import { AddonCategory } from "./models/addon-category"
import { AddonItem } from "./models/addon-item"
import { ProductAddonLink } from "./models/product-addon-link"

export default class AddonModuleService extends MedusaService({
  AddonCategory,
  AddonItem,
  ProductAddonLink,
}) {
  async getAddonsForProduct(productId: string) {
    const links = await this.listProductAddonLinks({ product_id: productId })
    const categoryIds = links.map((l: any) => l.addon_category_id)

    if (categoryIds.length === 0) return []

    const categories = await this.listAddonCategories(
      { id: categoryIds },
      { order: { display_order: "ASC" } }
    )

    const result = []
    for (const cat of categories) {
      const items = await this.listAddonItems(
        { addon_category_id: cat.id, is_active: true },
        { order: { display_order: "ASC" } }
      )
      result.push({ ...cat, items })
    }

    return result
  }

  async linkProductToAddonCategory(productId: string, addonCategoryId: string) {
    const existing = await this.listProductAddonLinks({
      product_id: productId,
      addon_category_id: addonCategoryId,
    })
    if (existing.length > 0) return existing[0]

    return await this.createProductAddonLinks({
      product_id: productId,
      addon_category_id: addonCategoryId,
    })
  }

  async unlinkProductFromAddonCategory(productId: string, addonCategoryId: string) {
    const links = await this.listProductAddonLinks({
      product_id: productId,
      addon_category_id: addonCategoryId,
    })
    if (links.length > 0) {
      await this.deleteProductAddonLinks(links[0].id)
    }
  }

  async validateAddonSelection(productId: string, selectedAddonIds: string[]) {
    const addons = await this.getAddonsForProduct(productId)
    const errors: string[] = []

    for (const cat of addons) {
      const selected = cat.items.filter((i: any) => selectedAddonIds.includes(i.id))
      if (cat.is_required && selected.length === 0) {
        errors.push(`${cat.name} is required`)
      }
      if (selected.length > cat.max_selections) {
        errors.push(`${cat.name}: max ${cat.max_selections} selections`)
      }
    }

    return { valid: errors.length === 0, errors }
  }

  async calculateAddonTotal(selectedAddonIds: string[]) {
    if (selectedAddonIds.length === 0) return 0
    const items = await this.listAddonItems({ id: selectedAddonIds })
    return items.reduce((sum: number, item: any) => sum + (item.price || 0), 0)
  }
}
