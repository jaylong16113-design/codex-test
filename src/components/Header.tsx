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

  const navLinks = [
    { href: prefix || "/", label: t("nav_home") },
    { href: `${prefix}/tool`, label: "AI Tools" },
    { href: `${prefix}/wear`, label: "Style" },
    { href: `${prefix}/ops`, label: "OPS" },
    { href: `${prefix}/mood`, label: "Mood Video" },
    { href: `${prefix}/about`, label: "关于我" },
    { href: `${prefix}/resources`, label: "资源库" },
  ];

  return (
    <header className="site-header">
      <nav
        className="mx-auto flex h-16 items-center gap-2 px-5 md:px-10"
        style={{ maxWidth: "1280px", border: "none", paddingBottom: 0 }}
      >
        {/* Left: Brand + Tagline */}
        <Link
          href={prefix || "/"}
          className="flex items-center gap-3 no-underline"
        >
          {/* Claw Logo */}
          <span
            className="grid size-10 place-items-center rounded-full font-bold text-lg"
            style={{
              background: "linear-gradient(135deg, #FF6A00, #FF8A2A)",
              color: "#fff",
              fontSize: "1.1rem",
              boxShadow: "0 0 20px rgba(255,106,0,0.25)",
            }}
          >
            ✦
          </span>
          <div className="hidden sm:block">
            <span
              className="font-display text-base font-bold tracking-tight"
              style={{ color: "#fff" }}
            >
              AgentClaw
            </span>
            <span
              className="ml-2 text-xs opacity-60 hidden lg:inline"
              style={{ color: "rgba(255,255,255,0.60)" }}
            >
              AI 驱动的一人公司内容矩阵
            </span>
          </div>
        </Link>

        {/* Center: Desktop Nav */}
        <div
          className="mx-auto hidden items-center gap-1 md:flex"
          style={{ marginLeft: "2rem" }}
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link rounded-md px-3 py-1.5 text-sm no-underline transition-colors"
                style={{
                  color: isActive ? "#FF6A00" : "rgba(255,255,255,0.65)",
                  fontWeight: isActive ? 600 : 500,
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right: Search + Subscribe */}
        <div className="ml-auto flex items-center gap-2">
          {/* Search button */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="flex size-8 items-center justify-center rounded-full transition-colors"
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.60)",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,106,0,0.40)";
              e.currentTarget.style.color = "#FF6A00";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
              e.currentTarget.style.color = "rgba(255,255,255,0.60)";
            }}
            aria-label="搜索"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          <LangSwitcher />

          {/* Subscribe CTA */}
          <a
            href="#subscribe"
            className="btn-primary hidden sm:inline-flex px-4 py-2 text-xs"
            style={{
              background: "linear-gradient(135deg, #FF6A00, #FF8A2A)",
              borderRadius: "9999px",
              color: "#fff",
              fontWeight: 600,
              fontSize: "0.8rem",
              padding: "0.5rem 1rem",
              textDecoration: "none",
              whiteSpace: "nowrap",
              boxShadow: "0 0 20px rgba(255,106,0,0.20)",
            }}
          >
            订阅更新
          </a>

          {/* Hamburger — mobile */}
          <button
            className="flex size-8 items-center justify-center rounded-md border md:hidden"
            style={{
              borderColor: "rgba(255,255,255,0.12)",
              background: "transparent",
              cursor: "pointer",
              color: "rgba(255,255,255,0.60)",
            }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "关闭菜单" : "打开菜单"}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {mobileOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Search overlay */}
      {searchOpen && (
        <div
          className="absolute left-0 right-0 top-full border-t px-5 py-4 md:px-10"
          style={{
            background: "rgba(7,8,18,0.95)",
            borderColor: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="mx-auto flex max-w-2xl items-center gap-3">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(255,255,255,0.40)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="搜索文章、工具、穿搭..."
              className="flex-1 bg-transparent text-base outline-none"
              style={{ color: "#fff" }}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Escape") setSearchOpen(false);
              }}
            />
            <button
              onClick={() => setSearchOpen(false)}
              className="text-xs"
              style={{ color: "rgba(255,255,255,0.40)", cursor: "pointer", background: "none", border: "none" }}
            >
              ESC
            </button>
          </div>
        </div>
      )}

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{
            background: "rgba(7,8,18,0.97)",
            backdropFilter: "blur(12px)",
          }}
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="flex h-full flex-col items-center justify-center gap-6"
            onClick={(e) => e.stopPropagation()}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-lg font-medium no-underline transition-colors"
                style={{ color: "#fff" }}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="#subscribe"
              className="btn-primary mt-4"
              onClick={() => setMobileOpen(false)}
            >
              订阅更新
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
