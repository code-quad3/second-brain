"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Brain, Mail, Lock, User, Loader2, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed.");
        return;
      }

      router.push("/login?registered=1");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        padding: 20,
      }}
      className="dot-grid"
    >
      <div
        style={{
          position: "fixed",
          top: "20%",
          right: "30%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(167,139,250,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: "20%",
          left: "30%",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(94,186,255,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: 400,
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: "36px 32px",
          position: "relative",
          zIndex: 1,
        }}
        className="animate-fade-in"
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 13,
              margin: "0 auto 14px",
              background:
                "linear-gradient(135deg, rgba(167,139,250,0.15), rgba(94,186,255,0.15))",
              border: "1px solid rgba(167,139,250,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            className="animate-float"
          >
            <Brain size={22} style={{ color: "var(--accent-2)" }} />
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              marginBottom: 4,
            }}
          >
            Create your Brain
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
            Start building your knowledge system
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
          {/* Name */}
          <div>
            <label style={labelStyle}>Full Name</label>
            <div style={{ position: "relative" }}>
              <User
                size={14}
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                  pointerEvents: "none",
                }}
              />
              <input
                type="text"
                required
                placeholder="John Doe"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                style={{ ...inputStyle, paddingLeft: 36 }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "rgba(167,139,250,0.4)")
                }
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label style={labelStyle}>Email</label>
            <div style={{ position: "relative" }}>
              <Mail
                size={14}
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                  pointerEvents: "none",
                }}
              />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                style={{ ...inputStyle, paddingLeft: 36 }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "rgba(167,139,250,0.4)")
                }
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={labelStyle}>Password</label>
            <div style={{ position: "relative" }}>
              <Lock
                size={14}
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                  pointerEvents: "none",
                }}
              />
              <input
                type={showPw ? "text" : "password"}
                required
                minLength={8}
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={(e) =>
                  setForm((f) => ({ ...f, password: e.target.value }))
                }
                style={{ ...inputStyle, paddingLeft: 36, paddingRight: 40 }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "rgba(167,139,250,0.4)")
                }
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                  padding: 4,
                }}
              >
                {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {/* Password strength */}
            {form.password.length > 0 && (
              <div style={{ marginTop: 6, display: "flex", gap: 4 }}>
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    style={{
                      flex: 1,
                      height: 3,
                      borderRadius: 99,
                      background:
                        form.password.length >= n * 4
                          ? n === 1
                            ? "var(--danger)"
                            : n === 2
                              ? "var(--warning)"
                              : "var(--success)"
                          : "var(--border)",
                      transition: "background 0.2s",
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: "rgba(248,113,113,0.08)",
                border: "1px solid rgba(248,113,113,0.2)",
                color: "var(--danger)",
                fontSize: 13,
              }}
            >
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "11px",
              borderRadius: 9,
              background:
                "linear-gradient(135deg, rgba(167,139,250,0.2), rgba(94,186,255,0.2))",
              border: "1px solid rgba(167,139,250,0.3)",
              color: "var(--accent-2)",
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "var(--font-display)",
              cursor: loading ? "wait" : "pointer",
              opacity: loading ? 0.7 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              marginTop: 4,
              transition: "all 0.15s",
            }}
          >
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin-slow" /> Creating
                account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            fontSize: 13,
            color: "var(--text-muted)",
            marginTop: 24,
          }}
        >
          Already have an account?{" "}
          <Link
            href="/login"
            style={{
              color: "var(--accent)",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  fontWeight: 600,
  color: "var(--text-secondary)",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "var(--bg-input)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  padding: "10px 14px",
  fontSize: 14,
  color: "var(--text-primary)",
  outline: "none",
  transition: "border-color 0.15s",
};
