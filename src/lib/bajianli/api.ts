'use client'

const API_BASE = 'https://122.51.220.35/api/bajianli'

export interface User {
  id: number
  email: string
  company_name: string
  tax_id: string | null
  balance: number
  is_superadmin: boolean
  created_at: string
}

export interface ApiKey {
  id: number
  name: string
  key_value: string
  is_active: boolean
  quota_limit: number
  quota_used: number
  model_permissions: string | null
  ip_whitelist: string | null
  created_at: string
}

export interface SubKey {
  id: number
  parent_key_id: number
  user_id: number
  key_value: string
  name: string | null
  quota_limit: number | null
  quota_used: number
  model_permissions: string | null
  is_active: boolean
  created_at: string
}

export interface LogEntry {
  id: number
  user_id: number
  api_key_id: number
  api_key_name: string
  model: string
  input_tokens: number
  output_tokens: number
  cost: number
  status: string
  created_at: string
  request_id: string
  upstream_request_id: string | null
  duration: number
  endpoint: string
}

export interface PricingEntry {
  id: number
  model: string
  category: string
  unit: string
  base_price: number
  markup_rate: number
  is_active: boolean
}

export interface WalletRecord {
  id: number
  user_id: number
  amount: number
  payment_gateway: string
  payment_id: string | null
  status: string
  created_at: string
  completed_at: string | null
}

export interface InvoiceEntry {
  id: number
  user_id: number
  invoice_id: string
  invoice_type: string
  amount: number
  company_name: string
  tax_id: string
  address: string
  bank_info: string
  status: string
  admin_note: string | null
  created_at: string
  updated_at: string | null
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('bajianli_token')
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Request failed' }))
    throw new Error(err.detail || err.message || `HTTP ${res.status}`)
  }
  return res.json()
}

// Auth
export async function register(email: string, password: string, company_name: string) {
  return request<{ access_token: string }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, company_name }),
  })
}

export async function login(email: string, password: string) {
  return request<{ access_token: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export async function getMe() {
  return request<User>('/auth/me')
}

export async function updateProfile(data: Partial<User>) {
  return request<User>('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

// API Keys
export async function getKeys() {
  return request<ApiKey[]>('/keys')
}

export async function createKey(data: { name: string; quota_limit: number; model_permissions: string[]; ip_whitelist: string[] }) {
  return request<ApiKey>('/keys', {
    method: 'POST',
    body: JSON.stringify({
      ...data,
      model_permissions: data.model_permissions.join(','),
      ip_whitelist: data.ip_whitelist.join(','),
    }),
  })
}

export async function deleteKey(id: number) {
  return request<void>(`/keys/${id}`, { method: 'DELETE' })
}

export async function toggleKey(id: number) {
  return request<ApiKey>(`/keys/${id}/toggle`, { method: 'PATCH' })
}

// Sub Keys
export async function getSubKeys() {
  return request<SubKey[]>('/sub-keys')
}

export async function createSubKey(data: { name?: string; quota_limit?: number; model_permissions?: string }) {
  return request<SubKey>('/sub-keys', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function deleteSubKey(id: number) {
  return request<void>(`/sub-keys/${id}`, { method: 'DELETE' })
}

export async function toggleSubKey(id: number) {
  return request<SubKey>(`/sub-keys/${id}/toggle`, { method: 'PATCH' })
}

// Wallet
export async function getBalance() {
  return request<{ balance: number }>('/wallet/balance')
}

export async function getWalletRecords() {
  return request<WalletRecord[]>('/wallet/records')
}

export async function createTopup(amount: number, payment_method: string) {
  return request<{ order_id: string; qrcode_url?: string }>('/wallet/topup', {
    method: 'POST',
    body: JSON.stringify({ amount, payment_method }),
  })
}

export async function mockPay(order_id: string) {
  return request<{ status: string }>('/wallet/mock-pay', {
    method: 'POST',
    body: JSON.stringify({ order_id }),
  })
}

// Logs
export async function getLogs(params?: { page?: number; model?: string; status?: string; start_date?: string; end_date?: string }) {
  const query = new URLSearchParams()
  if (params?.page) {
    query.set('skip', String((params.page - 1) * 50))
    query.set('limit', '50')
  }
  if (params?.model) query.set('model', params.model)
  if (params?.status) query.set('status', params.status)
  if (params?.start_date) query.set('start_date', params.start_date)
  if (params?.end_date) query.set('end_date', params.end_date)
  const qs = query.toString()
  return request<LogEntry[]>(
    `/logs${qs ? '?' + qs : ''}`
  )
}

// Pricing (Admin)
export async function getPricing() {
  return request<PricingEntry[]>('/admin/pricing')
}

export async function updatePricing(id: number, data: { base_price?: number; markup_rate?: number; is_active?: boolean }) {
  return request<PricingEntry>(`/admin/pricing/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function createPricing(data: { model: string; category: string; unit: string; base_price: number; markup_rate: number; is_active?: boolean }) {
  return request<PricingEntry>('/admin/pricing', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function deletePricing(id: number) {
  return request<{ message: string }>(`/admin/pricing/${id}`, { method: 'DELETE' })
}

export async function seedPricing() {
  return request<PricingEntry[]>('/admin/pricing/seed', { method: 'POST' })
}

// Models (public)
export async function getModels() {
  const token = getToken()
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${API_BASE}/models`, { headers })
  if (!res.ok) throw new Error('Failed to fetch models')
  return res.json()
}

// ── Chat Completion (Playground) ─────────────────────────────────────────────────

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface ChatCompletionOptions {
  temperature?: number
  max_tokens?: number
  stream?: boolean
}

export interface ChatCompletionChunk {
  id: string
  object: string
  created: number
  model: string
  choices: {
    index: number
    delta: { role?: string; content?: string }
    finish_reason: string | null
  }[]
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export interface ModelInfo {
  id: string
  object: string
  created: number
  owned_by: string
}

export interface ModelsResponse {
  object: string
  data: ModelInfo[]
}

/**
 * Send a chat completion request via the API Gateway.
 * Supports both streaming (returns ReadableStream) and non-streaming.
 */
export async function chatCompletion(
  model: string,
  messages: ChatMessage[],
  options: ChatCompletionOptions = {},
): Promise<Response> {
  const token = getToken()
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const body: Record<string, any> = {
    model,
    messages,
  }
  if (options.temperature !== undefined) body.temperature = options.temperature
  if (options.max_tokens !== undefined) body.max_tokens = options.max_tokens
  if (options.stream !== undefined) body.stream = options.stream

  const res = await fetch(`${API_BASE}/chat/completions`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Chat completion failed' }))
    throw new Error(err.detail || err.message || `HTTP ${res.status}`)
  }

  return res
}

/**
 * Calculate estimated cost from token usage using pricing data.
 * Falls back to rough estimation if pricing fetch fails.
 */
export interface ModelPricing {
  model: string
  input_price_per_m: number   // per 1M tokens
  output_price_per_m: number  // per 1M tokens
}

const FALLBACK_PRICING: Record<string, ModelPricing> = {
  'deepseek-chat': { model: 'deepseek-chat', input_price_per_m: 0.27, output_price_per_m: 1.10 },
  'deepseek-reasoner': { model: 'deepseek-reasoner', input_price_per_m: 0.55, output_price_per_m: 2.19 },
  'deepseek-coder': { model: 'deepseek-coder', input_price_per_m: 0.14, output_price_per_m: 0.28 },
  'gpt-4o': { model: 'gpt-4o', input_price_per_m: 2.50, output_price_per_m: 10.00 },
  'gpt-4o-mini': { model: 'gpt-4o-mini', input_price_per_m: 0.15, output_price_per_m: 0.60 },
  'claude-3.5-sonnet': { model: 'claude-3.5-sonnet', input_price_per_m: 3.00, output_price_per_m: 15.00 },
}

export function estimateCost(
  model: string,
  inputTokens: number,
  outputTokens: number,
): number {
  const pricing = FALLBACK_PRICING[model]
  if (!pricing) {
    // Default ~¥2/M input, ¥8/M output for unknown models
    return (inputTokens * 2 + outputTokens * 8) / 1_000_000
  }
  return (inputTokens * pricing.input_price_per_m + outputTokens * pricing.output_price_per_m) / 1_000_000
}

// ── Invoices ─────────────────────────────────────────────────────────────────
export async function getInvoices() {
  return request<InvoiceEntry[]>('/invoices')
}

export async function getInvoice(id: number) {
  return request<InvoiceEntry>(`/invoices/${id}`)
}

export async function getInvoiceAvailable() {
  return request<{ total_consumed: number; total_invoiced: number; available: number }>('/invoices/available')
}

export async function createInvoice(data: {
  invoice_type: string
  amount: number
  company_name: string
  tax_id: string
  address: string
  bank_info: string
}) {
  return request<InvoiceEntry>('/invoices', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function approveInvoice(id: number) {
  return request<InvoiceEntry>(`/invoices/${id}/approve`, {
    method: 'PATCH',
    body: JSON.stringify({}),
  })
}

export async function rejectInvoice(id: number, reason: string) {
  return request<InvoiceEntry>(`/invoices/${id}/reject`, {
    method: 'PATCH',
    body: JSON.stringify({ reason }),
  })
}

// ── Billing & CSV Export ──────────────────────────────────────────────────────

export interface BillingItem {
  model: string
  call_count: number
  total_input: number
  total_output: number
  total_cost: number
}

export interface BillingSummary {
  year: number
  month: number
  items: BillingItem[]
  summary: {
    total_calls: number
    total_input: number
    total_output: number
    total_cost: number
  }
}

/**
 * Get monthly billing summary grouped by model.
 */
export async function getBillingSummary(year: number, month: number) {
  return request<BillingSummary>(`/billing/summary?year=${year}&month=${month}`)
}

/**
 * Download logs CSV via server-side export (direct fetch for file download).
 */
export async function exportLogsCSV(params?: {
  start_date?: string
  end_date?: string
  model?: string
}) {
  const token = getToken()
  const query = new URLSearchParams()
  if (params?.start_date) query.set('start_date', params.start_date)
  if (params?.end_date) query.set('end_date', params.end_date)
  if (params?.model) query.set('model', params.model)
  const qs = query.toString()
  const url = `${API_BASE}/logs/export-csv${qs ? '?' + qs : ''}`
  const headers: Record<string, string> = {}
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(url, { headers })
  if (!res.ok) throw new Error(`导出失败 (HTTP ${res.status})`)
  const blob = await res.blob()
  const blobUrl = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = blobUrl
  a.download = `api-logs-${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(blobUrl)
}

/**
 * Download billing CSV via server-side export.
 */
export async function exportBillingCSV(year: number, month: number) {
  const token = getToken()
  const url = `${API_BASE}/billing/export-csv?year=${year}&month=${month}`
  const headers: Record<string, string> = {}
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(url, { headers })
  if (!res.ok) throw new Error(`导出失败 (HTTP ${res.status})`)
  const blob = await res.blob()
  const blobUrl = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = blobUrl
  a.download = `billing-${year}-${String(month).padStart(2, '0')}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(blobUrl)
}
