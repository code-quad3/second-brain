"use client";

import { useCallback, useEffect, useState } from "react";
import { Note, FilterState, NotesResponse } from "@/types";
import NoteCard from "./NoteCard";
import FilterBar from "./FilterBar";
import { ChevronLeft, ChevronRight, Plus, Brain } from "lucide-react";
import Link from "next/link";

export default function NotesGrid() {
  const [data, setData] = useState<NotesResponse | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    q: "",
    tag: "",
    type: "",
    sort: "createdAt",
  });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [summarizingId, setSummarizingId] = useState<string | null>(null);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      ...(filters.q && { q: filters.q }),
      ...(filters.tag && { tag: filters.tag }),
      ...(filters.type && { type: filters.type }),
      sort: filters.sort,
      page: String(page),
      limit: "12",
    });
    try {
      const res = await fetch(`/api/notes?${params}`);
      const json = await res.json();
      // Guard: only accept well-formed responses
      if (json && Array.isArray(json.notes)) {
        setData(json);
      } else {
        setData({ notes: [], total: 0, page: 1, totalPages: 1, allTags: [] });
      }
    } catch (e) {
      console.error(e);
      setData({ notes: [], total: 0, page: 1, totalPages: 1, allTags: [] });
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => fetchNotes(), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.q]);

  const handleFilter = (f: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...f }));
    setPage(1);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this note?")) return;
    await fetch(`/api/notes/${id}`, { method: "DELETE" });
    fetchNotes();
  };

  const handlePin = async (id: string, pinned: boolean) => {
    await fetch(`/api/notes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pinned }),
    });
    fetchNotes();
  };

  const handleSummarize = async (id: string) => {
    const note = data?.notes.find((n) => n._id === id);
    if (!note) return;
    setSummarizingId(id);
    try {
      await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteId: id, content: note.content }),
      });
      fetchNotes();
    } finally {
      setSummarizingId(null);
    }
  };

  const handleTagClick = (tag: string) => {
    handleFilter({ tag: filters.tag === tag ? "" : tag });
  };

  return (
    <div>
      <FilterBar
        filters={filters}
        onFilter={handleFilter}
        allTags={data?.allTags ?? []}
        total={data?.total ?? 0}
      />

      {/* Search input handled inline */}
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Full-text search across all notes..."
          value={filters.q}
          onChange={(e) => handleFilter({ q: e.target.value })}
          style={{
            width: "100%",
            background: "var(--bg-input)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "9px 14px",
            fontSize: 13,
            color: "var(--text-primary)",
            outline: "none",
            transition: "border-color 0.15s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "rgba(94,186,255,0.3)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
        />
      </div>

      {/* Loading skeletons */}
      {loading && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 14,
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 200 }} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && (data?.notes?.length ?? 0) === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "80px 20px",
            color: "var(--text-muted)",
          }}
        >
          <Brain size={40} style={{ margin: "0 auto 16px", opacity: 0.3 }} />
          <p
            style={{
              fontSize: 16,
              marginBottom: 8,
              color: "var(--text-secondary)",
            }}
          >
            {filters.q || filters.tag || filters.type
              ? "No notes match your filters"
              : "Your second brain is empty"}
          </p>
          <p style={{ fontSize: 13, marginBottom: 20 }}>
            {filters.q || filters.tag || filters.type
              ? "Try adjusting your search or filters"
              : "Start capturing your thoughts, articles, and insights"}
          </p>
          <Link
            href="/capture"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "9px 18px",
              borderRadius: 8,
              background: "rgba(94,186,255,0.1)",
              border: "1px solid rgba(94,186,255,0.2)",
              color: "var(--accent)",
              textDecoration: "none",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            <Plus size={14} /> Add your first note
          </Link>
        </div>
      )}

      {/* Notes grid */}
      {!loading && data && (data.notes?.length ?? 0) > 0 && (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 14,
              marginBottom: 24,
            }}
          >
            {data.notes.map((note: Note, i) => (
              <div
                key={note._id}
                style={{ animationDelay: `${i * 40}ms` }}
                className="animate-fade-in"
              >
                <NoteCard
                  note={note}
                  onDelete={handleDelete}
                  onPin={handlePin}
                  onSummarize={handleSummarize}
                  onTagClick={handleTagClick}
                  summarizing={summarizingId === note._id}
                />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                style={paginationBtnStyle(page === 1)}
              >
                <ChevronLeft size={14} />
              </button>
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                Page {page} of {data.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                disabled={page === data.totalPages}
                style={paginationBtnStyle(page === data.totalPages)}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

const paginationBtnStyle = (disabled: boolean): React.CSSProperties => ({
  width: 32,
  height: 32,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 7,
  border: "1px solid var(--border)",
  background: "var(--bg-card)",
  color: disabled ? "var(--text-muted)" : "var(--text-primary)",
  cursor: disabled ? "not-allowed" : "pointer",
  opacity: disabled ? 0.4 : 1,
  transition: "all 0.15s",
});
