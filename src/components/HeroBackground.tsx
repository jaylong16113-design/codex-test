"use client";

import Aurora from "./Aurora";

export default function HeroBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 opacity-30">
      <Aurora
        colorStops={["#FF6A00", "#00E5FF", "#8B5CF6"]}
        amplitude={0.5}
        blend={0.3}
        speed={0.5}
      />
    </div>
  );
}
