"use client";

import MagicRings from "./MagicRings";

export default function ControlNodeRings() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      <MagicRings
        color="#FF6A00"
        colorTwo="#8B5CF6"
        ringCount={4}
        opacity={0.25}
        followMouse={true}
        mouseInfluence={0.1}
        blur={2}
        speed={0.8}
      />
    </div>
  );
}
