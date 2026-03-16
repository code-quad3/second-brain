import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Note from "@/models/Note";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const note = await Note.findById(id).lean();
    if (!note) return NextResponse.json({ error: "Note not found" }, { status: 404 });
    return NextResponse.json(note);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch note" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const note = await Note.findByIdAndUpdate(id, { $set: body }, { new: true }).lean();
    if (!note) return NextResponse.json({ error: "Note not found" }, { status: 404 });
    return NextResponse.json(note);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update note" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    await Note.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete note" }, { status: 500 });
  }
}
