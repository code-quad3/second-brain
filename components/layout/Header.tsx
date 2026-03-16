"use client";

import { useState } from "react";
import { Search, Plus, X } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  onSearch?: (q: string) => void;
  searchValue?: string;
  title?: string;
}

export default function Header({ onSearch, searchValue = "", title }: HeaderProps) {
  const [focused, setFocused] = useState(false);

  return (
    <header
      style={{
        height: 60,
        background: "rgba(8,11,18,0.9)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        padding: "0 24px",
        gap: 16,
        position: "sticky",
        top: 0,
        zIndex: 30,
      }}
    >
      {title && (
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 17,
            fontWeight: 700,
            color: "var(--text-primary)",
            letterSpacing: "-0.02em",
            marginRight: 8,
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </h1>
      )}

      {onSearch && (
        <div
          style={{
            flex: 1,
            maxWidth: 480,
            position: "relative",
          }}
        >
          <Search
            size={14}
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: focused ? "var(--accent)" : "var(--text-muted)",
              transition: "color 0.15s",
              pointerEvents: "none",
            }}
          />
          <input
            type="text"
            placeholder="Search your knowledge base..."
            value={searchValue}
            onChange={(e) => onSearch(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
              width: "100%",
              background: "var(--bg-input)",
              border: `1px solid ${focused ? "rgba(94,186,255,0.3)" : "var(--border)"}`,
              borderRadius: 8,
              padding: "7px 36px 7px 34px",
              fontSize: 13,
              color: "var(--text-primary)",
              outline: "none",
              transition: "border-color 0.15s, box-shadow 0.15s",
              boxShadow: focused ? "0 0 0 3px rgba(94,186,255,0.08)" : "none",
            }}
          />
          {searchValue && (
            <button
              onClick={() => onSearch("")}
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-muted)",
                padding: 2,
                display: "flex",
                alignItems: "center",
              }}
            >
              <X size={12} />
            </button>
          )}
        </div>
      )}

      <div style={{ flex: 1 }} />

      <Link
        href="/capture"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "7px 14px",
          borderRadius: 8,
          background: "linear-gradient(135deg, rgba(94,186,255,0.15), rgba(167,139,250,0.15))",
          border: "1px solid rgba(94,186,255,0.2)",
          color: "var(--accent)",
          textDecoration: "none",
          fontSize: 13,
          fontWeight: 600,
          transition: "all 0.15s ease",
          whiteSpace: "nowrap",
        }}
        className="hover:brightness-125"
      >
        <Plus size={14} />
        New Note
      </Link>
    </header>
  );
}
