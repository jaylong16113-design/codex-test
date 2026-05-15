"use client";

import React from "react";
import Aurora from "./Aurora";
import ShinyText from "./ShinyText";

interface ToolLayoutProps {
  title: string;
  icon: string;
  subtitle?: string;
  accentColor?: string;
  children: React.ReactNode;
}

export default function ToolLayout({
  title,
  icon,
  subtitle,
  accentColor = "#FF6A00",
  children,
}: ToolLayoutProps) {
  return (
    <>
      {/* Aurora background */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-20">
        <Aurora
          colorStops={["#FF6A00", "#00E5FF", "#8B5CF6"]}
          amplitude={0.4}
          blend={0.3}
          speed={0.4}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-16">
        {/* Header */}
        <div className="mb-10">
          {/* Status badge + icon row */}
          <div className="mb-4 flex items-center gap-3">
            <span
              className="grid size-10 place-items-center rounded-xl text-xl font-bold"
              style={{
                background: `${accentColor}18`,
                border: `1px solid ${accentColor}30`,
                color: accentColor,
              }}
            >
              {icon}
            </span>
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-medium"
              style={{
                borderColor: "rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.04)",
                color: "var(--text-secondary)",
              }}
            >
              <span className="size-1.5 rounded-full" style={{ background: accentColor }} />
              INTERNAL TOOL
            </div>
          </div>

          {/* Title with ShinyText */}
          <h1 className="font-display text-3xl font-bold tracking-[-0.5px] md:text-4xl">
            <ShinyText
              text={title}
              color="#ffffff"
              shineColor={accentColor}
              speed={4}
              spread={100}
              yoyo={true}
            />
          </h1>

          {subtitle && (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-secondary font-body">
              {subtitle}
            </p>
          )}
        </div>

        {/* Content */}
        {children}
      </div>
    </>
  );
}
