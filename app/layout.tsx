import type { Metadata } from "next";
import "./globals.css";
import { SidebarLayout } from "@/components/layout/Sidebar";

export const metadata: Metadata = {
  title: "Second Brain — AI Knowledge System",
  description:
    "Capture, organize, and intelligently surface your knowledge with AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Epunda+Sans:ital,wght@0,300..900;1,300..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[var(--bg)] text-[var(--text-primary)] antialiased">
        {/*
         * SidebarLayout is a single client component that owns BOTH
         * the sidebar state AND the main content offset — so they
         * always animate in perfect sync from the same useState.
         */}
        <SidebarLayout>{children}</SidebarLayout>
      </body>
    </html>
  );
}
