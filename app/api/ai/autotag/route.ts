import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Note from "@/models/Note";
import { generateTags } from "@/lib/groq";

export async function POST(req: NextRequest) {
  try {
    const { noteId, title, content } = await req.json();

    if (!content || !title) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    const tags = await generateTags(content, title);

    if (noteId) {
      await connectDB();
      await Note.findByIdAndUpdate(noteId, {
        $set: { tags, aiGenerated: true },
      });
    }

    return NextResponse.json({ tags });
  } catch (err) {
    console.error("Autotag error:", err);
    return NextResponse.json({ error: "Failed to generate tags" }, { status: 500 });
  }
}
