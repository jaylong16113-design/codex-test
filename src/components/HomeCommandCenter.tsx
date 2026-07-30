import Link from "next/link";
import SubscribeSection from "@/components/SubscribeSection";
import heroWave from "@/lib/heroWave";
import type { ChannelKey, SiteStats } from "@/lib/siteStats";

type Locale = "zh" | "en";

type HomeCommandCenterProps = {
  locale: Locale;
  stats: SiteStats;
};

const channelCopy: Record<
  ChannelKey,
  { zh: string; en: string }
> = {
  tool: {
    zh: "精选工具与工作流",
    en: "Selected tools and workflows",
  },
  wear: {
    zh: "方法、模型与个人风格",
    en: "Methods, models and personal style",
  },
  ops: {
    zh: "一人公司的运营系统",
    en: "The operating system for solo business",
  },
  mood: {
    zh: "灵感、叙事与视觉内容",
    en: "Ideas, narrative and visual content",
  },
};

const tools = ["COMPASS", "LENS", "AXIOM", "FORGE", "BLAZE", "HUNTER", "MIST"];

export default function HomeCommandCenter({
  locale,
  stats,
}: HomeCommandCenterProps) {
  const isEn = locale === "en";
  const prefix = isEn ? "/en" : locale === "zh" ? "/zh" : "";
  const copy = isEn
    ? {
        title: "Turn one person’s judgment into a system that keeps moving.",
        intro:
          "AgentClaw connects tools, style, operations and content—turning experience into reusable growth assets.",
        browse: "Browse content",
        dashboard: "Enter dashboard",
        subscribe: "Subscribe",
        proof: `${stats.articles} ARTICLES / 4 VERTICALS / ${stats.languages} LANGUAGES`,
        system: "THE SYSTEM",
        systemTitle: "Four domains. One operating point of view.",
        systemIntro:
          "Each channel stands on its own, while every useful idea returns to the same compounding knowledge base.",
        method: "HOW IT MOVES",
        methodTitle: "Signal becomes judgment. Judgment becomes an asset.",
        methodSteps: [
          ["01", "Observe", "Find the questions, shifts and details worth understanding."],
          ["02", "Distill", "Turn scattered information into an opinion people can use."],
          ["03", "Publish", "Build a searchable archive that earns attention over time."],
          ["04", "Improve", "Use real response to sharpen the next round of work."],
        ],
        privateLabel: "PRIVATE OPERATIONS",
        privateTitle: "See the system behind the output.",
        privateCopy:
          "Review the archive, publishing coverage, site health and data connections from one protected workspace.",
        studio: "INTERNAL STUDIO",
        studioTitle: "Seven instruments. One compact operating stack.",
        letterTitle: "One useful signal, delivered weekly.",
        letterCopy:
          "Tools, operating ideas and experiments—selected before they reach your inbox.",
      }
    : {
        title: "让一个人的判断，成为持续运转的系统。",
        intro:
          "AgentClaw 连接工具、风格、运营与内容，把经验沉淀为可复用的增长资产。",
        browse: "浏览内容",
        dashboard: "进入后台",
        subscribe: "订阅更新",
        proof: `${stats.articles} ARTICLES / 4 VERTICALS / ${stats.languages} LANGUAGES`,
        system: "内容体系",
        systemTitle: "四个方向，一套持续运转的判断。",
        systemIntro:
          "每个栏目都能独立提供价值，也共同沉淀为可以搜索、复用和持续增长的知识资产。",
        method: "运转方式",
        methodTitle: "信号成为判断，判断成为资产。",
        methodSteps: [
          ["01", "观察", "找到真正值得理解的问题、变化与细节。"],
          ["02", "提炼", "把零散信息整理成别人可以使用的判断。"],
          ["03", "发布", "建立能够被搜索、分享与长期信任的档案。"],
          ["04", "修正", "用真实反馈，让下一轮内容变得更准确。"],
        ],
        privateLabel: "私人经营区",
        privateTitle: "看见内容背后的经营系统。",
        privateCopy:
          "在一个受保护的工作区里，查看内容档案、发布覆盖、网站健康度与数据接入状态。",
        studio: "内部工作室",
        studioTitle: "七件工具，组成一套紧凑的运营栈。",
        letterTitle: "每周一个真正有用的信号。",
        letterCopy: "工具、经营思考与增长实验，经过筛选之后再送达。",
      };

  const navItems = stats.channels.map((channel) => ({
    ...channel,
      href: `${prefix}/${channel.key}`,
      displayTitle:
        channel.key === "wear"
          ? "Style"
          : channel.key === "ops"
            ? "Solo OPS"
            : channel.title,
      description: isEn
        ? channelCopy[channel.key].en
        : channelCopy[channel.key].zh,
  }));

  return (
    <div className="min-h-screen overflow-hidden bg-[#080909] text-[#F2F3F1]">
      <section className="relative min-h-[900px] border-b border-white/20 lg:min-h-[100svh]">
        <div
          className="pointer-events-none absolute inset-0 bg-[length:auto_72%] bg-[position:68%_bottom] bg-no-repeat opacity-95 md:bg-[length:auto_90%] md:bg-right-bottom"
          style={{ backgroundImage: `url(${heroWave})` }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(8,9,9,1)_0%,rgba(8,9,9,.96)_27%,rgba(8,9,9,.45)_58%,rgba(8,9,9,.08)_100%)]" />

        <div className="relative z-10 grid min-h-[900px] lg:min-h-[100svh] lg:grid-cols-[188px_1fr]">
          <aside className="hidden border-r border-white/15 px-9 py-10 lg:flex lg:flex-col">
            <Link
              href={prefix || "/"}
              className="text-xl font-semibold tracking-[-.035em] text-white no-underline"
            >
              AgentClaw
            </Link>
            <nav className="mt-20 flex flex-col gap-7" aria-label="Content channels">
              {navItems.map((item, index) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`text-sm no-underline transition-colors hover:text-[#D8FF00] ${
                    index === 0 ? "text-[#D8FF00]" : "text-white/75"
                  }`}
                >
                  {item.displayTitle}
                </Link>
              ))}
            </nav>
            <p className="mt-auto whitespace-pre-line text-[10px] font-medium leading-5 tracking-[.08em] text-white/55">
              {copy.proof.replaceAll(" / ", "\n/ ")}
            </p>
            <div className="mt-5 h-px w-full bg-[#D8FF00]" />
          </aside>

          <div className="flex min-w-0 flex-col">
            <header className="flex h-24 items-center border-b border-white/10 px-5 md:px-10 lg:border-b-0 lg:px-12">
              <Link
                href={prefix || "/"}
                className="text-lg font-semibold tracking-[-.03em] text-white no-underline lg:hidden"
              >
                AgentClaw
              </Link>
              <div className="ml-auto flex items-center gap-5 text-xs font-medium md:gap-8">
                <Link
                  href={isEn ? "/zh" : "/en"}
                  className="text-white/75 no-underline transition-colors hover:text-white"
                >
                  {isEn ? "中文" : "EN"}
                </Link>
                <a
                  href="#subscribe"
                  className="bg-[#D8FF00] px-5 py-3 text-[#080909] no-underline transition-colors hover:bg-white"
                >
                  {copy.subscribe}
                </a>
              </div>
            </header>

            <div className="flex flex-1 flex-col px-5 pb-8 md:px-10 lg:px-12">
              <div className="flex flex-1 items-center">
                <div className="max-w-[720px] pb-20 pt-14 md:pb-24 lg:translate-y-6 lg:pt-0">
                  <h1 className="text-[2.9rem] font-semibold leading-[1.1] tracking-[-.055em] text-white sm:text-6xl lg:text-[4rem]">
                    {isEn ? (
                      copy.title
                    ) : (
                      <>
                        让一个人的判断，
                        <br />
                        成为持续运转的系统。
                      </>
                    )}
                  </h1>
                  <p className="mt-7 max-w-xl text-base leading-8 text-white/60 md:text-lg">
                    {copy.intro}
                  </p>
                  <div className="mt-10 flex flex-wrap items-center gap-7">
                    <a
                      href="#content-system"
                      className="bg-[#D8FF00] px-8 py-4 text-sm font-semibold text-[#080909] no-underline transition-colors hover:bg-white"
                    >
                      {copy.browse}
                    </a>
                    <Link
                      href="/dashboard"
                      className="border-b border-white/70 pb-1 text-sm font-medium text-white no-underline transition-colors hover:border-[#D8FF00] hover:text-[#D8FF00]"
                    >
                      {copy.dashboard}
                    </Link>
                  </div>
                </div>
              </div>

              <div className="grid border-t border-white/35 sm:grid-cols-2 lg:grid-cols-4">
                {navItems.map((item, index) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    className="group min-h-[122px] border-b border-white/15 py-5 text-white no-underline sm:px-5 sm:first:pl-0 lg:border-b-0 lg:border-r lg:border-white/20 lg:last:border-r-0"
                  >
                    <span className="text-[10px] font-semibold text-[#D8FF00]">
                      0{index + 1}
                    </span>
                    <div className="mt-3 flex items-end justify-between gap-5">
                      <div>
                        <h2 className="text-lg font-medium tracking-[-.025em]">
                          {item.displayTitle}
                        </h2>
                        <p className="mt-1 text-[11px] text-white/48">
                          {item.description}
                        </p>
                      </div>
                      <span className="text-xs text-white/45 transition-colors group-hover:text-[#D8FF00]">
                        {item.count}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="content-system" className="border-b border-white/15">
        <div className="mx-auto max-w-[1380px] px-5 py-24 md:px-10 md:py-32">
          <div className="grid gap-12 lg:grid-cols-[.55fr_1.45fr]">
            <p className="text-[10px] font-semibold uppercase tracking-[.22em] text-[#D8FF00]">
              {copy.system}
            </p>
            <div>
              <h2 className="max-w-4xl text-4xl font-semibold leading-[1.05] tracking-[-.05em] md:text-6xl">
                {copy.systemTitle}
              </h2>
              <p className="mt-7 max-w-2xl text-base leading-8 text-white/55">
                {copy.systemIntro}
              </p>
            </div>
          </div>
          <div className="mt-20 border-t border-white/25">
            {navItems.map((item, index) => (
              <Link
                key={item.key}
                href={item.href}
                className="group grid gap-4 border-b border-white/20 py-7 text-white no-underline transition-colors hover:text-[#D8FF00] md:grid-cols-[80px_1fr_1.2fr_80px] md:items-center"
              >
                <span className="text-[10px] font-semibold text-[#D8FF00]">
                  0{index + 1}
                </span>
                <h3 className="text-2xl font-medium tracking-[-.035em]">
                  {item.displayTitle}
                </h3>
                <p className="text-sm text-white/48">{item.description}</p>
                <span className="text-right text-sm text-white/55">{item.count}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/15">
        <div className="mx-auto max-w-[1380px] px-5 py-24 md:px-10 md:py-32">
          <p className="text-[10px] font-semibold uppercase tracking-[.22em] text-[#D8FF00]">
            {copy.method}
          </p>
          <h2 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-[-.05em] md:text-6xl">
            {copy.methodTitle}
          </h2>
          <div className="mt-16 grid border-t border-white/25 md:grid-cols-2 lg:grid-cols-4">
            {copy.methodSteps.map(([number, title, description]) => (
              <article
                key={number}
                className="min-h-[260px] border-b border-white/20 py-7 md:border-r md:px-7 md:first:pl-0 md:last:border-r-0"
              >
                <span className="text-[10px] font-semibold text-[#D8FF00]">
                  {number}
                </span>
                <h3 className="mt-14 text-2xl font-medium tracking-[-.035em]">
                  {title}
                </h3>
                <p className="mt-4 max-w-xs text-sm leading-7 text-white/48">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#D8FF00] text-[#080909]">
        <div className="mx-auto grid max-w-[1380px] gap-12 px-5 py-20 md:px-10 md:py-24 lg:grid-cols-[1.25fr_.75fr] lg:items-end">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[.22em]">
              {copy.privateLabel}
            </p>
            <h2 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.04] tracking-[-.05em] md:text-6xl">
              {copy.privateTitle}
            </h2>
          </div>
          <div className="border-t border-black/40 pt-6">
            <p className="text-sm leading-7 text-black/65">{copy.privateCopy}</p>
            <Link
              href="/dashboard"
              className="mt-8 inline-flex border border-black px-6 py-3 text-sm font-semibold text-black no-underline transition-colors hover:bg-black hover:text-[#D8FF00]"
            >
              {copy.dashboard}
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-white/15">
        <div className="mx-auto max-w-[1380px] px-5 py-20 md:px-10 md:py-24">
          <div className="grid gap-10 md:grid-cols-[1fr_1.2fr] md:items-end">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[.22em] text-[#D8FF00]">
                {copy.studio}
              </p>
              <h2 className="mt-5 max-w-xl text-4xl font-semibold leading-[1.05] tracking-[-.045em]">
                {copy.studioTitle}
              </h2>
            </div>
            <div className="flex flex-wrap gap-x-7 gap-y-4 md:justify-end">
              {tools.map((tool) => (
                <a
                  key={tool}
                  href={`/${tool.toLowerCase()}`}
                  className="border-b border-white/35 pb-1 text-[11px] font-semibold tracking-[.14em] text-white no-underline transition-colors hover:border-[#D8FF00] hover:text-[#D8FF00]"
                >
                  {tool}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="subscribe">
        <div className="mx-auto max-w-[1380px] px-5 py-24 md:px-10 md:py-32">
          <div className="mb-10 grid gap-6 border-b border-white/25 pb-8 md:grid-cols-[1.2fr_.8fr] md:items-end">
            <h2 className="max-w-3xl text-4xl font-semibold leading-[1.04] tracking-[-.05em] md:text-6xl">
              {copy.letterTitle}
            </h2>
            <p className="max-w-xl text-sm leading-7 text-white/50 md:justify-self-end">
              {copy.letterCopy}
            </p>
          </div>
          <SubscribeSection />
        </div>
      </section>
    </div>
  );
}
