import { defineConfig } from "@medusajs/framework/utils"

export default defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS || "https://cantine-storefront.vercel.app,https://cantine-pos.vercel.app,http://localhost:8000,http://localhost:3001",
      adminCors: process.env.ADMIN_CORS || "https://cantine-restaurant.medusajs.app,http://localhost:9000",
      authCors: process.env.AUTH_CORS || "https://cantine-storefront.vercel.app,https://cantine-pos.vercel.app,https://cantine-restaurant.medusajs.app,http://localhost:8000,http://localhost:9000",
    },
  },
  modules: [
    // Payment providers
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            resolve: "./src/modules/carte-cantine/providers",
            id: "carte-cantine",
            options: {},
          },
        ],
      },
    },
    // Custom modules
    { resolve: "./src/modules/loyalty" },
    { resolve: "./src/modules/carte-cantine" },
    { resolve: "./src/modules/credit" },
    { resolve: "./src/modules/product-addons" },
    { resolve: "./src/modules/delivery-zones" },
    // Sanity CMS — auto-syncs products when created or updated in Medusa
    {
      resolve: "./src/modules/sanity",
      options: {
        api_token: process.env.SANITY_API_TOKEN,
        project_id: process.env.SANITY_PROJECT_ID || "7ory909q",
        api_version: process.env.SANITY_API_VERSION || "2024-01-01",
        dataset: (process.env.SANITY_DATASET as "production" | "development") || "production",
        studio_url: process.env.SANITY_STUDIO_URL,
      },
    },
  ],
})
