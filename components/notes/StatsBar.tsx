"use client";

import { useEffect, useState } from "react";
import {
  Brain,
  Sparkles,
  FileText,
  BookOpen,
  Lightbulb,
  Link2,
} from "lucide-react";
import { StatsResponse } from "@/types";

export default function StatsBar() {
  const [stats, setStats] = useState<StatsResponse | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(console.error);
  }, []);

  const items = [
    {
      label: "Total Notes",
      value: stats?.total ?? 0,
      icon: Brain,
      color: "var(--accent)",
      bg: "rgba(94,186,255,0.08)",
    },
    {
      label: "AI Enhanced",
      value: stats?.withAI ?? 0,
      icon: Sparkles,
      color: "var(--accent-2)",
      bg: "rgba(167,139,250,0.08)",
    },
    {
      label: "Notes",
      value: stats?.byType?.note ?? 0,
      icon: FileText,
      color: "#5ebaff",
      bg: "rgba(94,186,255,0.06)",
    },
    {
      label: "Articles",
      value: stats?.byType?.article ?? 0,
      icon: BookOpen,
      color: "#a78bfa",
      bg: "rgba(167,139,250,0.06)",
    },
    {
      label: "Insights",
      value: stats?.byType?.insight ?? 0,
      icon: Lightbulb,
      color: "#fbbf24",
      bg: "rgba(251,191,36,0.06)",
    },
    {
      label: "Ideas",
      value: stats?.byType?.idea ?? 0,
      icon: Link2,
      color: "#34d399",
      bg: "rgba(52,211,153,0.06)",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(6, 1fr)",
        gap: 12,
        marginBottom: 28,
      }}
    >
      {items.map(({ label, value, icon: Icon, color, bg }) => (
        <div
          key={label}
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            padding: "14px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              background: bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon size={24} style={{ color }} />
          </div>
          <div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                fontFamily: "var(--font-display)",
                color: "var(--text-primary)",
                lineHeight: 1,
                marginBottom: 3,
              }}
            >
              {stats ? (
                value
              ) : (
                <span
                  style={{
                    display: "inline-block",
                    width: 28,
                    height: 18,
                    borderRadius: 4,
                  }}
                  className="skeleton"
                />
              )}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
              {label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
