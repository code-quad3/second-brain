import SemanticSearch from "@/components/notes/SemanticSearch";
import { Sparkles } from "lucide-react";

export default function SemanticPage() {
  return (
    <div style={{ padding: "28px 28px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ marginBottom: 32 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 6,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 9,
                background: "rgba(167,139,250,0.1)",
                border: "1px solid rgba(167,139,250,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Sparkles size={15} style={{ color: "var(--accent-2)" }} />
            </div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: "-0.03em",
              }}
            >
              Semantic Search
            </h1>
          </div>
          <p
            style={{
              fontSize: 13,
              color: "var(--text-secondary)",
              marginLeft: 42,
            }}
          >
            Search by{" "}
            <strong style={{ color: "var(--text-primary)" }}>meaning</strong>,
            not just keywords. Uses MongoDB Atlas Vector Search + Voyage AI
            embeddings.
          </p>
        </div>
        <SemanticSearch />
      </div>
    </div>
  );
}
