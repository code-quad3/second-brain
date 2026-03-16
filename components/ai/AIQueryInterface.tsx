"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Loader2, Brain, User, RotateCcw } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  notesSearched?: number;
}

const EXAMPLE_QUESTIONS = [
  "What are my key insights about productivity?",
  "Summarize everything I know about machine learning",
  "What ideas have I captured recently?",
  "Find connections between my notes on creativity",
];

export default function AIQueryInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (question: string) => {
    if (!question.trim() || loading) return;
    const userMsg: Message = { role: "user", content: question };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: data.answer || data.error || "No response",
          notesSearched: data.notesSearched,
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "An error occurred. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 100px)",
        maxWidth: 780,
        margin: "0 auto",
      }}
    >
      {/* Empty state */}
      {messages.length === 0 && (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
            padding: "40px 20px",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background:
                "linear-gradient(135deg, rgba(94,186,255,0.15), rgba(167,139,250,0.15))",
              border: "1px solid rgba(94,186,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            className="animate-float"
          >
            <Brain size={28} style={{ color: "var(--accent)" }} />
          </div>
          <div style={{ textAlign: "center" }}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 24,
                fontWeight: 700,
                marginBottom: 8,
                letterSpacing: "-0.02em",
              }}
            >
              Ask Your <span className="gradient-text">Second Brain</span>
            </h2>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: 14,
                maxWidth: 400,
              }}
            >
              Powered by Groq LLaMA 3.3 — ask anything about your notes, find
              connections, or get summaries of your knowledge.
            </p>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              justifyContent: "center",
              maxWidth: 540,
            }}
          >
            {EXAMPLE_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                style={{
                  padding: "8px 14px",
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                  background: "var(--bg-card)",
                  color: "var(--text-secondary)",
                  fontSize: 12,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  textAlign: "left",
                }}
                className="hover:border-[rgba(94,186,255,0.2)] hover:text-[var(--text-primary)]"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      {messages.length > 0 && (
        <div
          style={{
            flex: 1,
            padding: "20px 0",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 12,
                flexDirection: msg.role === "user" ? "row-reverse" : "row",
                alignItems: "flex-start",
              }}
              className="animate-fade-in"
            >
              {/* Avatar */}
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    msg.role === "user"
                      ? "rgba(94,186,255,0.1)"
                      : "rgba(167,139,250,0.1)",
                  border: `1px solid ${msg.role === "user" ? "rgba(94,186,255,0.2)" : "rgba(167,139,250,0.2)"}`,
                }}
              >
                {msg.role === "user" ? (
                  <User size={14} style={{ color: "var(--accent)" }} />
                ) : (
                  <Sparkles size={14} style={{ color: "var(--accent-2)" }} />
                )}
              </div>

              {/* Bubble */}
              <div
                style={{
                  maxWidth: "80%",
                  padding: "12px 16px",
                  borderRadius:
                    msg.role === "user"
                      ? "12px 4px 12px 12px"
                      : "4px 12px 12px 12px",
                  background:
                    msg.role === "user"
                      ? "rgba(94,186,255,0.08)"
                      : "var(--bg-card)",
                  border: `1px solid ${msg.role === "user" ? "rgba(94,186,255,0.15)" : "var(--border)"}`,
                  fontSize: 14,
                  color: "var(--text-primary)",
                  lineHeight: 1.65,
                  whiteSpace: "pre-wrap",
                }}
              >
                {msg.content}
                {msg.notesSearched && (
                  <div
                    style={{
                      marginTop: 8,
                      fontSize: 10,
                      color: "var(--text-muted)",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Brain size={9} />
                    Searched {msg.notesSearched} notes
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div
              style={{ display: "flex", gap: 12, alignItems: "flex-start" }}
              className="animate-fade-in"
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(167,139,250,0.1)",
                  border: "1px solid rgba(167,139,250,0.2)",
                }}
              >
                <Sparkles size={14} style={{ color: "var(--accent-2)" }} />
              </div>
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: "4px 12px 12px 12px",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  gap: 6,
                  alignItems: "center",
                }}
              >
                {[0, 1, 2].map((n) => (
                  <div
                    key={n}
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "var(--accent-2)",
                      animation: `glow-pulse 1.2s ease-in-out ${n * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}

      {/* Input */}
      <div
        style={{
          padding: "16px 0 0",
          borderTop: messages.length > 0 ? "1px solid var(--border)" : "none",
        }}
      >
        {messages.length > 0 && (
          <button
            onClick={() => setMessages([])}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 11,
              color: "var(--text-muted)",
              background: "none",
              border: "none",
              cursor: "pointer",
              marginBottom: 10,
            }}
          >
            <RotateCcw size={10} />
            New conversation
          </button>
        )}
        <div
          style={{
            display: "flex",
            gap: 10,
            background: "var(--bg-card)",
            border: "1px solid rgba(94,186,255,0.15)",
            borderRadius: 12,
            padding: "4px 4px 4px 14px",
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && !e.shiftKey && sendMessage(input)
            }
            placeholder="Ask anything about your knowledge base..."
            style={{
              flex: 1,
              background: "none",
              border: "none",
              outline: "none",
              fontSize: 14,
              color: "var(--text-primary)",
              padding: "8px 0",
            }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            style={{
              width: 38,
              height: 38,
              borderRadius: 8,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "linear-gradient(135deg, rgba(94,186,255,0.2), rgba(167,139,250,0.2))",
              border: "1px solid rgba(94,186,255,0.2)",
              cursor: loading || !input.trim() ? "not-allowed" : "pointer",
              color: "var(--accent)",
              opacity: loading || !input.trim() ? 0.5 : 1,
              transition: "all 0.15s",
            }}
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin-slow" />
            ) : (
              <Send size={15} />
            )}
          </button>
        </div>
        <p
          style={{
            fontSize: 11,
            color: "var(--text-muted)",
            marginTop: 8,
            textAlign: "center",
          }}
        >
          LLaMA 3.3 70B via Groq · Searches your full knowledge base · Press
          Enter to send
        </p>
      </div>
    </div>
  );
}
