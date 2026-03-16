"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  BookOpen,
  Lightbulb,
  Link2,
  Tag,
  Sparkles,
  Loader2,
  X,
  Save,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { NoteType } from "@/types";

/* ─── Type definitions ───────────────────────────────────────────── */
const TYPES: {
  value: NoteType;
  label: string;
  icon: React.ElementType;
  desc: string;
}[] = [
  {
    value: "note",
    label: "Note",
    icon: FileText,
    desc: "General notes and thoughts",
  },
  {
    value: "article",
    label: "Article",
    icon: BookOpen,
    desc: "Articles you've read",
  },
  {
    value: "insight",
    label: "Insight",
    icon: Lightbulb,
    desc: "Key learnings and insights",
  },
  { value: "idea", label: "Idea", icon: Link2, desc: "Ideas worth exploring" },
];

/* ─── Shared class strings ───────────────────────────────────────── */
const fieldCls =
  "w-full px-4 py-3 rounded-xl " +
  "border border-[var(--border)] bg-[var(--bg-input)] " +
  "text-sm text-[var(--text-primary)] " +
  "placeholder:text-[var(--text-muted)] " +
  "outline-none transition-all duration-150 " +
  "focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-glow)]";

const labelCls =
  "block text-sm font-semibold tracking-wide " +
  "text-[var(--text-secondary)] mb-2";

/* ─── Component ──────────────────────────────────────────────────── */
export default function NoteForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    content: "",
    url: "",
    type: "note" as NoteType,
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [autoTagging, setAutoTagging] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  /* ── handlers ── */
  const addTag = (raw: string) => {
    const t = raw.trim().toLowerCase().replace(/\s+/g, "-");
    if (t && !form.tags.includes(t))
      setForm((f) => ({ ...f, tags: [...f.tags, t] }));
    setTagInput("");
  };

  const removeTag = (tag: string) =>
    setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }));

  const handleAutoTag = async () => {
    if (!form.title || !form.content) return;
    setAutoTagging(true);
    try {
      const res = await fetch("/api/ai/autotag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: form.title, content: form.content }),
      });
      const data = await res.json();
      if (data.tags?.length)
        setForm((f) => ({
          ...f,
          tags: [...new Set([...f.tags, ...data.tags])],
        }));
    } finally {
      setAutoTagging(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      setError("Title and content are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setSuccess(true);
      setTimeout(() => router.push("/"), 800);
    } catch {
      setError("Failed to save note. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  /* ── render ── */
  return (
    /*
     * Outer shell responsive strategy
     * ─────────────────────────────────
     * mobile (< 640px)  → full width, px-4 gutters
     * tablet (640–767px) → full width, px-6 gutters
     * md+ (≥ 768px)     → capped at max-w-2xl, centred, no gutters
     */
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 md:px-0">
      {/* ── 1. Type selector ───────────────────────────────────────── */}
      <fieldset className="mb-8">
        <legend className={`${labelCls} mb-3`}>Note Type</legend>

        {/*
          mobile (<sm) : 2 columns — fits 375px+ without crowding
          sm+           : 4 columns across
        */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TYPES.map(({ value, label, icon: Icon, desc }) => {
            const active = form.type === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setForm((f) => ({ ...f, type: value }))}
                className={[
                  "flex flex-col items-center justify-center gap-2",
                  "rounded-xl border px-2 py-4 text-center",
                  "transition-all duration-150",
                  "focus-visible:outline-none focus-visible:ring-2",
                  "focus-visible:ring-[var(--accent)]",
                  active
                    ? "bg-[var(--accent-glow)] border-[var(--accent)]"
                    : "bg-[var(--bg-card)] border-[var(--border)] hover:bg-[var(--bg-card-hover)]",
                ].join(" ")}
              >
                <Icon
                  size={20}
                  aria-hidden
                  className={
                    active ? "text-[var(--accent)]" : "text-[var(--text-muted)]"
                  }
                />

                <span
                  className={[
                    "text-sm font-semibold leading-tight",
                    active
                      ? "text-[var(--accent)]"
                      : "text-[var(--text-secondary)]",
                  ].join(" ")}
                >
                  {label}
                </span>

                {/* description hidden on very small screens to reduce clutter */}
                <span className="text-xs text-[var(--text-muted)] leading-tight hidden min-[420px]:block">
                  {desc}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* ── 2. Title ─────────────────────────────────────────────── */}
      <div className="mb-5">
        <label htmlFor="note-title" className={labelCls}>
          Title{" "}
          <span className="text-[var(--danger)] font-normal" aria-hidden="true">
            *
          </span>
        </label>
        <input
          id="note-title"
          type="text"
          placeholder="Give your note a clear, memorable title…"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          className={fieldCls}
          autoComplete="off"
        />
      </div>

      {/* ── 3. Content ───────────────────────────────────────────── */}
      <div className="mb-5">
        <label htmlFor="note-content" className={labelCls}>
          Content{" "}
          <span className="text-[var(--danger)] font-normal" aria-hidden="true">
            *
          </span>
        </label>
        <textarea
          id="note-content"
          placeholder="Capture your thought, insight, or idea in full detail…"
          value={form.content}
          onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
          /* fewer rows on mobile, more on larger screens via min-height */
          rows={6}
          className={`${fieldCls} resize-y min-h-[120px] sm:min-h-[160px]`}
        />
        <p className="text-right text-xs text-[var(--text-muted)] mt-1">
          {form.content.length} characters
        </p>
      </div>

      {/* ── 4. Source URL ────────────────────────────────────────── */}
      <div className="mb-7">
        <label htmlFor="note-url" className={labelCls}>
          Source URL{" "}
          <span className="text-[var(--text-muted)] text-xs font-normal">
            (optional)
          </span>
        </label>
        <input
          id="note-url"
          type="url"
          placeholder="https://…"
          value={form.url}
          onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
          className={fieldCls}
          autoComplete="off"
          inputMode="url"
        />
      </div>

      {/* ── 5. Tags ──────────────────────────────────────────────── */}
      <div className="mb-8">
        {/* header row — wraps gracefully on narrow screens */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <label className={`${labelCls} mb-0`}>Tags</label>

          <button
            type="button"
            onClick={handleAutoTag}
            disabled={autoTagging || !form.title || !form.content}
            aria-label="Auto-generate tags with AI"
            className={[
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg",
              "text-xs font-semibold border transition-all duration-150",
              "bg-[rgba(167,139,250,0.08)] border-[rgba(167,139,250,0.2)]",
              "text-[var(--accent-2)]",
              autoTagging || !form.title || !form.content
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-[rgba(167,139,250,0.15)] cursor-pointer",
            ].join(" ")}
          >
            {autoTagging ? (
              <Loader2 size={12} className="animate-spin" aria-hidden />
            ) : (
              <Sparkles size={12} aria-hidden />
            )}
            AI Auto-tag
          </button>
        </div>

        {/* pill + input box */}
        <div
          className={[
            "flex flex-wrap gap-2 px-3 py-2.5 min-h-[48px]",
            "bg-[var(--bg-input)] border border-[var(--border)] rounded-xl",
            "transition-all duration-150",
            "focus-within:border-[var(--accent)]",
            "focus-within:ring-2 focus-within:ring-[var(--accent-glow)]",
          ].join(" ")}
        >
          {form.tags.map((tag) => (
            <span
              key={tag}
              className={[
                "inline-flex items-center gap-1 px-2.5 py-1",
                "text-xs rounded-full leading-none",
                "bg-[var(--tag-bg)] text-[var(--tag-text)]",
                "border border-[rgba(94,186,255,0.15)]",
              ].join(" ")}
            >
              <Tag size={10} aria-hidden />
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                aria-label={`Remove tag "${tag}"`}
                className="opacity-60 hover:opacity-100 transition-opacity"
              >
                <X size={11} />
              </button>
            </span>
          ))}

          <input
            type="text"
            placeholder={
              form.tags.length === 0
                ? "Type a tag and press Enter…"
                : "Add more…"
            }
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                addTag(tagInput);
              }
            }}
            className={[
              "flex-1 min-w-[120px] bg-transparent border-none outline-none",
              "text-sm text-[var(--text-primary)]",
              "placeholder:text-[var(--text-muted)]",
            ].join(" ")}
          />
        </div>

        <p className="text-xs text-[var(--text-muted)] mt-1.5">
          Press Enter or comma to add a tag
        </p>
      </div>

      {/* ── 6. Error / success banners ───────────────────────────── */}
      {error && (
        <div
          role="alert"
          className={[
            "flex items-start gap-2.5 px-4 py-3 mb-5 rounded-xl text-sm",
            "bg-[rgba(248,113,113,0.08)] border border-[rgba(248,113,113,0.2)]",
            "text-[var(--danger)]",
          ].join(" ")}
        >
          <AlertCircle size={15} className="mt-0.5 shrink-0" aria-hidden />
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className={[
            "flex items-center gap-2.5 px-4 py-3 mb-5 rounded-xl text-sm",
            "bg-[rgba(52,211,153,0.08)] border border-[rgba(52,211,153,0.2)]",
            "text-[var(--success)]",
          ].join(" ")}
        >
          <CheckCircle2 size={15} className="shrink-0" aria-hidden />
          Note saved! Redirecting to dashboard…
        </div>
      )}

      {/* ── 7. Submit ────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={saving || success}
        className={[
          "w-full flex items-center justify-center gap-2",
          "px-6 py-3.5 rounded-xl text-base font-bold",
          "bg-gradient-to-br",
          "from-[rgba(94,186,255,0.2)] to-[rgba(167,139,250,0.2)]",
          "border border-[rgba(94,186,255,0.25)] text-[var(--accent)]",
          "transition-all duration-200",
          "hover:brightness-110 active:scale-[0.99]",
          saving ? "cursor-wait opacity-70" : "cursor-pointer",
          success ? "opacity-70" : "",
        ].join(" ")}
      >
        {saving ? (
          <>
            <Loader2 size={16} className="animate-spin" aria-hidden />
            Saving…
          </>
        ) : (
          <>
            <Save size={16} aria-hidden />
            Save to Brain
          </>
        )}
      </button>
    </div>
  );
}
