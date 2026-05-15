import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n/i18n";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "AgentClaw | AI Tools · Style · OPS · Mood Video",
    template: "%s | AgentClaw",
  },
  description: "AI e-commerce tools, men's style guide, solo entrepreneur automation, emotional short video creation — one domain, four content sites",
  openGraph: {
    title: "AgentClaw — OPS Solo System",
    description: "AI E-commerce Tools · Men's Style Guide · Solo Entrepreneur OPS · Emotional Short Videos",
    url: "https://agentclaw.sale",
    siteName: "AgentClaw",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AgentClaw — OPS Solo System",
    description: "AI E-commerce Tools · Men's Style Guide · Solo Entrepreneur OPS · Emotional Short Videos",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = headers();
  const pathname = headersList.get("x-pathname") || headersList.get("next-url") || "";
  const isEn = pathname?.startsWith("/en");
  const isZh = pathname?.startsWith("/zh");

  return (
    <html lang={isZh ? "zh-CN" : "en"} className="bg-background text-foreground">
      <head>
        <meta name="baidu-site-verification" content="codeva-aWte2wzx3i" />
        <meta name="google-site-verification" content="zKyKNyy7rXB__M1CkiIOE_iODw11OxDrvASD7euxGkc" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5426111418472003" crossOrigin="anonymous"></script>
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <link rel="canonical" href={`https://agentclaw.sale${pathname}`} />
        <link rel="alternate" hrefLang="zh" href={`https://agentclaw.sale${isEn ? pathname.replace(/^\/en/, '') : isZh ? pathname : '/zh' + pathname}`} />
        <link rel="alternate" hrefLang="en" href={`https://agentclaw.sale${isEn ? pathname : '/en' + pathname}`} />
        <link rel="alternate" hrefLang="x-default" href="https://agentclaw.sale/en/" />
      </head>
      <body className="antialiased" style={{background: "hsl(var(--background))", color: "hsl(var(--foreground))"}}>
        <I18nProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
