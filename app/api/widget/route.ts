import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Note from "@/models/Note";

// Public API endpoint - returns sanitized note data for external access
// Usage: GET /api/widget?tag=research&limit=5
// This powers embeddable widgets and external integrations

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const tag = searchParams.get("tag") || "";
    const type = searchParams.get("type") || "";
    const limit = Math.min(parseInt(searchParams.get("limit") || "6"), 20);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};
    if (tag) query.tags = tag;
    if (type) query.type = type;

    const notes = await Note.find(query)
      .sort({ pinned: -1, createdAt: -1 })
      .limit(limit)
      .select("title tags type aiSummary createdAt url")
      .lean();

    const total = await Note.countDocuments();
    const allTags = await Note.distinct("tags");

    return NextResponse.json(
      {
        notes: notes.map((n) => ({
          id: n._id,
          title: n.title,
          summary: n.aiSummary || null,
          tags: n.tags,
          type: n.type,
          url: n.url || null,
          createdAt: n.createdAt,
        })),
        meta: {
          total,
          returned: notes.length,
          allTags,
          generatedAt: new Date().toISOString(),
        },
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET",
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  } catch (err) {
    console.error("Widget API error:", err);
    return NextResponse.json({ error: "Service unavailable" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
