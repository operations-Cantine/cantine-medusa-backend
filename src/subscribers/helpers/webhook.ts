import axios from "axios"

const N8N_BASE = process.env.N8N_WEBHOOK_BASE_URL || "https://n8n.srv1162628.hstgr.cloud/webhook"

export async function sendWebhook(path: string, data: any) {
  try {
    await axios.post(`${N8N_BASE}/${path}`, data, {
      timeout: 5000,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error: any) {
    console.error(`[Webhook] Failed: ${path} — ${error.message}`)
  }
}
