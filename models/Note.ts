import mongoose, { Document, Schema, Model, Types } from "mongoose";

export type NoteType = "note" | "article" | "insight" | "idea";

export interface INote extends Document {
  _id: Types.ObjectId;
  title: string;
  content: string;
  url?: string;
  type: NoteType;
  tags: string[];
  aiSummary?: string;
  aiGenerated: boolean;
  pinned: boolean;
  embedding: [Number];
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema<INote>(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    url: { type: String, trim: true },
    type: {
      type: String,
      enum: ["note", "article", "insight", "idea"],
      default: "note",
    },
    tags: [{ type: String, lowercase: true, trim: true }],
    aiSummary: { type: String },
    aiGenerated: { type: Boolean, default: false },
    pinned: { type: Boolean, default: false },
    embedding: { type: [Number], default: [] },
  },
  {
    timestamps: true,
  },
);

NoteSchema.index({ title: "text", content: "text", tags: "text" });
NoteSchema.index({ createdAt: -1 });
NoteSchema.index({ tags: 1 });
NoteSchema.index({ type: 1 });

const Note: Model<INote> =
  mongoose.models.Note || mongoose.model<INote>("Note", NoteSchema);

export default Note;
