"use client";
import Link from "next/link";
import LangSwitcher from "./LangSwitcher";
import { useI18n } from "@/lib/i18n/i18n";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const { t } = useI18n();
  const pathname = usePathname();
  const isEn = pathname?.startsWith("/en");
  const isZh = pathname?.startsWith("/zh");
  const prefix = isEn ? "/en" : isZh ? "/zh" : "";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const isLandingPage = pathname === "/" || pathname === "/en" || pathname === "/zh";
  if (isLandingPage) return null;
  const navLinks = [
    { href: prefix || "/", label: t("nav_home") },
    { href: `${prefix}/tool`, label: "AI Tools" },
    { href: `${prefix}/wear`, label: "Style" },
    { href: `${prefix}/ops`, label: "Solo OPS" },
    { href: `${prefix}/mood`, label: "Mood Video" },
    { href: "/resources", label: isEn ? "Resources" : "资源库" },
  ];
  return (
    <header className="site-header">
      <nav className="site-shell flex h-[72px] items-center gap-5">
        <Link href={prefix || "/"} className="brand-wordmark shrink-0 text-lg no-underline">AgentClaw</Link>
        <div className="mx-auto hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return <Link key={link.href} href={link.href} className="nav-link px-3 py-2" aria-current={active ? "page" : undefined}>{link.label}</Link>;
          })}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => setSearchOpen(!searchOpen)} className="btn-secondary min-h-9 px-3 py-2 text-[10px]" aria-expanded={searchOpen}>SEARCH</button>
          <LangSwitcher />
          <a href="#subscribe" className="btn-primary hidden sm:inline-flex">订阅更新</a>
          <button className="btn-secondary min-h-9 px-3 py-2 text-[10px] lg:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-expanded={mobileOpen}>{mobileOpen ? "CLOSE" : "MENU"}</button>
        </div>
      </nav>
      {searchOpen && (
        <div className="absolute left-0 right-0 top-full border-t border-white/10 bg-[#080908]/95 px-5 py-5 backdrop-blur-xl">
          <div className="mx-auto flex max-w-3xl items-center gap-4">
            <span className="eyebrow">Search</span>
            <input type="search" placeholder="搜索文章、工具、穿搭…" className="min-w-0 flex-1 border-0 border-b border-white/20 bg-transparent px-0 py-3 text-base text-white outline-none focus:border-[#d8ff00]" autoFocus onKeyDown={(e) => e.key === "Escape" && setSearchOpen(false)} />
            <button onClick={() => setSearchOpen(false)} className="nav-link bg-transparent">ESC</button>
          </div>
        </div>
      )}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-[#080908] px-6 pt-28 lg:hidden">
          <div className="mx-auto flex max-w-xl flex-col border-t border-white/15">
            {navLinks.map((link, index) => (
              <Link key={link.href} href={link.href} className="flex items-center justify-between border-b border-white/15 py-5 text-xl text-white no-underline" onClick={() => setMobileOpen(false)}>
                <span>{link.label}</span><span className="eyebrow">{String(index + 1).padStart(2, "0")}</span>
              </Link>
            ))}
            <a href="#subscribe" className="btn-primary mt-8" onClick={() => setMobileOpen(false)}>订阅更新</a>
          </div>
        </div>
      )}
    </header>
  );
}
