import type { Metadata } from "next";
import Link from "next/link";
import { getSiteStats } from "@/lib/siteStats";

export const metadata: Metadata = {
  title: "经营驾驶舱 | AgentClaw",
  description: "AgentClaw 私有经营数据看板",
  robots: { index: false, follow: false },
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Shanghai",
  }).format(new Date(value));
}

function StatusDot({
  status,
}: {
  status: "ready" | "partial" | "pending";
}) {
  const colors = {
    ready: "#D8FF00",
    partial: "#EFFF85",
    pending: "#7F8379",
  };
  return (
    <span
      className="inline-block size-2 rounded-sm"
      style={{
        background: colors[status],
        boxShadow: status === "ready" ? `0 0 12px ${colors[status]}` : undefined,
      }}
    />
  );
}

export default function DashboardPage() {
  const stats = getSiteStats();
  const maxChannel = Math.max(...stats.channels.map((item) => item.count), 1);
  const sources = [
    {
      name: "内容索引",
      detail: "中英文内容清单与频道分布",
      status: "ready" as const,
      value: "已连接",
    },
    {
      name: "站点地图",
      detail: "搜索引擎可发现页面清单",
      status: stats.sitemapReady ? ("ready" as const) : ("partial" as const),
      value: stats.sitemapReady ? "正常" : "构建时生成",
    },
    {
      name: "Vercel 构建",
      detail: "环境与版本标识",
      status: stats.environment === "local" ? ("partial" as const) : ("ready" as const),
      value: stats.environment === "local" ? "本地" : stats.environment,
    },
    {
      name: "Google Search Console",
      detail: "关键词、曝光、点击与收录变化",
      status: "partial" as const,
      value: "已验证 / 未取数",
    },
    {
      name: "Google Analytics 4",
      detail: "访客、来源、停留与转化",
      status: "pending" as const,
      value: "待接入",
    },
    {
      name: "Google AdSense",
      detail: "广告展示、点击与收益",
      status: "partial" as const,
      value: "广告已启用 / 收益待接入",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#080908] pb-20">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "linear-gradient(to bottom,black,transparent 65%)",
        }}
      />
      <div
        className="pointer-events-none absolute -right-40 -top-40 size-[520px] rounded-sm blur-3xl"
        style={{ background: "rgba(216,255,0,.08)" }}
      />

      <div className="relative z-10 mx-auto max-w-[1440px] px-5 pt-8 md:px-10">
        <div className="flex flex-col gap-6 border-b border-white/[.07] pb-7 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-sm bg-[#D8FF00] font-display text-sm font-bold text-white shadow-[0_0_28px_rgba(216,255,0,.25)]">
                AC
              </span>
              <div>
                <p className="font-mono text-[10px] tracking-[.2em] text-[#D8FF00]">
                  AGENTCLAW / PRIVATE OPERATIONS
                </p>
                <p className="mt-1 text-xs text-quaternary">经营驾驶舱 · 内容与站点状态</p>
              </div>
            </div>
            <h1 className="mt-8 font-display text-4xl font-semibold tracking-[-.04em] text-white md:text-6xl">
              先看清系统，再决定增长。
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-sm border border-white/[.08] bg-white/[.03] px-4 py-2 font-mono text-[10px] tracking-[.12em] text-tertiary">
              BUILD {stats.buildSha}
            </div>
            <Link href="/" className="btn-secondary px-5 py-2.5 text-xs">
              返回首页 ↗
            </Link>
          </div>
        </div>

        <section className="grid gap-3 py-7 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["内容资产", stats.articles, "篇中文文章", "#D8FF00"],
            ["站点页面", stats.pages, "双语静态页面", "#D8FF00"],
            ["内容引擎", 4, "个独立垂类", "#D8FF00"],
            ["英文覆盖", stats.englishArticles, "篇英文内容", "#D8FF00"],
          ].map(([label, value, unit, color]) => (
            <div
              key={String(label)}
              className="rounded-sm border border-white/[.07] bg-white/[.025] p-6"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-tertiary">{label}</span>
                <span className="font-mono text-[9px] tracking-[.15em] text-quaternary">
                  LIVE
                </span>
              </div>
              <div
                className="mt-8 font-display text-4xl font-semibold tracking-[-.04em] md:text-5xl"
                style={{ color: String(color) }}
              >
                {value}
              </div>
              <div className="mt-2 text-xs text-quaternary">{unit}</div>
            </div>
          ))}
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.08fr_.92fr]">
          <div className="rounded-sm border border-white/[.07] bg-[#0E0F0E]/90 p-6 md:p-8">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-[10px] tracking-[.2em] text-[#D8FF00]">
                  CONTENT MIX
                </p>
                <h2 className="mt-3 font-display text-2xl font-semibold text-white">
                  内容资产结构
                </h2>
              </div>
              <span className="rounded-sm border border-white/[.07] px-3 py-1.5 font-mono text-[9px] text-quaternary">
                共 {stats.articles} 篇
              </span>
            </div>

            <div className="mt-8 flex h-3 overflow-hidden rounded-sm bg-white/[.05]">
              {stats.channels.map((channel) => (
                <div
                  key={channel.key}
                  title={`${channel.title}: ${channel.count}`}
                  style={{
                    width: `${channel.share}%`,
                    background: channel.accent,
                    boxShadow: `0 0 16px ${channel.accent}44`,
                  }}
                />
              ))}
            </div>

            <div className="mt-9 space-y-6">
              {stats.channels.map((channel) => (
                <div
                  key={channel.key}
                  className="grid grid-cols-[90px_1fr_48px] items-center gap-4"
                >
                  <div>
                    <div
                      className="font-mono text-[10px] tracking-[.12em]"
                      style={{ color: channel.accent }}
                    >
                      {channel.shortTitle}
                    </div>
                    <div className="mt-1 text-[10px] text-quaternary">{channel.share}%</div>
                  </div>
                  <div className="h-2 overflow-hidden rounded-sm bg-white/[.05]">
                    <div
                      className="h-full rounded-sm"
                      style={{
                        width: `${(channel.count / maxChannel) * 100}%`,
                        background: channel.accent,
                      }}
                    />
                  </div>
                  <div className="text-right font-display text-xl font-semibold text-white">
                    {channel.count}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-sm border border-white/[.07] bg-[#0E0F0E]/90 p-6 md:p-8">
            <p className="font-mono text-[10px] tracking-[.2em] text-[#D8FF00]">
              RECENT INVENTORY
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold text-white">
              最近加入内容库
            </h2>
            <div className="mt-7 divide-y divide-white/[.06]">
              {stats.recent.slice(0, 6).map((item, index) => (
                <Link
                  key={`${item.channel}-${item.slug}`}
                  href={`/${item.channel}/${item.slug}`}
                  className="group grid grid-cols-[28px_1fr_auto] gap-3 py-4 no-underline"
                >
                  <span className="font-mono text-[10px] text-quaternary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <div className="line-clamp-1 text-sm font-medium text-white transition-colors group-hover:text-[#D8FF00]">
                      {item.title}
                    </div>
                    <div className="mt-1 font-mono text-[9px] tracking-[.12em] text-quaternary">
                      {item.channelTitle}
                    </div>
                  </div>
                  <span className="text-tertiary transition-transform group-hover:translate-x-1">
                    ↗
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-4 grid gap-4 xl:grid-cols-[1fr_.7fr]">
          <div className="rounded-sm border border-white/[.07] bg-[#0E0F0E]/90 p-6 md:p-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] tracking-[.2em] text-[#D8FF00]">
                  DATA SOURCES
                </p>
                <h2 className="mt-3 font-display text-2xl font-semibold text-white">
                  数据源接入状态
                </h2>
              </div>
              <span className="text-[10px] text-quaternary">
                不展示任何虚构流量或收益
              </span>
            </div>
            <div className="mt-7 grid gap-3 md:grid-cols-2">
              {sources.map((source) => (
                <div
                  key={source.name}
                  className="flex items-start gap-4 rounded-sm border border-white/[.06] bg-white/[.02] p-4"
                >
                  <div className="pt-1">
                    <StatusDot status={source.status} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-medium text-white">{source.name}</span>
                      <span className="shrink-0 font-mono text-[9px] text-tertiary">
                        {source.value}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-quaternary">{source.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="rounded-sm border p-6 md:p-8"
            style={{
              borderColor: "rgba(216,255,0,.2)",
              background:
                "radial-gradient(circle at 100% 0%,rgba(216,255,0,.14),transparent 34%),#0E0F0E",
            }}
          >
            <p className="font-mono text-[10px] tracking-[.2em] text-[#D8FF00]">
              NEXT ACTIONS
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold text-white">
              让看板从“资产盘点”升级为“增长决策”。
            </h2>
            <div className="mt-7 space-y-4">
              {[
                ["01", "接入 GA4", "补齐访客、来源、停留与转化数据"],
                ["02", "接入 Search Console", "补齐关键词、曝光、点击和收录变化"],
                ["03", "接入 AdSense", "补齐广告展示、点击率与实际收益"],
              ].map(([number, title, description]) => (
                <div key={number} className="flex gap-4 border-b border-white/[.06] pb-4">
                  <span className="font-mono text-[10px] text-[#D8FF00]">{number}</span>
                  <div>
                    <div className="text-sm font-medium text-white">{title}</div>
                    <div className="mt-1 text-xs leading-5 text-quaternary">
                      {description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-sm border border-white/[.06] bg-black/20 p-4">
              <div className="text-[10px] text-quaternary">内容索引更新时间</div>
              <div className="mt-2 font-mono text-xs text-[#D8FF00]">
                {formatDate(stats.updatedAt)}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
