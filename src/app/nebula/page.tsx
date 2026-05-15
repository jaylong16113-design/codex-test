'use client'

import ToolLayout from '@/components/ToolLayout'

export default function NebulaPage() {
  return (
    <ToolLayout title="NEBULA" icon="🌌" subtitle="品牌线上深度调研系统 — 跨平台数据采集 + AI深度分析 + 自动化报告" accentColor="#8B5CF6">
    <div className="mx-auto max-w-3xl">
      <div className="grid gap-4 mb-8">
        <div className="p-4 rounded-lg border bg-card">
          <h2 className="font-semibold text-sm mb-2">🔍 数据采集</h2>
          <p className="text-xs text-muted-foreground">抖音搜索视频（searchId翻页）· 小红书搜索笔记（多关键词交叉去重）· 各平台Top爆款评论抓取</p>
        </div>
        <div className="p-4 rounded-lg border bg-card">
          <h2 className="font-semibold text-sm mb-2">📊 深度分析</h2>
          <p className="text-xs text-muted-foreground">39个分析大类覆盖：品牌概况 · 竞品分析 · 电商全链路 · 商品企划 · 用户心智 · AI短视频策略 · 长期价值</p>
        </div>
        <div className="p-4 rounded-lg border bg-card">
          <h2 className="font-semibold text-sm mb-2">📄 自动化报告</h2>
          <p className="text-xs text-muted-foreground">飞书云文档自动生成，带完整排版 + 所有权转让。从采集到报告30分钟内完成</p>
        </div>
      </div>

      <div className="p-4 rounded-lg border bg-card">
        <h2 className="font-semibold text-sm mb-2">⚙️ 输入参数</h2>
        <div className="text-xs space-y-1 text-muted-foreground">
          <p>品牌名称（中文+英文）</p>
          <p>调研深度（标准/深度，标准约39大类，深度可扩展）</p>
          <p>数据源（抖音/小红书/两者）</p>
          <p>输出格式（飞书云文档/本地markdown）</p>
        </div>
      </div>

      <div className="mt-8 p-4 rounded-lg border bg-muted/50">
        <p className="text-xs text-muted-foreground">
          NEBULA 由 Hermes Agent 驱动，自动完成从数据采集到飞书报告的全流程。
          如需使用，直接与Hermes对话说明需要调研的品牌即可。
        </p>
      </div>
    </div>
    </ToolLayout>
  )
}
