import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Note from "@/models/Note";
import { generateEmbedding } from "@/lib/embeddings";

export async function POST(req: NextRequest) {
  await connectDB();
  const { query } = await req.json();

  const embedding = await generateEmbedding(query);

  const results = await Note.aggregate([
    {
      $vectorSearch: {
        index: "note_vector_index",
        path: "embedding",
        queryVector: embedding,
        numCandidates: 50,
        limit: 8,
      },
    },
    {
      $project: {
        title: 1,
        content: 1,
        type: 1,
        tags: 1,
        aiSummary: 1,
        score: { $meta: "vectorSearchScore" },
      },
    },
  ]);

  return NextResponse.json({ results });
}
