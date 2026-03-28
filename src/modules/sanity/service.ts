import { Logger } from "@medusajs/framework/types"
import { SanityClient, createClient } from "@sanity/client"

type ModuleOptions = {
  api_token: string
  project_id: string
  api_version: string
  dataset: "production" | "development"
  studio_url?: string
}

type InjectedDependencies = {
  logger: Logger
}

// Only the fields we actually sync from Medusa
type ProductSyncData = {
  id: string
  title: string
  handle?: string | null
}

class SanityModuleService {
  private client: SanityClient
  private studioUrl?: string
  private logger: Logger

  constructor({ logger }: InjectedDependencies, options: ModuleOptions) {
    this.client = createClient({
      projectId: options.project_id,
      apiVersion: options.api_version,
      dataset: options.dataset,
      token: options.api_token,
    })
    this.logger = logger
    this.studioUrl = options.studio_url
    this.logger.info(`[Sanity] Connected — project: ${options.project_id}, dataset: ${options.dataset}`)
  }

  private transformForCreate(product: ProductSyncData) {
    return {
      _type: "product" as const,
      _id: product.id,
      title: product.title,
      medusaProductId: product.id,
      // Seed slug from Medusa handle — editors can override in Studio
      slug: {
        _type: "slug" as const,
        current: product.handle || product.id,
      },
    }
  }

  private transformForUpdate(product: ProductSyncData) {
    // Only sync title on update — editors own slug, description, SEO, etc.
    return {
      set: {
        title: product.title,
      },
    }
  }

  async upsertProduct(product: ProductSyncData) {
    const existing = await this.client.getDocument(product.id)
    if (existing) {
      return this.updateProduct(product)
    }
    return this.createProduct(product)
  }

  async createProduct(product: ProductSyncData) {
    const doc = this.transformForCreate(product)
    this.logger.info(`[Sanity] Creating product: ${product.id} (${product.title})`)
    // createIfNotExists is idempotent — safe to call even if doc exists
    return this.client.createIfNotExists(doc)
  }

  async updateProduct(product: ProductSyncData) {
    const operations = this.transformForUpdate(product)
    this.logger.info(`[Sanity] Updating product: ${product.id} (${product.title})`)
    return this.client.patch(product.id, operations).commit()
  }

  async retrieve(id: string) {
    return this.client.getDocument(id)
  }

  async delete(id: string) {
    return this.client.delete(id)
  }

  async update(id: string, data: Record<string, unknown>) {
    return this.client.patch(id, { set: data }).commit()
  }

  async list(ids: string[]) {
    const docs = await this.client.getDocuments(ids)
    return docs.map((doc) => ({ id: doc?._id, ...doc }))
  }

  async getStudioLink(id: string) {
    if (!this.studioUrl) {
      throw new Error("[Sanity] No studio URL configured (SANITY_STUDIO_URL)")
    }
    return `${this.studioUrl}/structure/product;${id}`
  }
}

export default SanityModuleService
