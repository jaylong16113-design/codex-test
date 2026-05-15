"use client";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/i18n";

export default function Footer() {
  const { t } = useI18n();
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  const isEn = pathname?.startsWith("/en");
  const p = (href: string) => (isEn ? `/en${href}` : href);

  return (
    <footer
      style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(14,22,38,0.50)",
      }}
    >
      <div
        className="mx-auto px-5 py-14 md:px-10"
        style={{ maxWidth: "1280px" }}
      >
        <div className="grid grid-cols-2 gap-10 md:grid-cols-3 lg:grid-cols-5">
          {/* Column 1: AgentClaw */}
          <div className="col-span-2 md:col-span-1 lg:col-span-1">
            <div className="mb-3 flex items-center gap-2">
              <span
                className="grid size-8 place-items-center rounded-full text-sm font-bold"
                style={{
                  background: "linear-gradient(135deg, #FF6A00, #FF8A2A)",
                  color: "#fff",
                }}
              >
                ✦
              </span>
              <span
                className="font-display font-bold"
                style={{ color: "#fff", fontSize: "1rem" }}
              >
                AgentClaw
              </span>
            </div>
            <p
              className="text-xs leading-6"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              AI 驱动的一人公司内容矩阵
            </p>
            <p
              className="mt-2 text-xs leading-6"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              © 2026 AgentClaw
            </p>
          </div>

          {/* Column 2: 导航 */}
          <div>
            <h4
              className="mb-4 text-xs font-semibold uppercase tracking-wider"
              style={{ color: "rgba(255,255,255,0.50)" }}
            >
              导航
            </h4>
            <ul className="space-y-2.5 text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>
              <li>
                <Link
                  href={p("/")}
                  className="transition-colors no-underline"
                  style={{ color: "inherit" }}
                >
                  首页
                </Link>
              </li>
              <li>
                <Link
                  href={p("/tool")}
                  className="transition-colors no-underline"
                  style={{ color: "inherit" }}
                >
                  AI Tools
                </Link>
              </li>
              <li>
                <Link
                  href={p("/wear")}
                  className="transition-colors no-underline"
                  style={{ color: "inherit" }}
                >
                  Style
                </Link>
              </li>
              <li>
                <Link
                  href={p("/ops")}
                  className="transition-colors no-underline"
                  style={{ color: "inherit" }}
                >
                  OPS
                </Link>
              </li>
              <li>
                <Link
                  href={p("/mood")}
                  className="transition-colors no-underline"
                  style={{ color: "inherit" }}
                >
                  Mood Video
                </Link>
              </li>
              <li>
                <Link
                  href={p("/about")}
                  className="transition-colors no-underline"
                  style={{ color: "inherit" }}
                >
                  关于我
                </Link>
              </li>
              <li>
                <Link
                  href={p("/resources")}
                  className="transition-colors no-underline"
                  style={{ color: "inherit" }}
                >
                  资源库
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: 热门 */}
          <div>
            <h4
              className="mb-4 text-xs font-semibold uppercase tracking-wider"
              style={{ color: "rgba(255,255,255,0.50)" }}
            >
              热门
            </h4>
            <ul className="space-y-2.5 text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>
              <li>
                <Link
                  href={p("/tool/10-free-ecommerce-tools")}
                  className="transition-colors no-underline"
                  style={{ color: "inherit" }}
                >
                  {t("free_tools")}
                </Link>
              </li>
              <li>
                <Link
                  href={p("/wear/first-suit-guide")}
                  className="transition-colors no-underline"
                  style={{ color: "inherit" }}
                >
                  {t("suit_style")}
                </Link>
              </li>
              <li>
                <Link
                  href={p("/ops/what-is-solo-company")}
                  className="transition-colors no-underline"
                  style={{ color: "inherit" }}
                >
                  Solo OPS
                </Link>
              </li>
              <li>
                <Link
                  href={p("/mood/emotion-short-video-basics")}
                  className="transition-colors no-underline"
                  style={{ color: "inherit" }}
                >
                  情绪短视频
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: 内部工具 */}
          <div>
            <h4
              className="mb-4 text-xs font-semibold uppercase tracking-wider"
              style={{ color: "rgba(255,255,255,0.50)" }}
            >
              内部工具
            </h4>
            <ul className="space-y-2.5 text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>
              <li>
                <a
                  href="/compass"
                  className="transition-colors no-underline"
                  style={{ color: "#FF6A00" }}
                >
                  COMPASS
                </a>
              </li>
              <li>
                <a
                  href="/lens"
                  className="transition-colors no-underline"
                  style={{ color: "#FF6A00" }}
                >
                  LENS
                </a>
              </li>
              <li>
                <a
                  href="/axiom"
                  className="transition-colors no-underline"
                  style={{ color: "#FF6A00" }}
                >
                  AXIOM
                </a>
              </li>
              <li>
                <a
                  href="/forge"
                  className="transition-colors no-underline"
                  style={{ color: "#FF6A00" }}
                >
                  FORGE
                </a>
              </li>
              <li>
                <a
                  href="/blaze"
                  className="transition-colors no-underline"
                  style={{ color: "#FF6A00" }}
                >
                  BLAZE
                </a>
              </li>
              <li>
                <a
                  href="/hunter"
                  className="transition-colors no-underline"
                  style={{ color: "#FF6A00" }}
                >
                  HUNTER
                </a>
              </li>
              <li>
                <a
                  href="/mist"
                  className="transition-colors no-underline"
                  style={{ color: "#FF6A00" }}
                >
                  MIST
                </a>
              </li>
              <li>
                <a
                  href="/worker"
                  className="transition-colors no-underline"
                  style={{ color: "#00C9A7" }}
                >
                  WORKER
                </a>
              </li>
              <li
                style={{
                  fontSize: "9px",
                  marginTop: "4px",
                  color: "rgba(255,255,255,0.30)",
                }}
              >
                需密码 · 仅供演示
              </li>
            </ul>
          </div>

          {/* Column 5: 关于 */}
          <div>
            <h4
              className="mb-4 text-xs font-semibold uppercase tracking-wider"
              style={{ color: "rgba(255,255,255,0.50)" }}
            >
              关于
            </h4>
            <ul className="space-y-2.5 text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>
              <li>
                <span style={{ cursor: "default" }}>AgentClaw OPS System</span>
              </li>
              <li>
                <span style={{ cursor: "default" }}>
                  一个域名 · 四个内容站
                </span>
              </li>
              <li>
                <span style={{ cursor: "default" }}>Ricky</span>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="transition-colors no-underline"
                  style={{ color: "inherit" }}
                >
                  隐私政策
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="transition-colors no-underline"
                  style={{ color: "inherit" }}
                >
                  服务条款
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="mt-12 pt-6 text-center text-xs"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.05)",
            color: "rgba(255,255,255,0.30)",
          }}
        >
          <p>© 2026 AgentClaw · AI 驱动的一人公司内容矩阵</p>
        </div>
      </div>
    </footer>
  );
}
