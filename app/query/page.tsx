import AIQueryInterface from "@/components/ai/AIQueryInterface";
export default function QueryPage() {
  return (
    <div style={{ padding: "28px 28px", height: "calc(100vh - 0px)" }}>
      <div
        style={{
          marginBottom: 20,
          paddingBottom: 20,
          borderBottom: "1px solid var(--border)",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            marginBottom: 4,
          }}
        >
          AI Query
        </h1>
        <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
          Converse with your knowledge base using Groq LLaMA 3.3 70B
        </p>
      </div>
      <AIQueryInterface />
    </div>
  );
}
