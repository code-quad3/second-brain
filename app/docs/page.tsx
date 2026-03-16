import {
  Code2,
  Layers,
  Cpu,
  Globe,
  Zap,
  Shield,
  Database,
  Brain,
  ArrowRight,
  Terminal,
} from "lucide-react";

const Section = ({
  title,
  icon: Icon,
  color,
  children,
}: {
  title: string;
  icon: React.ElementType;
  color: string;
  children: React.ReactNode;
}) => (
  <div
    style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      borderRadius: 12,
      padding: "24px 28px",
      marginBottom: 20,
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 16,
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 9,
          background: `${color}15`,
          border: `1px solid ${color}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={16} style={{ color }} />
      </div>
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h2>
    </div>
    {children}
  </div>
);

const Code = ({ children }: { children: string }) => (
  <pre
    style={{
      background: "var(--bg-input)",
      border: "1px solid var(--border)",
      borderRadius: 8,
      padding: "14px 16px",
      fontSize: 12,
      fontFamily: "var(--font-mono)",
      color: "var(--text-secondary)",
      overflowX: "auto",
      lineHeight: 1.7,
      marginTop: 10,
    }}
  >
    {children}
  </pre>
);

const Badge = ({ label, color }: { label: string; color: string }) => (
  <span
    style={{
      display: "inline-block",
      padding: "2px 8px",
      borderRadius: 99,
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      background: `${color}15`,
      border: `1px solid ${color}30`,
      color,
      marginRight: 6,
    }}
  >
    {label}
  </span>
);

const P = ({ children }: { children: React.ReactNode }) => (
  <p
    style={{
      fontSize: 13,
      color: "var(--text-secondary)",
      lineHeight: 1.7,
      marginBottom: 10,
    }}
  >
    {children}
  </p>
);

const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3
    style={{
      fontFamily: "var(--font-display)",
      fontSize: 13,
      fontWeight: 600,
      color: "var(--text-primary)",
      marginBottom: 6,
      marginTop: 16,
    }}
  >
    {children}
  </h3>
);

export default function DocsPage() {
  return (
    <div style={{ padding: "28px 28px", maxWidth: 900 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 6,
          }}
        >
          <Badge label="v1.0" color="#5ebaff" />
          <Badge label="Public API" color="#34d399" />
          <Badge label="Open Architecture" color="#a78bfa" />
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 28,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            marginBottom: 8,
          }}
        >
          Architecture &amp; API Docs
        </h1>
        <p
          style={{
            fontSize: 14,
            color: "var(--text-secondary)",
            maxWidth: 600,
          }}
        >
          Second Brain is built on a portable, principles-first architecture
          designed for long-term maintainability, AI extensibility, and external
          integration.
        </p>
      </div>

      {/* 1. Portable Architecture */}
      <Section title="1. Portable Architecture" icon={Layers} color="#5ebaff">
        <P>
          The system maintains clean separation between four independent layers.
          Each layer can be swapped without breaking the others.
        </P>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 12,
            marginTop: 12,
          }}
        >
          {[
            {
              layer: "Presentation",
              stack: "Next.js 15 + React 19",
              desc: "App Router pages, React components, Tailwind CSS. Can be replaced with any React framework or even a mobile client.",
              color: "#5ebaff",
            },
            {
              layer: "API Layer",
              stack: "Next.js Route Handlers",
              desc: "RESTful JSON API at /api/*. Decoupled from UI — any client can consume it. Could migrate to Express or FastAPI independently.",
              color: "#a78bfa",
            },
            {
              layer: "AI Layer",
              stack: "Groq SDK (LLaMA 3.3 70B)",
              desc: "All AI logic isolated in lib/groq.ts. Swap Groq for OpenAI or Anthropic by changing one file. Three functions: summarize, autotag, query.",
              color: "#fbbf24",
            },
            {
              layer: "Data Layer",
              stack: "MongoDB + Mongoose",
              desc: "Schema defined in models/Note.ts. MongoDB Atlas or any MongoDB instance. Could swap to PostgreSQL by swapping the model and connectDB utility.",
              color: "#34d399",
            },
          ].map(({ layer, stack, desc, color }) => (
            <div
              key={layer}
              style={{
                padding: "14px 16px",
                borderRadius: 9,
                background: "var(--bg-input)",
                border: `1px solid ${color}20`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 4,
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  {layer}
                </span>
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  marginBottom: 4,
                }}
              >
                {stack}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  lineHeight: 1.6,
                }}
              >
                {desc}
              </div>
            </div>
          ))}
        </div>
        <Code>{`// To swap AI provider: only change lib/groq.ts
// To swap DB: only change lib/mongodb.ts + models/Note.ts
// To swap frontend: API routes stay identical
// Dependency direction: UI → API → AI/DB (never reversed)`}</Code>
      </Section>

      {/* 2. Principles-Based UX */}
      <Section title="2. Principles-Based UX" icon={Zap} color="#a78bfa">
        <P>Five design principles govern every AI interaction in the system:</P>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            marginTop: 4,
          }}
        >
          {[
            {
              num: "01",
              title: "AI as Amplifier, Not Replacement",
              desc: "AI features (summarize, autotag, query) are opt-in and additive. Users always retain full control of their data. AI enhances; it never overwrites without consent.",
            },
            {
              num: "02",
              title: "Progressive Disclosure",
              desc: "Notes show content first, AI summaries second. Users expand notes on demand. Complex features are hidden until needed, keeping the interface calm.",
            },
            {
              num: "03",
              title: "Feedback Immediacy",
              desc: "Every AI operation shows loading state, result, and error states. No silent failures. Users always know what the system is doing.",
            },
            {
              num: "04",
              title: "Context-Preserving Queries",
              desc: "The AI query interface sends the full conversation history and up to 20 notes as context. Responses cite which notes were searched.",
            },
            {
              num: "05",
              title: "Graceful Degradation",
              desc: "If Groq is unavailable, the rest of the app works perfectly — notes can still be created, searched, and tagged manually. AI is enhancement, not dependency.",
            },
          ].map(({ num, title, desc }) => (
            <div
              key={num}
              style={{
                display: "flex",
                gap: 14,
                padding: "12px 14px",
                borderRadius: 9,
                background: "var(--bg-input)",
                border: "1px solid var(--border)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--accent-2)",
                  flexShrink: 0,
                  marginTop: 2,
                }}
              >
                {num}
              </span>
              <div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    marginBottom: 3,
                  }}
                >
                  {title}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--text-muted)",
                    lineHeight: 1.6,
                  }}
                >
                  {desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 3. Agent Thinking */}
      <Section
        title="3. Agent Thinking — Automation That Improves the System"
        icon={Cpu}
        color="#fbbf24"
      >
        <P>
          Three automated pipelines run in the background to continuously
          improve knowledge quality without manual intervention:
        </P>
        <H3>Auto-Enrichment Pipeline</H3>
        <P>
          When a note is created, users can trigger the AI enrichment pipeline
          with one click. It runs summarization and tagging in parallel —
          calling the Groq API and updating MongoDB atomically. Future versions
          can run this automatically on save.
        </P>
        <Code>{`// POST /api/ai/autotag — called by NoteForm with one click
const tags = await generateTags(content, title);   // LLaMA 3.3 via Groq
await Note.findByIdAndUpdate(id, { tags, aiGenerated: true });

// POST /api/ai/summarize — called per note card
const summary = await summarizeContent(content);
await Note.findByIdAndUpdate(id, { aiSummary: summary });`}</Code>

        <H3>Semantic Query Engine</H3>
        <P>
          The query endpoint fetches the 20 most recent notes, formats them as
          structured context, and passes them to LLaMA 3.3 with a
          knowledge-assistant system prompt. This creates a conversational
          interface over the user&apos;s actual data — no vector database
          required for this scale.
        </P>
        <Code>{`// POST /api/ai/query
// 1. Fetch top 20 notes from MongoDB
// 2. Format as structured context blocks
// 3. Send to Groq with knowledge-assistant system prompt
// 4. Return answer + notesSearched count to UI`}</Code>

        <H3>MongoDB Text Index — Free-Text Intelligence</H3>
        <P>
          A compound text index on title, content, and tags enables full-text
          search across the entire knowledge base without a separate search
          engine.
        </P>
        <Code>{`NoteSchema.index({ title: "text", content: "text", tags: "text" });
// Enables: GET /api/notes?q=machine+learning
// MongoDB scores and ranks results automatically`}</Code>
      </Section>

      {/* 4. Public API / Infrastructure */}
      <Section
        title="4. Infrastructure — Public API &amp; Embeddable Widget"
        icon={Globe}
        color="#34d399"
      >
        <P>
          The system exposes a public read API at{" "}
          <code style={{ color: "var(--accent)", fontSize: 12 }}>
            /api/widget
          </code>
          . It returns sanitized, cacheable note data suitable for embedding in
          external sites.
        </P>

        <H3>Endpoint Reference</H3>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            marginBottom: 8,
          }}
        >
          {[
            {
              method: "GET",
              path: "/api/notes",
              desc: "List notes with search, filter, pagination",
            },
            { method: "POST", path: "/api/notes", desc: "Create a new note" },
            {
              method: "GET",
              path: "/api/notes/:id",
              desc: "Get a single note by ID",
            },
            {
              method: "PATCH",
              path: "/api/notes/:id",
              desc: "Update note (pin, tags, summary)",
            },
            { method: "DELETE", path: "/api/notes/:id", desc: "Delete a note" },
            {
              method: "POST",
              path: "/api/ai/summarize",
              desc: "Generate AI summary for content",
            },
            {
              method: "POST",
              path: "/api/ai/autotag",
              desc: "Auto-generate tags from content",
            },
            {
              method: "POST",
              path: "/api/ai/query",
              desc: "Conversational knowledge base query",
            },
            {
              method: "GET",
              path: "/api/widget",
              desc: "Public API — sanitized notes for embedding",
            },
            {
              method: "GET",
              path: "/api/stats",
              desc: "Knowledge base statistics",
            },
          ].map(({ method, path, desc }) => (
            <div
              key={path}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 12px",
                background: "var(--bg-input)",
                borderRadius: 7,
                border: "1px solid var(--border)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  fontWeight: 700,
                  color:
                    method === "GET"
                      ? "#34d399"
                      : method === "POST"
                        ? "#5ebaff"
                        : method === "PATCH"
                          ? "#fbbf24"
                          : "#f87171",
                  width: 48,
                  flexShrink: 0,
                }}
              >
                {method}
              </span>
              <code
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: "var(--text-primary)",
                  flex: 1,
                }}
              >
                {path}
              </code>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                {desc}
              </span>
            </div>
          ))}
        </div>

        <H3>Widget Usage Example</H3>
        <Code>{`<!-- Embed your public knowledge feed anywhere -->
<script>
  fetch('https://your-app.vercel.app/api/widget?limit=5&tag=research')
    .then(r => r.json())
    .then(({ notes, meta }) => {
      console.log(\`\${meta.total} total notes, showing \${meta.returned}\`);
      notes.forEach(n => console.log(n.title, n.summary, n.tags));
    });
</script>

// Response shape:
{
  "notes": [
    { "id": "...", "title": "...", "summary": "...", "tags": [...], "type": "insight" }
  ],
  "meta": { "total": 42, "returned": 5, "allTags": [...] }
}`}</Code>

        <H3>CORS &amp; Caching</H3>
        <P>
          The widget endpoint includes{" "}
          <code style={{ color: "var(--accent)", fontSize: 12 }}>
            Access-Control-Allow-Origin: *
          </code>{" "}
          and{" "}
          <code style={{ color: "var(--accent)", fontSize: 12 }}>
            Cache-Control: public, s-maxage=60
          </code>{" "}
          headers, making it safe to call from any external domain with edge
          caching.
        </P>
      </Section>

      {/* Deployment */}
      <Section title="Deployment Guide" icon={Terminal} color="#5ebaff">
        <Code>{`# 1. Clone and install
git clone <repo> && cd second-brain
npm install

# 2. Set environment variables
cp .env.local.example .env.local
# Fill in: MONGODB_URI, GROQ_API_KEY, NEXT_PUBLIC_APP_URL

# 3. Run locally
npm run dev   # → http://localhost:3000

# 4. Deploy to Vercel
vercel deploy
# Set env vars in Vercel dashboard → Settings → Environment Variables

# MongoDB Atlas: Create free cluster → Get connection string → Set MONGODB_URI
# Groq API key:  console.groq.com → API Keys → Create key → Set GROQ_API_KEY`}</Code>
      </Section>

      {/* Tech Stack */}
      <Section title="Full Tech Stack" icon={Database} color="#a78bfa">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 10,
          }}
        >
          {[
            {
              name: "Next.js 15",
              role: "Framework",
              note: "App Router + API Routes",
            },
            {
              name: "React 19",
              role: "UI",
              note: "Server + Client Components",
            },
            {
              name: "Tailwind CSS 4",
              role: "Styling",
              note: "CSS variables + utilities",
            },
            { name: "Groq SDK", role: "AI", note: "LLaMA 3.3 70B Versatile" },
            {
              name: "MongoDB Atlas",
              role: "Database",
              note: "NoSQL + text search",
            },
            { name: "Mongoose 9", role: "ODM", note: "Schema + model layer" },
            { name: "TypeScript", role: "Language", note: "Full type safety" },
            { name: "Vercel", role: "Deployment", note: "Edge + serverless" },
            {
              name: "Lucide React",
              role: "Icons",
              note: "Consistent icon system",
            },
          ].map(({ name, role, note }) => (
            <div
              key={name}
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: "var(--bg-input)",
                border: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  marginBottom: 2,
                }}
              >
                {name}
              </div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "var(--accent-2)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: 3,
                }}
              >
                {role}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                {note}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
