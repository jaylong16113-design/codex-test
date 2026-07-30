"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const isEn = pathname?.startsWith("/en");
  const p = (href: string) => isEn ? `/en${href}` : href;
  const links = [[p("/tool"), "AI Tools"], [p("/wear"), "Style"], [p("/ops"), "Solo OPS"], [p("/mood"), "Mood Video"], ["/resources", isEn ? "Resources" : "资源库"], ["/about", isEn ? "About" : "关于"]];
  return (
    <footer className="border-t border-white/15 bg-[#080908]">
      <div className="site-shell py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1fr_2fr]">
          <div>
            <Link href={isEn ? "/en" : "/"} className="brand-wordmark text-xl no-underline">AgentClaw</Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-white/45">{isEn ? "A reusable operating system for a one-person company." : "让一个人的判断，成为持续运转的系统。"}</p>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-0 border-t border-white/15 md:grid-cols-3">
            {links.map(([href, label], index) => (
              <Link key={href} href={href} className="flex items-center justify-between border-b border-white/15 py-4 text-sm text-white/65 no-underline transition-colors hover:text-[#d8ff00]">
                <span>{label}</span><span className="eyebrow">{String(index + 1).padStart(2, "0")}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-4 border-t border-white/15 pt-5 text-[11px] text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 AgentClaw</span>
          <div className="flex gap-5">
            <Link href="/privacy" className="text-inherit no-underline hover:text-white">隐私政策</Link>
            <Link href="/terms" className="text-inherit no-underline hover:text-white">服务条款</Link>
            <Link href="/dashboard" className="text-inherit no-underline hover:text-[#d8ff00]">Private OPS</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
