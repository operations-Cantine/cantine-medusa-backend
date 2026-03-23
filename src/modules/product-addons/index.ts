import AddonModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const ADDON_MODULE = "addonModuleService"

export default Module(ADDON_MODULE, {
  service: AddonModuleService,
})
