import DeliveryZoneModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const DELIVERY_ZONE_MODULE = "deliveryZoneModuleService"

export default Module(DELIVERY_ZONE_MODULE, {
  service: DeliveryZoneModuleService,
})
