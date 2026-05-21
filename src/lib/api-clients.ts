// ── Shared API Clients for AgentClaw Tools ──
// Deepseek (LLM), JustOneAPI/NEBULA (scraping), APIMART (video/image)

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || 'sk-ad3e9f06e98b43dba5052ce9568a9ce4'
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com'

const JUSTONE_API_TOKEN = process.env.JUSTONE_API_TOKEN || 'tmxfUTTFofBtORbF'
const JUSTONE_BASE_URL = process.env.JUSTONE_BASE_URL || 'https://api.justoneapi.com'

const APIMART_API_KEY = process.env.APIMART_API_KEY || 'sk-YUigljr9O06hsDHogF5F5npPHiixAS05A7xHdsWBSxemu3tB'
const APIMART_BASE_URL = process.env.APIMART_BASE_URL || 'https://api.apimart.ai'

// ── Deepseek Chat Completion (OpenAI-compatible) ──
const DEEPSEEK_TIMEOUT_MS = 8_000 // 8s timeout for Vercel free tier (max 10s)

export async function deepseekChat(messages: { role: string; content: string }[], options?: {
  model?: string; temperature?: number; max_tokens?: number; signal?: AbortSignal
}): Promise<string> {
  // Create timeout controller
  const timeoutController = new AbortController()
  const timeoutId = setTimeout(() => timeoutController.abort(new Error('Deepseek API timeout')), DEEPSEEK_TIMEOUT_MS)
  
  // Use caller's signal if provided, otherwise use our timeout controller
  const signal = options?.signal || timeoutController.signal

  try {
    const resp = await fetch(`${DEEPSEEK_BASE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${DEEPSEEK_API_KEY}`, 'Content-Type': 'application/json' },
      signal,
      body: JSON.stringify({
        model: options?.model || 'deepseek-chat',
        messages,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.max_tokens ?? 2048,
      })
    })
    const data = await resp.json()
    if (!resp.ok) throw new Error(`Deepseek API error: ${data.error?.message || resp.status}`)
    return data.choices?.[0]?.message?.content || ''
  } finally {
    clearTimeout(timeoutId)
  }
}

// ── Deepseek with structured JSON output ──
export async function deepseekJSON<T>(system: string, prompt: string, options?: {
  model?: string; temperature?: number
}): Promise<T> {
  const content = await deepseekChat([
    { role: 'system', content: system + ' 请只返回纯JSON，不要markdown代码块。' },
    { role: 'user', content: prompt }
  ], { ...options, temperature: options?.temperature ?? 0.3 })
  return JSON.parse(content) as T
}

// ── JustOneAPI (NEBULA) — Scraping & Data ──
// Base URL: https://api.justoneapi.com or https://api.justone.ai
// Auth: ?token= query param OR X-API-Key header
export async function justoneAPI(endpoint: string, params?: Record<string, string>): Promise<any> {
  const searchParams = new URLSearchParams({ token: JUSTONE_API_TOKEN, ...(params || {}) })
  const url = `${JUSTONE_BASE_URL}${endpoint}?${searchParams}`
  const resp = await fetch(url, {
    headers: { 'X-API-Key': JUSTONE_API_TOKEN }
  })
  const data = await resp.json()
  if (!resp.ok) throw new Error(`JustOneAPI error: ${data.message || resp.status}`)
  return data
}

// ── APIMART Video Generation (VEO 3.1) ──
// POST /v1/video/generations
export async function apimartVideoGeneration(params: {
  prompt: string
  duration: number
  resolution?: string
  style?: string
  negative_prompt?: string
  seed?: number
  n?: number
}): Promise<{ id: string; videos: { url: string; duration: number; resolution: string }[] }> {
  const resp = await fetch(`${APIMART_BASE_URL}/v1/video/generations`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${APIMART_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'veo-3.1',
      prompt: params.prompt,
      negative_prompt: params.negative_prompt || '',
      duration: params.duration,
      resolution: params.resolution || '1080x1920',
      style: params.style || 'cinematic',
      seed: params.seed,
      n: params.n || 1,
    })
  })
  const data = await resp.json()
  if (!resp.ok) throw new Error(`APIMART video error: ${data.error?.message || resp.status}`)
  return data
}

// ── APIMART Image Generation ──
// POST /v1/images/generations
export async function apimartImageGeneration(params: {
  model?: string
  prompt: string
  size?: string
  n?: number
}): Promise<{ data: { url: string }[] }> {
  const resp = await fetch(`${APIMART_BASE_URL}/v1/images/generations`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${APIMART_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: params.model || 'stable-diffusion-xl',
      prompt: params.prompt,
      size: params.size || '1024x1024',
      n: params.n || 1,
    })
  })
  const data = await resp.json()
  if (!resp.ok) throw new Error(`APIMART image error: ${data.error?.message || resp.status}`)
  return data
}

// ── APIMART Chat (can use any model: gpt-4o, deepseek-chat, claude-3-opus, gemini-2.0-pro) ──
export async function apimartChat(messages: { role: string; content: string }[], options?: {
  model?: string; temperature?: number; max_tokens?: number
}): Promise<string> {
  const resp = await fetch(`${APIMART_BASE_URL}/v1/chat/completions`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${APIMART_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: options?.model || 'gpt-4o',
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.max_tokens ?? 2048,
    })
  })
  const data = await resp.json()
  if (!resp.ok) throw new Error(`APIMART chat error: ${data.error?.message || resp.status}`)
  return data.choices?.[0]?.message?.content || ''
}
