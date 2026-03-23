import LoyaltyModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const LOYALTY_MODULE = "loyaltyModuleService"

export default Module(LOYALTY_MODULE, {
  service: LoyaltyModuleService,
})
