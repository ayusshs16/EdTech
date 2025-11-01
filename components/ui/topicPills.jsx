import React from "react";

// Simple deterministic hash to map topic text -> palette index
function hashStringToIndex(str, modulo) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return Math.abs(h) % modulo;
}

export default function TopicPills({ topics = [], size = "md" }) {
  // Expanded palette with trust-focused blues + complementary colors
  const palette = [
    "bg-sky-100 text-sky-800",
    "bg-cyan-100 text-cyan-800",
    "bg-blue-100 text-blue-800",
    "bg-indigo-100 text-indigo-800",
    "bg-emerald-100 text-emerald-800",
    "bg-violet-100 text-violet-800",
    "bg-fuchsia-100 text-fuchsia-800",
    "bg-amber-100 text-amber-800",
  ];

  if (!topics || topics.length === 0) return null;

  const sizeClass = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {topics.map((t, i) => {
        const idx = hashStringToIndex(String(t || ""), palette.length);
        const color = palette[idx];
        return (
          <span
            key={i}
            className={`rounded-full font-medium ${sizeClass} ${color}`}
          >
            {t}
          </span>
        );
      })}
    </div>
  );
}
