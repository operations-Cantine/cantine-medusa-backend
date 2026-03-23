import CreditModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const CREDIT_MODULE = "creditModuleService"

export default Module(CREDIT_MODULE, {
  service: CreditModuleService,
})
