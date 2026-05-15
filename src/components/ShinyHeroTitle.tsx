"use client";

import ShinyText from "./ShinyText";

export default function ShinyHeroTitle() {
  return (
    <h1 className="font-display text-[2.75rem] font-bold leading-[1.08] tracking-[-1.5px] md:text-5xl lg:text-6xl">
      <ShinyText
        text="AI 内容星云，自动生长。"
        color="#ffffff"
        shineColor="#FF6A00"
        speed={3}
        spread={120}
        yoyo={true}
      />
    </h1>
  );
}
