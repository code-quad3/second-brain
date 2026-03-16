import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Note from "@/models/Note";
import { queryKnowledgeBase } from "@/lib/groq";

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();

    if (!question?.trim()) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    await connectDB();

    // Fetch up to 20 most recent notes as context
    const notes = await Note.find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .select("title content tags type aiSummary createdAt")
      .lean();

    if (notes.length === 0) {
      return NextResponse.json({
        answer:
          "Your knowledge base is empty. Start adding notes and I'll be able to answer questions about them!",
      });
    }

    const context = notes
      .map((n, i) => {
        const summary = n.aiSummary ? `\nSummary: ${n.aiSummary}` : "";
        const tags = n.tags?.length ? `\nTags: ${n.tags.join(", ")}` : "";
        return `[Note ${i + 1}] ${n.title} (${n.type})\n${n.content}${summary}${tags}`;
      })
      .join("\n\n---\n\n");

    const answer = await queryKnowledgeBase(question, context);

    return NextResponse.json({ answer, notesSearched: notes.length });
  } catch (err) {
    console.error("Query error:", err);
    return NextResponse.json({ error: "Failed to query knowledge base" }, { status: 500 });
  }
}
