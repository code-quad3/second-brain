import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Note from "@/models/Note";
import { generateEmbedding } from "@/lib/embeddings";
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const tag = searchParams.get("tag") || "";
    const type = searchParams.get("type") || "";
    const sort = searchParams.get("sort") || "createdAt";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};
    if (q) query.$text = { $search: q };
    if (tag) query.tags = tag;
    if (type) query.type = type;

    const sortObj: Record<string, 1 | -1> = { pinned: -1 };
    if (sort === "createdAt") sortObj.createdAt = -1;
    else if (sort === "title") sortObj.title = 1;

    const [notes, total] = await Promise.all([
      Note.find(query).sort(sortObj).skip(skip).limit(limit).lean(),
      Note.countDocuments(query),
    ]);

    const allTags = await Note.distinct("tags");

    return NextResponse.json({
      notes,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      allTags,
    });
  } catch (err) {
    console.error("GET /api/notes error:", err);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { title, content, url, type, tags } = body;

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 },
      );
    }

    const note = await Note.create({
      title: title.trim(),
      content: content.trim(),
      url: url?.trim() || undefined,
      type: type || "note",
      tags: Array.isArray(tags) ? tags : [],
    });

    const embedding = await generateEmbedding(`${title} ${content}`);
    await Note.findByIdAndUpdate(note._id, { embedding });

    return NextResponse.json(note, { status: 201 });
  } catch (err) {
    console.error("POST /api/notes error:", err);
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 },
    );
  }
}
