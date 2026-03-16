"use client";

import { useState } from "react";
import {
  FileText, BookOpen, Lightbulb, Link2, Pin, Trash2,
  Sparkles, ExternalLink, Tag, Clock, Loader2, ChevronDown, ChevronUp,
} from "lucide-react";
import { Note } from "@/types";
import { cn, formatRelative, truncate } from "@/lib/utils";

const TYPE_CONFIG = {
  note:    { icon: FileText,  color: "#5ebaff", bg: "rgba(94,186,255,0.08)",   label: "Note"    },
  article: { icon: BookOpen,  color: "#a78bfa", bg: "rgba(167,139,250,0.08)", label: "Article" },
  insight: { icon: Lightbulb, color: "#fbbf24", bg: "rgba(251,191,36,0.08)",  label: "Insight" },
  idea:    { icon: Link2,     color: "#34d399", bg: "rgba(52,211,153,0.08)",   label: "Idea"    },
};

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
  onPin: (id: string, pinned: boolean) => void;
  onSummarize: (id: string) => void;
  onTagClick: (tag: string) => void;
  summarizing?: boolean;
}

export default function NoteCard({
  note, onDelete, onPin, onSummarize, onTagClick, summarizing,
}: NoteCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const cfg = TYPE_CONFIG[note.type] || TYPE_CONFIG.note;
  const Icon = cfg.icon;
  const isLong = note.content.length > 200;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "var(--bg-card-hover)" : "var(--bg-card)",
        border: `1px solid ${note.pinned ? "rgba(94,186,255,0.2)" : hovered ? "rgba(255,255,255,0.1)" : "var(--border)"}`,
        borderRadius: 12,
        padding: "18px 20px",
        transition: "all 0.2s ease",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered ? "0 8px 32px rgba(0,0,0,0.3)" : "none",
        position: "relative",
        overflow: "hidden",
      }}
      className="animate-fade-in"
    >
      {/* Pinned indicator stripe */}
      {note.pinned && (
        <div
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: 2,
            background: "linear-gradient(90deg, var(--accent), var(--accent-2))",
          }}
        />
      )}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
        <div
          style={{
            width: 30, height: 30, borderRadius: 8, flexShrink: 0,
            background: cfg.bg,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <Icon size={14} style={{ color: cfg.color }} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 14,
              fontWeight: 600,
              color: "var(--text-primary)",
              lineHeight: 1.3,
              marginBottom: 2,
            }}
          >
            {note.title}
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                fontSize: 10, fontWeight: 600,
                letterSpacing: "0.06em", textTransform: "uppercase",
                color: cfg.color, opacity: 0.8,
              }}
            >
              {cfg.label}
            </span>
            <span style={{ color: "var(--text-muted)", fontSize: 10 }}>•</span>
            <span style={{ display: "flex", alignItems: "center", gap: 3, color: "var(--text-muted)", fontSize: 11 }}>
              <Clock size={9} />
              {formatRelative(note.createdAt)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div
          style={{
            display: "flex", gap: 4,
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.15s",
          }}
        >
          <ActionBtn
            onClick={() => onPin(note._id, !note.pinned)}
            title={note.pinned ? "Unpin" : "Pin"}
            active={note.pinned}
          >
            <Pin size={12} />
          </ActionBtn>
          <ActionBtn
            onClick={() => onSummarize(note._id)}
            title="AI Summarize"
            loading={summarizing}
          >
            {summarizing ? <Loader2 size={12} className="animate-spin-slow" /> : <Sparkles size={12} />}
          </ActionBtn>
          <ActionBtn onClick={() => onDelete(note._id)} title="Delete" danger>
            <Trash2 size={12} />
          </ActionBtn>
        </div>
      </div>

      {/* AI Summary badge */}
      {note.aiSummary && (
        <div
          style={{
            marginBottom: 10, padding: "8px 10px",
            background: "rgba(167,139,250,0.06)",
            border: "1px solid rgba(167,139,250,0.15)",
            borderRadius: 7,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
            <Sparkles size={10} style={{ color: "var(--accent-2)" }} />
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--accent-2)" }}>
              AI Summary
            </span>
          </div>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.55 }}>
            {note.aiSummary}
          </p>
        </div>
      )}

      {/* Content */}
      <p
        style={{
          fontSize: 13,
          color: "var(--text-secondary)",
          lineHeight: 1.6,
          marginBottom: 12,
        }}
      >
        {expanded ? note.content : truncate(note.content, 200)}
      </p>

      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            display: "flex", alignItems: "center", gap: 4,
            fontSize: 11, color: "var(--accent)", background: "none",
            border: "none", cursor: "pointer", padding: 0, marginBottom: 10,
          }}
        >
          {expanded ? <><ChevronUp size={11} /> Show less</> : <><ChevronDown size={11} /> Show more</>}
        </button>
      )}

      {/* Footer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {note.tags.slice(0, 4).map((tag) => (
            <button
              key={tag}
              onClick={() => onTagClick(tag)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 3,
                padding: "2px 7px",
                background: "var(--tag-bg)",
                border: "1px solid rgba(94,186,255,0.12)",
                borderRadius: 99,
                fontSize: 10, color: "var(--tag-text)",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              className="hover:brightness-125"
            >
              <Tag size={8} />
              {tag}
            </button>
          ))}
          {note.tags.length > 4 && (
            <span style={{ fontSize: 10, color: "var(--text-muted)", alignSelf: "center" }}>
              +{note.tags.length - 4}
            </span>
          )}
        </div>

        {note.url && (
          <a
            href={note.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", gap: 4,
              fontSize: 11, color: "var(--text-muted)",
              textDecoration: "none",
            }}
            className="hover:text-[var(--accent)]"
          >
            <ExternalLink size={10} />
            Source
          </a>
        )}
      </div>
    </div>
  );
}

function ActionBtn({
  children, onClick, title, active, danger, loading,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  active?: boolean;
  danger?: boolean;
  loading?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      disabled={loading}
      style={{
        width: 26, height: 26,
        display: "flex", alignItems: "center", justifyContent: "center",
        borderRadius: 6, border: "none", cursor: loading ? "wait" : "pointer",
        background: active
          ? "rgba(94,186,255,0.15)"
          : danger
          ? "rgba(248,113,113,0.08)"
          : "rgba(255,255,255,0.05)",
        color: active
          ? "var(--accent)"
          : danger
          ? "var(--danger)"
          : "var(--text-muted)",
        transition: "all 0.15s",
      }}
      className={cn("hover:brightness-125")}
    >
      {children}
    </button>
  );
}
