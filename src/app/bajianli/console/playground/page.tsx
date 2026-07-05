'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import {
  getModels,
  chatCompletion,
  estimateCost,
  type ChatMessage,
  type ChatCompletionChunk,
  type ModelsResponse,
} from '@/lib/bajianli/api'
import {
  Send,
  Terminal,
  Settings2,
  Sliders,
  Maximize2,
  ToggleLeft,
  ToggleRight,
  Loader2,
  MessageSquare,
  Bot,
  User,
  AlertCircle,
  DollarSign,
} from 'lucide-react'

type Role = 'system' | 'user' | 'assistant'

interface ConversationMessage {
  role: Role
  content: string
  timestamp: number
}

interface UsageInfo {
  inputTokens: number
  outputTokens: number
  totalTokens: number
  cost: number
}

export default function PlaygroundPage() {
  // ── State ──────────────────────────────────────────────────────────────
  const [models, setModels] = useState<{ id: string }[]>([])
  const [selectedModel, setSelectedModel] = useState('deepseek-chat')
  const [systemPrompt, setSystemPrompt] = useState('You are a helpful assistant.')
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(4096)
  const [streamEnabled, setStreamEnabled] = useState(true)
  const [userInput, setUserInput] = useState('')
  const [conversation, setConversation] = useState<ConversationMessage[]>([])
  const [sending, setSending] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const [error, setError] = useState('')
  const [lastUsage, setLastUsage] = useState<UsageInfo | null>(null)
  const [cumulativeTokens, setCumulativeTokens] = useState(0)
  const [cumulativeCost, setCumulativeCost] = useState(0)
  const [modelsLoading, setModelsLoading] = useState(true)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // ── Fetch models on mount ─────────────────────────────────────────────
  useEffect(() => {
    getModels()
      .then((res: ModelsResponse) => {
        const list = (res.data || []).filter((m: any) =>
          !m.id.includes('embedding') && !m.id.includes('tts') && !m.id.includes('whisper')
        )
        setModels(list)
        if (list.length > 0 && !list.find((m: any) => m.id === selectedModel)) {
          setSelectedModel(list[0].id)
        }
      })
      .catch(() => {
        // Fallback model list if API fails
        setModels([
          { id: 'deepseek-chat' },
          { id: 'deepseek-reasoner' },
          { id: 'deepseek-coder' },
          { id: 'gpt-4o' },
          { id: 'gpt-4o-mini' },
          { id: 'claude-3.5-sonnet' },
        ])
      })
      .finally(() => setModelsLoading(false))
  }, [])

  // ── Auto-scroll ───────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation, streamingContent])

  // ── Build messages array ──────────────────────────────────────────────
  const buildMessages = useCallback((): ChatMessage[] => {
    const msgs: ChatMessage[] = []
    if (systemPrompt.trim()) {
      msgs.push({ role: 'system', content: systemPrompt.trim() })
    }
    for (const msg of conversation) {
      msgs.push({ role: msg.role, content: msg.content })
    }
    return msgs
  }, [systemPrompt, conversation])

  // ── Handle streaming response ─────────────────────────────────────────
  const handleStream = useCallback(async (res: Response, inputTokens: number) => {
    const reader = res.body?.getReader()
    if (!reader) throw new Error('No response body for streaming')

    const decoder = new TextDecoder()
    let buffer = ''
    let fullContent = ''
    let outputTokens = 0

    setStreamingContent('')
    setSending(true)

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed || !trimmed.startsWith('data: ')) continue
          const data = trimmed.slice(6)
          if (data === '[DONE]') continue

          try {
            const chunk: ChatCompletionChunk = JSON.parse(data)
            const delta = chunk.choices?.[0]?.delta?.content || ''
            fullContent += delta
            outputTokens += delta.split(/\s+/).filter(Boolean).length
            setStreamingContent(fullContent)
          } catch {
            // Skip malformed chunks
          }
        }
      }
    } finally {
      reader.releaseLock()
    }

    // Done streaming — add assistant message to conversation
    if (fullContent) {
      const usage: UsageInfo = {
        inputTokens,
        outputTokens,
        totalTokens: inputTokens + outputTokens,
        cost: estimateCost(selectedModel, inputTokens, outputTokens),
      }
      setLastUsage(usage)
      setCumulativeTokens(prev => prev + usage.totalTokens)
      setCumulativeCost(prev => prev + usage.cost)
      setConversation(prev => [...prev, { role: 'assistant', content: fullContent, timestamp: Date.now() }])
    }

    setStreamingContent('')
    setSending(false)
  }, [selectedModel])

  // ── Send message ──────────────────────────────────────────────────────
  const handleSend = useCallback(async () => {
    const input = userInput.trim()
    if (!input || sending) return

    setError('')
    setUserInput('')

    // Add user message to conversation
    const userMsg: ConversationMessage = { role: 'user', content: input, timestamp: Date.now() }
    const updatedConversation = [...conversation, userMsg]
    setConversation(updatedConversation)

    // Build messages for API
    const msgs: ChatMessage[] = []
    if (systemPrompt.trim()) {
      msgs.push({ role: 'system', content: systemPrompt.trim() })
    }
    for (const msg of updatedConversation) {
      msgs.push({ role: msg.role, content: msg.content })
    }

    // Estimate input tokens (rough: ~4 chars per token)
    const inputTokens = Math.ceil(JSON.stringify(msgs).length / 4)

    setSending(true)

    try {
      const res = await chatCompletion(selectedModel, msgs, {
        temperature,
        max_tokens: maxTokens,
        stream: streamEnabled,
      })

      if (streamEnabled) {
        await handleStream(res, inputTokens)
      } else {
        const data = await res.json()
        const content = data.choices?.[0]?.message?.content || ''
        const usage = data.usage || {}
        const pTokens = usage.prompt_tokens || inputTokens
        const cTokens = usage.completion_tokens || Math.ceil(content.length / 4)

        const usageInfo: UsageInfo = {
          inputTokens: pTokens,
          outputTokens: cTokens,
          totalTokens: pTokens + cTokens,
          cost: estimateCost(selectedModel, pTokens, cTokens),
        }

        setLastUsage(usageInfo)
        setCumulativeTokens(prev => prev + usageInfo.totalTokens)
        setCumulativeCost(prev => prev + usageInfo.cost)
        setConversation(prev => [...prev, { role: 'assistant', content, timestamp: Date.now() }])
        setSending(false)
      }
    } catch (err: any) {
      setError(err.message || '请求失败')
      setSending(false)
    }
  }, [userInput, conversation, systemPrompt, selectedModel, temperature, maxTokens, streamEnabled, sending, handleStream])

  // ── Keyboard shortcut ─────────────────────────────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // ── Clear conversation ────────────────────────────────────────────────
  const handleClear = () => {
    setConversation([])
    setStreamingContent('')
    setLastUsage(null)
    setError('')
  }

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div className="flex h-[calc(100vh-56px-48px)] gap-0 -mx-4 sm:-mx-6 lg:-mx-8" style={{ background: '#0a0a0b' }}>
      {/* ── Left Panel: Parameters ─────────────────────────────────────── */}
      <div
        className="w-[300px] lg:w-[320px] flex-shrink-0 border-r overflow-y-auto hidden md:block"
        style={{ borderColor: '#1f1f23', background: '#0f0f11' }}
      >
        <div className="p-4 space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b" style={{ borderColor: '#1f1f23' }}>
            <Settings2 className="w-4 h-4" style={{ color: '#825df4' }} />
            <span className="text-xs font-semibold tracking-wide uppercase" style={{ color: '#a1a1aa' }}>参数配置</span>
          </div>

          {/* Model Select */}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#a1a1aa' }}>模型</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={sending || modelsLoading}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all appearance-none cursor-pointer"
              style={{
                background: '#0a0a0b',
                border: '1px solid #1f1f23',
                color: '#fafafa',
              }}
            >
              {modelsLoading ? (
                <option>加载中...</option>
              ) : (
                models.map((m) => (
                  <option key={m.id} value={m.id}>{m.id}</option>
                ))
              )}
            </select>
          </div>

          {/* System Prompt */}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#a1a1aa' }}>System Prompt</label>
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              rows={4}
              placeholder="设置系统提示词..."
              className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all resize-none"
              style={{
                background: '#0a0a0b',
                border: '1px solid #1f1f23',
                color: '#fafafa',
              }}
              onFocus={(e) => e.target.style.borderColor = '#825df4'}
              onBlur={(e) => e.target.style.borderColor = '#1f1f23'}
            />
          </div>

          {/* Temperature */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium" style={{ color: '#a1a1aa' }}>
                Temperature
              </label>
              <span className="text-xs font-mono" style={{ color: '#825df4' }}>{temperature.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Sliders className="w-3 h-3 flex-shrink-0" style={{ color: '#a1a1aa' }} />
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                style={{
                  background: '#1f1f23',
                  accentColor: '#825df4',
                }}
              />
            </div>
            <div className="flex justify-between text-[10px] mt-0.5" style={{ color: '#52525b' }}>
              <span>精确</span>
              <span>创意</span>
            </div>
          </div>

          {/* Max Tokens */}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#a1a1aa' }}>Max Tokens</label>
            <input
              type="number"
              value={maxTokens}
              onChange={(e) => setMaxTokens(Math.max(1, parseInt(e.target.value) || 1))}
              min={1}
              max={128000}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all"
              style={{
                background: '#0a0a0b',
                border: '1px solid #1f1f23',
                color: '#fafafa',
              }}
              onFocus={(e) => e.target.style.borderColor = '#825df4'}
              onBlur={(e) => e.target.style.borderColor = '#1f1f23'}
            />
          </div>

          {/* Stream Toggle */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium" style={{ color: '#a1a1aa' }}>
                Stream <span className="font-normal" style={{ color: '#52525b' }}>(流式)</span>
              </label>
              <button
                onClick={() => setStreamEnabled(!streamEnabled)}
                className="transition-colors"
                style={{ color: streamEnabled ? '#825df4' : '#52525b' }}
              >
                {streamEnabled ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-[10px] mt-0.5" style={{ color: '#52525b' }}>
              {streamEnabled ? '逐字流式输出响应' : '等待完整响应后一次性显示'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleSend}
              disabled={sending || !userInput.trim()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #825df4, #a78bfa)',
                boxShadow: sending ? 'none' : '0 0 15px rgba(130,93,244,0.2)',
              }}
            >
              {sending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  发送中...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  发送
                </>
              )}
            </button>

            <button
              onClick={handleClear}
              disabled={conversation.length === 0 && !streamingContent}
              className="w-full px-4 py-2 rounded-lg text-xs font-medium transition-all disabled:opacity-30"
              style={{
                background: '#0a0a0b',
                border: '1px solid #1f1f23',
                color: '#a1a1aa',
              }}
            >
              清空对话
            </button>
          </div>
        </div>
      </div>

      {/* ── Right Panel: Chat ──────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0" style={{ background: '#0a0a0b' }}>
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between px-4 py-2.5 border-b" style={{ borderColor: '#1f1f23', background: '#0f0f11' }}>
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4" style={{ color: '#825df4' }} />
            <span className="text-sm font-semibold" style={{ color: '#fafafa' }}>Playground</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(130,93,244,0.1)', color: '#825df4' }}>
              {selectedModel}
            </span>
          </div>
          <button
            onClick={handleClear}
            disabled={conversation.length === 0}
            className="text-[10px] px-2 py-1 rounded disabled:opacity-30 transition-opacity"
            style={{ color: '#a1a1aa', background: '#0a0a0b', border: '1px solid #1f1f23' }}
          >
            清空
          </button>
        </div>

        {/* Chat messages area */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
          style={{ scrollBehavior: 'smooth' }}
        >
          {conversation.length === 0 && !streamingContent ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-sm">
                <Terminal className="w-10 h-10 mx-auto mb-3" style={{ color: '#825df4' }} />
                <h2 className="text-base font-semibold mb-1" style={{ color: '#fafafa' }}>API Playground</h2>
                <p className="text-xs leading-relaxed" style={{ color: '#52525b' }}>
                  选择模型、配置参数，然后发送消息测试 API 调用。
                  <br />
                  支持流式与非流式响应，实时显示 Token 用量和费用。
                </p>
              </div>
            </div>
          ) : (
            <>
              {conversation.map((msg, i) => (
                <MessageBubble key={`${msg.timestamp}-${i}`} message={msg} />
              ))}
              {streamingContent && (
                <div className="flex gap-2.5 items-start group">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: 'rgba(130,93,244,0.15)' }}
                  >
                    <Bot className="w-3.5 h-3.5" style={{ color: '#825df4' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className="rounded-lg px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap"
                      style={{
                        background: '#141416',
                        border: '1px solid #1f1f23',
                        color: '#fafafa',
                      }}
                    >
                      {streamingContent}
                      <span className="inline-block w-1.5 h-4 ml-0.5 animate-pulse" style={{ background: '#825df4' }} />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Error */}
          {error && (
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium"
              style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.2)',
                color: '#ef4444',
              }}
            >
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="border-t px-4 py-3" style={{ borderColor: '#1f1f23', background: '#0f0f11' }}>
          <div className="flex gap-2 items-end">
            <div className="flex-1 relative">
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="输入消息... (Enter 发送, Shift+Enter 换行)"
                rows={2}
                disabled={sending}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all resize-none disabled:opacity-50"
                style={{
                  background: '#0a0a0b',
                  border: '1px solid #1f1f23',
                  color: '#fafafa',
                }}
                onFocus={(e) => e.target.style.borderColor = '#825df4'}
                onBlur={(e) => e.target.style.borderColor = '#1f1f23'}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={sending || !userInput.trim()}
              className="flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0 hover:shadow-lg"
              style={{
                background: userInput.trim() && !sending
                  ? 'linear-gradient(135deg, #825df4, #a78bfa)'
                  : '#1f1f23',
                boxShadow: userInput.trim() && !sending ? '0 0 12px rgba(130,93,244,0.2)' : 'none',
              }}
            >
              {sending ? (
                <Loader2 className="w-4 h-4 animate-spin" style={{ color: '#fafafa' }} />
              ) : (
                <Send className="w-4 h-4" style={{ color: '#fafafa' }} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Floating cost badge ────────────────────────────────────────── */}
      {(lastUsage || cumulativeTokens > 0) && (
        <div
          className="fixed bottom-4 right-4 z-50 rounded-lg px-3 py-2 text-xs shadow-lg backdrop-blur-sm flex items-center gap-3"
          style={{
            background: 'rgba(15,15,17,0.95)',
            border: '1px solid #1f1f23',
            color: '#a1a1aa',
          }}
        >
          <div className="flex items-center gap-1.5">
            <DollarSign className="w-3 h-3" style={{ color: '#22c55e' }} />
            <span>
              本次: <span className="font-semibold font-mono" style={{ color: '#22c55e' }}>¥{lastUsage ? lastUsage.cost.toFixed(6) : '0.000000'}</span>
            </span>
          </div>
          <div className="w-px h-4" style={{ background: '#1f1f23' }} />
          <div className="flex items-center gap-1.5">
            <MessageSquare className="w-3 h-3" style={{ color: '#825df4' }} />
            <span>
              累计: <span className="font-semibold font-mono" style={{ color: '#fafafa' }}>{cumulativeTokens.toLocaleString()}</span> Tokens
              <span className="ml-1 font-mono" style={{ color: '#22c55e' }}>¥{cumulativeCost.toFixed(4)}</span>
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Message Bubble Component ────────────────────────────────────────────────
function MessageBubble({ message }: { message: ConversationMessage }) {
  const isUser = message.role === 'user'
  const isSystem = message.role === 'system'

  return (
    <div className={`flex gap-2.5 items-start group ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
          isUser ? '' : ''
        }`}
        style={{
          background: isUser
            ? 'rgba(130,93,244,0.15)'
            : isSystem
            ? 'rgba(245,158,11,0.15)'
            : 'rgba(130,93,244,0.15)',
        }}
      >
        {isUser ? (
          <User className="w-3.5 h-3.5" style={{ color: '#825df4' }} />
        ) : isSystem ? (
          <Settings2 className="w-3.5 h-3.5" style={{ color: '#f59e0b' }} />
        ) : (
          <Bot className="w-3.5 h-3.5" style={{ color: '#825df4' }} />
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 min-w-0 ${isUser ? 'max-w-[80%]' : 'max-w-[85%]'}`}>
        <div
          className="rounded-lg px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap"
          style={{
            background: isUser ? 'rgba(130,93,244,0.08)' : '#141416',
            border: `1px solid ${isUser ? 'rgba(130,93,244,0.15)' : '#1f1f23'}`,
            color: '#fafafa',
          }}
        >
          {message.content}
        </div>
      </div>
    </div>
  )
}
