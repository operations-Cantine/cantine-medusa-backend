import { MedusaService } from "@medusajs/framework/utils"
import { LoyaltyTier } from "./models/loyalty-tier"
import { LoyaltyPoints } from "./models/loyalty-points"
import { CustomerLoyalty } from "./models/customer-loyalty"

type InjectedDependencies = {
  logger: any
}

export default class LoyaltyModuleService extends MedusaService({
  LoyaltyTier,
  LoyaltyPoints,
  CustomerLoyalty,
}) {
  protected logger_: any

  constructor({ logger }: InjectedDependencies) {
    super(...arguments)
    this.logger_ = logger
  }

  async getOrCreateCustomerLoyalty(customerId: string) {
    const existing = await this.listCustomerLoyaltys({
      customer_id: customerId,
    })
    if (existing.length > 0) return existing[0]

    const tiers = await this.listLoyaltyTiers({ name: "Membre" })
    const defaultTier = tiers[0]

    return await this.createCustomerLoyaltys({
      customer_id: customerId,
      current_points: 0,
      lifetime_points: 0,
      tier_id: defaultTier?.id || null,
    })
  }

  async awardPoints(
    customerId: string,
    points: number,
    reason: string,
    orderId?: string
  ) {
    const loyalty = await this.getOrCreateCustomerLoyalty(customerId)
    const tier = loyalty.tier_id
      ? await this.retrieveLoyaltyTier(loyalty.tier_id)
      : null

    await this.createLoyaltyPointss({
      customer_id: customerId,
      points,
      reason,
      order_id: orderId || null,
      tier_at_time: tier?.name || "Membre",
    })

    const newPoints = loyalty.current_points + points
    const newLifetime = loyalty.lifetime_points + points

    await this.updateCustomerLoyaltys(loyalty.id, {
      current_points: newPoints,
      lifetime_points: newLifetime,
      last_points_at: new Date(),
    })

    await this.checkTierUpgrade(customerId)

    return { current_points: newPoints, lifetime_points: newLifetime }
  }

  async deductPoints(customerId: string, points: number, reason: string) {
    const loyalty = await this.getOrCreateCustomerLoyalty(customerId)
    const newPoints = Math.max(0, loyalty.current_points - points)

    await this.createLoyaltyPointss({
      customer_id: customerId,
      points: -points,
      reason,
    })

    await this.updateCustomerLoyaltys(loyalty.id, {
      current_points: newPoints,
    })

    return { current_points: newPoints }
  }

  async getCustomerLoyalty(customerId: string) {
    const loyalty = await this.getOrCreateCustomerLoyalty(customerId)
    const tier = loyalty.tier_id
      ? await this.retrieveLoyaltyTier(loyalty.tier_id)
      : null
    return { ...loyalty, tier }
  }

  async calculatePointsForOrder(orderTotal: number, tierId?: string) {
    let multiplier = 1.0
    if (tierId) {
      const tier = await this.retrieveLoyaltyTier(tierId)
      multiplier = tier.multiplier || 1.0
    }
    // 1 point per 100 FCFA, multiplied by tier
    const basePoints = Math.floor(orderTotal / 100)
    return Math.floor(basePoints * multiplier)
  }

  async checkTierUpgrade(customerId: string) {
    const loyalty = await this.getOrCreateCustomerLoyalty(customerId)
    const tiers = await this.listLoyaltyTiers({}, { order: { min_points: "ASC" } })

    let newTier = tiers[0]
    for (const tier of tiers) {
      if (loyalty.lifetime_points >= tier.min_points) {
        newTier = tier
      }
    }

    if (newTier && newTier.id !== loyalty.tier_id) {
      await this.updateCustomerLoyaltys(loyalty.id, {
        tier_id: newTier.id,
      })
      this.logger_.info(
        `Customer ${customerId} upgraded to tier ${newTier.name}`
      )
      return { upgraded: true, new_tier: newTier.name }
    }

    return { upgraded: false }
  }

  async redeemPointsAsCoupon(customerId: string, points: number) {
    const loyalty = await this.getOrCreateCustomerLoyalty(customerId)
    if (loyalty.current_points < points) {
      throw new Error("Insufficient points")
    }
    // 100 points = 100 FCFA discount
    const discountValue = points
    await this.deductPoints(customerId, points, "Redeemed as coupon")
    return { discount_value: discountValue, currency: "xof" }
  }
}
