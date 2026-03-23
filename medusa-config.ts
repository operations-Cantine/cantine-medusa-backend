import { defineConfig } from "@medusajs/framework/utils"

export default defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS || "http://localhost:8000",
      adminCors: process.env.ADMIN_CORS || "http://localhost:9000",
      authCors: process.env.AUTH_CORS || "http://localhost:8000,http://localhost:9000",
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
  ],
})
