import NoteForm from "@/components/notes/NoteForm";
import { Sparkles } from "lucide-react";

export default function CapturePage() {
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
                background: "rgba(94,186,255,0.1)",
                border: "1px solid rgba(94,186,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Sparkles size={15} style={{ color: "var(--accent)" }} />
            </div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: "-0.03em",
              }}
            >
              Capture a Note
            </h1>
          </div>
          <p
            style={{
              fontSize: 13,
              color: "var(--text-secondary)",
              marginLeft: 42,
            }}
          >
            Add a new entry to your knowledge base. Use AI auto-tag to
            automatically categorize it with relevant tags.
          </p>
        </div>
        <NoteForm />
      </div>
    </div>
  );
}
