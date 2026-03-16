"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Brain,
  BookOpen,
  Sparkles,
  FileText,
  Lightbulb,
  Link2,
  LayoutDashboard,
  Code2,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Telescope } from "lucide-react";
import { signOut } from "next-auth/react";

const SIDEBAR_WIDTH = 260;
const COLLAPSED_WIDTH = 80;

const navItems = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/capture", icon: FileText, label: "Capture" },
  { href: "/query", icon: Sparkles, label: "AI Query" },
  { href: "/docs", icon: Code2, label: "Docs & API" },
  { href: "/semantic", icon: Telescope, label: "Semantic" },
];

const typeItems = [
  { label: "Notes", icon: FileText, color: "text-blue-400" },
  { label: "Articles", icon: BookOpen, color: "text-purple-400" },
  { label: "Insights", icon: Lightbulb, color: "text-amber-400" },
  { label: "Ideas", icon: Link2, color: "text-emerald-400" },
];

// Pages where sidebar should NOT appear
const AUTH_PATHS = ["/login", "/register"];

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const isAuthPage = AUTH_PATHS.includes(pathname);

  // On login/register — render children only, no sidebar
  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[var(--bg-main)]">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col transition-all duration-300 ease-in-out border-r border-[var(--border)] bg-[var(--bg-card)]",
          isCollapsed ? "w-[80px]" : "w-[260px]",
        )}
      >
        {/* Header */}
        <div className="flex items-center h-20 px-4 mb-2">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex items-center justify-center shrink-0 w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-500 shadow-lg shadow-blue-500/20">
              <Brain size={22} className="text-white" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col leading-tight animate-in fade-in duration-500">
                <span className="font-bold text-lg tracking-tight text-[var(--text-primary)]">
                  Second Brain
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[var(--text-muted)]">
                  AI Knowledge
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {!isCollapsed && (
            <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-widest text-[var(--text-muted)] opacity-50">
              Main Menu
            </div>
          )}

          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center group transition-all duration-200 rounded-md mb-2.5",
                  isCollapsed
                    ? "justify-center h-12 w-12 mx-auto"
                    : "px-3 py-2.5 gap-3",
                  isActive
                    ? "bg-blue-500/10 text-blue-400"
                    : "text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)]",
                )}
              >
                <item.icon
                  size={20}
                  className={cn(
                    "shrink-0",
                    isActive
                      ? "text-blue-400"
                      : "group-hover:scale-110 transition-transform",
                  )}
                />
                {!isCollapsed && (
                  <span className="text-[18px] font-medium flex-1 mb-24">
                    {item.label}
                  </span>
                )}
                {!isCollapsed && isActive && (
                  <div className="w-1 h-4 rounded-full bg-blue-500" />
                )}
              </Link>
            );
          })}

          <div className="my-6 border-t border-[var(--border)]/50 mx-2" />

          {!isCollapsed && (
            <div className="px-3 mb-2 text-[15px] font-bold uppercase tracking-widest text-[var(--text-muted)] opacity-50">
              Resources
            </div>
          )}

          {typeItems.map((item) => (
            <Link
              key={item.label}
              href={`/?type=${item.label.toLowerCase()}`}
              className={cn(
                "flex items-center group transition-all duration-200 rounded-lg",
                isCollapsed
                  ? "justify-center h-12 w-12 mx-auto"
                  : "px-3 py-2.5 gap-3",
                "text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)]",
              )}
            >
              <item.icon
                size={20}
                className={cn("shrink-0 opacity-70", item.color)}
              />
              {!isCollapsed && (
                <span className="text-[18px] font-medium">{item.label}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* Bottom area — Sign Out + Collapse */}
        <div className="p-4 border-t border-[var(--border)]/50 flex flex-col gap-2">
          {/* Sign Out */}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className={cn(
              "flex items-center w-full rounded-lg border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10 transition-colors group",
              isCollapsed
                ? "justify-center h-10 w-12 mx-auto"
                : "px-3 py-2 gap-2",
            )}
          >
            <LogOut size={16} className="shrink-0" />
            {!isCollapsed && (
              <span className="text-xs font-semibold uppercase tracking-wider">
                Sign Out
              </span>
            )}
          </button>

          {/* Collapse toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center justify-center w-full h-10 rounded-lg bg-[var(--bg-main)] hover:bg-white/5 border border-[var(--border)] transition-colors group"
          >
            {isCollapsed ? (
              <PanelLeftOpen
                size={18}
                className="text-[var(--text-muted)] group-hover:text-blue-400"
              />
            ) : (
              <div className="flex items-center gap-2 text-[var(--text-muted)] group-hover:text-blue-400">
                <PanelLeftClose size={18} />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Collapse
                </span>
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className="flex-1 transition-all duration-300 ease-in-out"
        style={{ paddingLeft: isCollapsed ? COLLAPSED_WIDTH : SIDEBAR_WIDTH }}
      >
        <div className="max-w-6xl mx-auto px-6 py-10">{children}</div>
      </main>
    </div>
  );
}
