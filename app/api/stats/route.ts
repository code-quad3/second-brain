import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Note from "@/models/Note";

export async function GET() {
  try {
    await connectDB();

    const [total, withAI, byType, recentTags] = await Promise.all([
      Note.countDocuments(),
      Note.countDocuments({ aiGenerated: true }),
      Note.aggregate([{ $group: { _id: "$type", count: { $sum: 1 } } }]),
      Note.aggregate([
        { $unwind: "$tags" },
        { $group: { _id: "$tags", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
    ]);

    const typeMap = byType.reduce(
      (acc: Record<string, number>, item: { _id: string; count: number }) => {
        acc[item._id] = item.count;
        return acc;
      },
      {}
    );

    return NextResponse.json({
      total,
      withAI,
      byType: typeMap,
      topTags: recentTags.map((t: { _id: string; count: number }) => ({
        tag: t._id,
        count: t.count,
      })),
    });
  } catch (err) {
    console.error("Stats error:", err);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
