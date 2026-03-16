"use client";

import * as Select from "@radix-ui/react-select";
import { Filter, ArrowUpDown, Tag, X, ChevronDown, Check } from "lucide-react";
import { FilterState } from "@/types";

interface FilterBarProps {
  filters: FilterState;
  onFilter: (f: Partial<FilterState>) => void;
  allTags: string[];
  total: number;
}

const TYPES = [
  { value: "__all__", label: "All Types" },
  { value: "note", label: "Notes" },
  { value: "article", label: "Articles" },
  { value: "insight", label: "Insights" },
  { value: "idea", label: "Ideas" },
];

const SORTS = [
  { value: "createdAt", label: "Newest First" },
  { value: "title", label: "Title A–Z" },
];

/* ── Shared Radix trigger style ─────────────────────────────────── */
const triggerCls = [
  "inline-flex items-center gap-1.5",
  "h-8 px-3 rounded-lg",
  "border border-[var(--border)] bg-[var(--bg-card)]",
  "text-xs font-medium text-[var(--text-secondary)]",
  "transition-all duration-150 cursor-pointer outline-none",
  "hover:border-[rgba(94,186,255,0.35)] hover:text-[var(--text-primary)]",
  "hover:bg-[var(--bg-card-hover)]",
  "focus-visible:ring-2 focus-visible:ring-[var(--accent)]",
  "data-[state=open]:border-[rgba(94,186,255,0.4)]",
  "data-[state=open]:bg-[var(--bg-card-hover)]",
  "data-[state=open]:text-[var(--text-primary)]",
].join(" ");

/* ── Shared Radix content (dropdown panel) style ────────────────── */
const contentCls = [
  "z-50 min-w-[148px] overflow-hidden",
  "rounded-sm border border-[var(--border)]",
  "bg-[var(--bg-card)] shadow-lg shadow-black/[0.06]",
  "p-1",
  /* Radix entrance animations */
  "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
  "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
  "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
].join(" ");

/* ── Shared Radix item style ────────────────────────────────────── */
const itemCls = [
  "relative flex items-center gap-2",
  "px-9 py-2 rounded-md",
  "text-md font-medium text-[var(--text-secondary)]",
  "cursor-pointer outline-none select-none transition-colors duration-100",
  "data-[highlighted]:bg-[rgba(94,186,255,0.08)]",
  "data-[highlighted]:text-[var(--text-primary)]",
  "data-[state=checked]:text-[var(--accent)]",
  "data-[state=checked]:bg-[rgba(94,186,255,0.08)]",
].join(" ");

export default function FilterBar({
  filters,
  onFilter,
  allTags,
  total,
}: FilterBarProps) {
  const hasActiveFilters = filters.tag || filters.type || filters.q;

  /* Radix uses a controlled string value — map empty string ↔ sentinel */
  const typeValue = filters.type || "__all__";

  return (
    <div className="flex flex-wrap items-center gap-2 mb-5">
      {/* ── Note count ──────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 shrink-0">
        <Filter size={12} className="text-[var(--text-muted)]" aria-hidden />
        <span className="text-xs text-[var(--text-muted)] tabular-nums">
          {total} {total === 1 ? "note" : "notes"}
        </span>
      </div>

      {/* Divider */}
      <div className="w-px h-4 bg-[var(--border)] shrink-0" aria-hidden />

      {/* ── Type selector (Radix) ────────────────────────────────── */}
      <Select.Root
        value={typeValue}
        onValueChange={(v) => onFilter({ type: v === "__all__" ? "" : v })}
      >
        <Select.Trigger className={triggerCls} aria-label="Filter by type">
          <Select.Value />
          <ChevronDown
            size={11}
            className="text-[var(--text-muted)] transition-transform duration-200 [[data-state=open]_&]:rotate-180"
          />
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            className={contentCls}
            position="popper"
            sideOffset={6}
          >
            <Select.Viewport>
              {TYPES.map((t) => (
                <Select.Item key={t.value} value={t.value} className={itemCls}>
                  <Select.ItemIndicator className="absolute left-2">
                    <Check size={10} className="text-[var(--accent)]" />
                  </Select.ItemIndicator>
                  <span className="pl-3">
                    <Select.ItemText>{t.label}</Select.ItemText>
                  </span>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>

      {/* ── Sort selector (Radix) ────────────────────────────────── */}
      <Select.Root
        value={filters.sort}
        onValueChange={(v) => onFilter({ sort: v as FilterState["sort"] })}
      >
        <Select.Trigger className={triggerCls} aria-label="Sort notes">
          <ArrowUpDown
            size={11}
            className="text-[var(--text-muted)]"
            aria-hidden
          />
          <Select.Value />
          <ChevronDown
            size={11}
            className="text-[var(--text-muted)] transition-transform duration-200 [[data-state=open]_&]:rotate-180"
          />
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            className={contentCls}
            position="popper"
            sideOffset={6}
          >
            <Select.Viewport>
              {SORTS.map((s) => (
                <Select.Item key={s.value} value={s.value} className={itemCls}>
                  <Select.ItemIndicator className="absolute left-2">
                    <Check size={10} className="text-[var(--accent)]" />
                  </Select.ItemIndicator>
                  <span className="pl-3">
                    <Select.ItemText>{s.label}</Select.ItemText>
                  </span>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>

      {/* ── Tag pills ────────────────────────────────────────────── */}
      {allTags.slice(0, 8).map((tag) => {
        const active = filters.tag === tag;
        return (
          <button
            key={tag}
            type="button"
            onClick={() => onFilter({ tag: active ? "" : tag })}
            className={[
              "inline-flex items-center gap-1 h-8 px-2.5 rounded-full",
              "text-[11px] font-medium border",
              "transition-all duration-150 cursor-pointer",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-[var(--accent)]",
              active
                ? "bg-[rgba(94,186,255,0.1)] border-[rgba(94,186,255,0.35)] text-[var(--accent)]"
                : "bg-transparent border-[var(--border)] text-[var(--text-muted)] hover:border-[rgba(94,186,255,0.25)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-card)]",
            ].join(" ")}
          >
            <Tag size={9} aria-hidden />
            {tag}
          </button>
        );
      })}

      {/* ── Clear filters ────────────────────────────────────────── */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={() => onFilter({ q: "", tag: "", type: "" })}
          className={`
px-3.5 py-2 inline-flex items-center gap-2 rounded-sm
text-[19px] font-medium
border border-[rgba(248,113,113,0.25)]
bg-[rgba(248,113,113,0.05)] text-[var(--danger)]
transition-all duration-150 cursor-pointer
hover:bg-[rgba(248,113,113,0.1)] hover:border-[rgba(248,113,113,0.4)]
focus-visible:outline-none focus-visible:ring-2
focus-visible:ring-[var(--danger)]
`}
        >
          <X size={13} aria-hidden />
          Clear
        </button>
      )}
    </div>
  );
}
