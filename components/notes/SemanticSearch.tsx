"use client";

import { useState } from "react";
import { Sparkles, Search, Loader2, Tag, Clock } from "lucide-react";
import { formatRelative } from "@/lib/utils";

interface SemanticResult {
  _id: string;
  title: string;
  content: string;
  type: string;
  tags: string[];
  aiSummary?: string;
  score: number;
}

export default function SemanticSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SemanticResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch("/api/notes/semantic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      {/* Search Input */}
      <div
        style={{
          display: "flex",
          gap: 8,
          padding: "6px 6px 6px 16px",
          background: "var(--bg-card)",
          border: "1px solid rgba(94,186,255,0.2)",
          borderRadius: 12,
          marginBottom: 24,
        }}
      >
        <Sparkles
          size={16}
          style={{ color: "var(--accent)", alignSelf: "center", flexShrink: 0 }}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder='Try "ideas about productivity" or "machine learning concepts"...'
          style={{
            flex: 1,
            background: "none",
            border: "none",
            outline: "none",
            fontSize: 14,
            color: "var(--text-primary)",
            padding: "6px 0",
          }}
        />
        <button
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 16px",
            borderRadius: 8,
            background:
              "linear-gradient(135deg, rgba(94,186,255,0.2), rgba(167,139,250,0.2))",
            border: "1px solid rgba(94,186,255,0.25)",
            color: "var(--accent)",
            fontSize: 13,
            fontWeight: 600,
            cursor: loading || !query.trim() ? "not-allowed" : "pointer",
            opacity: loading || !query.trim() ? 0.5 : 1,
            whiteSpace: "nowrap",
          }}
        >
          {loading ? (
            <>
              <Loader2 size={14} className="animate-spin-slow" /> Searching...
            </>
          ) : (
            <>
              <Search size={14} /> Search
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {searched && !loading && results.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "48px 0",
            color: "var(--text-muted)",
          }}
        >
          <Search size={32} style={{ margin: "0 auto 12px", opacity: 0.3 }} />
          <p>No semantically similar notes found.</p>
          <p style={{ fontSize: 12, marginTop: 4 }}>
            Try rephrasing your query.
          </p>
        </div>
      )}

      {results.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <p
            style={{
              fontSize: 12,
              color: "var(--text-muted)",
              marginBottom: 4,
            }}
          >
            {results.length} semantically similar{" "}
            {results.length === 1 ? "note" : "notes"} found
          </p>

          {results.map((note, i) => (
            <div
              key={note._id}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: "16px 20px",
                position: "relative",
                overflow: "hidden",
                animationDelay: `${i * 50}ms`,
              }}
              className="animate-fade-in"
            >
              {/* Similarity score bar */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  height: 2,
                  width: `${Math.round(note.score * 100)}%`,
                  background:
                    "linear-gradient(90deg, var(--accent), var(--accent-2))",
                }}
              />

              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 12,
                  marginBottom: 8,
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--text-primary)",
                  }}
                >
                  {note.title}
                </h3>
                {/* Similarity badge */}
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: 99,
                    background: "rgba(94,186,255,0.1)",
                    border: "1px solid rgba(94,186,255,0.2)",
                    color: "var(--accent)",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {Math.round(note.score * 100)}% match
                </span>
              </div>

              {note.aiSummary ? (
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                    marginBottom: 10,
                  }}
                >
                  {note.aiSummary}
                </p>
              ) : (
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                    marginBottom: 10,
                  }}
                >
                  {note.content.slice(0, 180)}
                  {note.content.length > 180 ? "…" : ""}
                </p>
              )}

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 6,
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: "var(--text-muted)",
                    marginRight: 4,
                  }}
                >
                  {note.type}
                </span>
                {note.tags?.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 3,
                      padding: "2px 7px",
                      background: "var(--tag-bg)",
                      border: "1px solid rgba(94,186,255,0.12)",
                      borderRadius: 99,
                      fontSize: 10,
                      color: "var(--tag-text)",
                    }}
                  >
                    <Tag size={8} />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
