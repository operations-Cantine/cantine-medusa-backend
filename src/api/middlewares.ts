import { defineMiddlewares, authenticate } from "@medusajs/framework/http"

export default defineMiddlewares({
  routes: [
    // Admin routes — require admin auth
    { matcher: "/admin/loyalty*", middlewares: [authenticate("user", ["session", "bearer", "api-key"])] },
    { matcher: "/admin/wallet*", middlewares: [authenticate("user", ["session", "bearer", "api-key"])] },
    { matcher: "/admin/credit*", middlewares: [authenticate("user", ["session", "bearer", "api-key"])] },
    { matcher: "/admin/addons*", middlewares: [authenticate("user", ["session", "bearer", "api-key"])] },
    { matcher: "/admin/delivery-zones*", middlewares: [authenticate("user", ["session", "bearer", "api-key"])] },
    // Store routes — require customer auth
    { matcher: "/store/loyalty*", middlewares: [authenticate("customer", ["session", "bearer"])] },
    { matcher: "/store/wallet*", middlewares: [authenticate("customer", ["session", "bearer"])] },
    { matcher: "/store/credit*", middlewares: [authenticate("customer", ["session", "bearer"])] },
    // Public store routes — no auth needed
    // /store/loyalty/tiers, /store/addons/products, /store/delivery-zones
  ],
})
