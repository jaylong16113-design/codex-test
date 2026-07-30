import { existsSync, readFileSync, statSync } from "fs";
import { join } from "path";

export type ChannelKey = "tool" | "wear" | "ops" | "mood";

type ContentItem = {
  slug: string;
  title: string;
  excerpt?: string;
};

type ContentIndex = Record<ChannelKey, ContentItem[]>;

export type SiteStats = {
  articles: number;
  englishArticles: number;
  pages: number;
  languages: number;
  updatedAt: string;
  buildSha: string;
  environment: string;
  sitemapReady: boolean;
  channels: Array<{
    key: ChannelKey;
    title: string;
    shortTitle: string;
    count: number;
    share: number;
    accent: string;
  }>;
  recent: Array<{
    channel: ChannelKey;
    channelTitle: string;
    title: string;
    slug: string;
  }>;
};

const channelDefinitions: Array<{
  key: ChannelKey;
  title: string;
  shortTitle: string;
  accent: string;
}> = [
  { key: "tool", title: "AI Tools", shortTitle: "TOOLS", accent: "#D8FF00" },
  { key: "wear", title: "Style Guide", shortTitle: "STYLE", accent: "#D8FF00" },
  { key: "ops", title: "Solo OPS", shortTitle: "OPS", accent: "#D8FF00" },
  { key: "mood", title: "Mood Video", shortTitle: "MOOD", accent: "#D8FF00" },
];

const emptyIndex = (): ContentIndex => ({
  tool: [],
  wear: [],
  ops: [],
  mood: [],
});

function readContentIndex(locale: "zh" | "en"): ContentIndex {
  try {
    const path = join(process.cwd(), `src/lib/content/${locale}/index.json`);
    return JSON.parse(readFileSync(path, "utf8")) as ContentIndex;
  } catch {
    return emptyIndex();
  }
}

function getContentUpdatedAt(): string {
  try {
    const path = join(process.cwd(), "src/lib/content/zh/index.json");
    return statSync(path).mtime.toISOString();
  } catch {
    return new Date().toISOString();
  }
}

export function getSiteStats(): SiteStats {
  const zh = readContentIndex("zh");
  const en = readContentIndex("en");
  const articles = channelDefinitions.reduce(
    (sum, channel) => sum + (zh[channel.key]?.length || 0),
    0,
  );
  const englishArticles = channelDefinitions.reduce(
    (sum, channel) => sum + (en[channel.key]?.length || 0),
    0,
  );

  const channels = channelDefinitions.map((channel) => {
    const count = zh[channel.key]?.length || 0;
    return {
      ...channel,
      count,
      share: articles ? Math.round((count / articles) * 100) : 0,
    };
  });

  const recent = channelDefinitions
    .flatMap((channel) =>
      (zh[channel.key] || [])
        .slice(-2)
        .reverse()
        .map((item) => ({
          channel: channel.key,
          channelTitle: channel.title,
          title: item.title,
          slug: item.slug,
        })),
    )
    .slice(0, 8);

  return {
    articles,
    englishArticles,
    pages: articles + englishArticles + 12,
    languages: 2,
    updatedAt: getContentUpdatedAt(),
    buildSha: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || "local",
    environment: process.env.VERCEL_ENV || "local",
    sitemapReady: existsSync(join(process.cwd(), "public/sitemap.xml")),
    channels,
    recent,
  };
}
