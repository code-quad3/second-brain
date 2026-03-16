import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Note from "@/models/Note";
import { summarizeContent } from "@/lib/groq";

export async function POST(req: NextRequest) {
  try {
    const { noteId, content } = await req.json();

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const summary = await summarizeContent(content);

    if (noteId) {
      await connectDB();
      await Note.findByIdAndUpdate(noteId, {
        $set: { aiSummary: summary, aiGenerated: true },
      });
    }

    return NextResponse.json({ summary });
  } catch (err) {
    console.error("Summarize error:", err);
    return NextResponse.json({ error: "Failed to summarize" }, { status: 500 });
  }
}
