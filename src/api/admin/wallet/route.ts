import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const service = req.scope.resolve("walletModuleService") as any
  const wallets = await service.listWallets({})
  res.json({ wallets, count: wallets.length })
}
