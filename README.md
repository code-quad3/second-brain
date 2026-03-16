# 🧠 Second Brain — AI Knowledge Management System

A sophisticated, production-ready **Second Brain** application that captures, organizes, and intelligently surfaces knowledge using AI. Built with Next.js 15, Groq (LLaMA 3.3 70B), MongoDB Atlas, and NextAuth v5.

---

## ✨ Features

| Feature | Description |
|---|---|
| **Auth** | Email/password login & registration with NextAuth v5 + bcrypt |
| **Capture** | Rich form for notes, articles, insights & ideas with flexible tagging |
| **Dashboard** | Search, filter by type/tag, sort, paginate — responsive card grid |
| **AI Summarize** | One-click Groq-powered summaries stored back to MongoDB |
| **AI Auto-tag** | LLaMA 3.3 generates 3–6 semantic tags from note content |
| **AI Query** | Conversational interface — ask anything about your knowledge base |
| **Semantic Search** | Vector search via MongoDB Atlas + Voyage AI embeddings |
| **Public API** | `/api/widget` — CORS-enabled, cacheable feed for external embedding |
| **Stats Bar** | Live counts by type, AI-enhanced notes, top tags |
| **Docs Page** | `/docs` — architecture, API reference, deployment guide |

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone <your-repo>
cd second-brain
npm install
```

### 2. Configure Environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/second-brain?retryWrites=true&w=majority

# Groq — LLaMA 3.3 70B
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx

# Voyage AI — embeddings for semantic search
VOYAGE_API_KEY=pa-xxxxxxxxxxxxxxxxxxxx

# NextAuth — generate with: openssl rand -base64 32
AUTH_SECRET=xxxxxxxxxxxxxxxxxxxx

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Get your keys:**
- **MongoDB Atlas**: [cloud.mongodb.com](https://cloud.mongodb.com) → Free M0 cluster → Connect → Drivers
- **Groq**: [console.groq.com/keys](https://console.groq.com/keys) → free 14,400 req/day
- **Voyage AI**: [dash.voyageai.com](https://dash.voyageai.com) → free 50M tokens/month
- **AUTH_SECRET**: run `openssl rand -base64 32` in terminal

### 3. Run Locally

```bash
npm run dev
# → http://localhost:3000
```

### 4. Deploy to Vercel

```bash
npm i -g vercel && vercel deploy
```

Add all env vars in **Vercel Dashboard → Settings → Environment Variables**.

---

## 📁 Project Structure

```
second-brain/
├── auth.ts                       # NextAuth v5 config (Credentials provider)
├── middleware.ts                 # Route protection via getToken (Edge-compatible)
├── app/
│   ├── page.tsx                  # Dashboard
│   ├── login/page.tsx            # Login page
│   ├── register/page.tsx         # Register page with password strength meter
│   ├── capture/page.tsx          # Note capture form
│   ├── query/page.tsx            # AI chat interface
│   ├── semantic/page.tsx         # Semantic / vector search
│   ├── docs/page.tsx             # Architecture docs & API reference
│   ├── globals.css               # Design system + CSS variables
│   └── api/
│       ├── auth/
│       │   ├── [...nextauth]/    # NextAuth handler (GET + POST)
│       │   └── register/         # User registration endpoint
│       ├── notes/                # CRUD — GET, POST
│       ├── notes/[id]/           # PATCH, DELETE, GET single
│       ├── notes/semantic/       # POST — vector search endpoint
│       ├── ai/summarize/         # Groq summarization
│       ├── ai/autotag/           # Groq tag generation
│       ├── ai/query/             # Conversational knowledge query
│       ├── widget/               # Public API (CORS + cached)
│       └── stats/                # Dashboard statistics
├── components/
│   ├── layout/
│   │   ├── SidebarLayout.tsx     # Sidebar + layout wrapper (hidden on auth pages)
│   │   ├── AppShell.tsx          # Ambient background wrapper
│   │   └── Header.tsx            # Top bar with search
│   ├── notes/
│   │   ├── NoteCard.tsx          # Card with pin/delete/summarize
│   │   ├── NoteForm.tsx          # Rich capture form
│   │   ├── NotesGrid.tsx         # Filtered, paginated grid
│   │   ├── FilterBar.tsx         # Type/tag/sort controls
│   │   ├── StatsBar.tsx          # 6-metric stats row
│   │   └── SemanticSearch.tsx    # Vector search UI with similarity scores
│   └── ai/
│       └── AIQueryInterface.tsx  # Chat UI for knowledge queries
├── models/
│   ├── Note.ts                   # Mongoose schema + text + vector indexes
│   └── User.ts                   # Mongoose user schema (email, password, name)
├── lib/
│   ├── mongodb.ts                # Singleton DB connection
│   ├── groq.ts                   # AI: summarize, autotag, query
│   ├── embeddings.ts             # Voyage AI embeddings via fetch (no SDK)
│   └── utils.ts                  # cn(), truncate(), formatRelative()
└── types/
    └── index.ts                  # Shared TypeScript interfaces
```

---

## 🔐 Authentication

NextAuth v5 with Credentials provider. All routes except `/login`, `/register`, `/api/auth/*`, and `/api/widget` are protected by middleware.

```
POST /api/auth/register   # Create account { name, email, password }
POST /api/auth/signin     # NextAuth sign in
GET  /api/auth/session    # Current session
POST /api/auth/signout    # Sign out → redirects to /login
```

Passwords are hashed with **bcrypt (12 rounds)**. Sessions use **JWT strategy** — no database session storage needed.

---

## 🔍 Semantic Search

Vector search powered by **MongoDB Atlas Vector Search** + **Voyage AI** embeddings (`voyage-3-lite`, 512 dimensions).

### How it works
1. When a note is saved → `generateEmbedding(title + content)` calls Voyage AI API
2. 512-dimension vector stored in `note.embedding` field in MongoDB
3. On search → query is embedded → `$vectorSearch` aggregation finds cosine-similar notes
4. Results returned with a `score` (0–1) indicating similarity

### Atlas Vector Search Index

Create in **Atlas UI → Search → Create Index → Atlas Vector Search**:

```json
{
  "fields": [
    {
      "type": "vector",
      "path": "embedding",
      "numDimensions": 512,
      "similarity": "cosine"
    }
  ]
}
```

Name it `note_vector_index`.

---

## 🔌 API Reference

### Notes

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/notes` | List notes. Query: `q`, `tag`, `type`, `sort`, `page`, `limit` |
| `POST` | `/api/notes` | Create note. Body: `{ title, content, url?, type, tags[] }` |
| `GET` | `/api/notes/:id` | Get single note |
| `PATCH` | `/api/notes/:id` | Update note fields |
| `DELETE` | `/api/notes/:id` | Delete note |
| `POST` | `/api/notes/semantic` | Vector search. Body: `{ query }` → `{ results[] }` |

### AI

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/ai/summarize` | Body: `{ noteId?, content }` → `{ summary }` |
| `POST` | `/api/ai/autotag` | Body: `{ noteId?, title, content }` → `{ tags[] }` |
| `POST` | `/api/ai/query` | Body: `{ question }` → `{ answer, notesSearched }` |

### Infrastructure

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/widget` | Public API. Query: `tag?`, `type?`, `limit?`. CORS + cached |
| `GET` | `/api/stats` | Returns `{ total, withAI, byType, topTags }` |

---

## 🛠 Tech Stack

| Technology | Role |
|---|---|
| Next.js 15 (App Router) | Framework — pages + API routes |
| React 19 | UI — server + client components |
| Tailwind CSS 4 | Styling + CSS custom properties |
| NextAuth v5 | Authentication — JWT sessions |
| bcryptjs | Password hashing (12 rounds) |
| Groq SDK (LLaMA 3.3 70B) | AI — summarize, autotag, query |
| Voyage AI (voyage-3-lite) | Embeddings for semantic search |
| MongoDB Atlas | Database + vector search index |
| Mongoose 9 | ODM — schema + model layer |
| TypeScript 5 | Full type safety |
| Vercel | Deployment — edge + serverless |
