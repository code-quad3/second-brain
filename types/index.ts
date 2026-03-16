export type NoteType = "note" | "article" | "insight" | "idea";

export interface Note {
  _id: string;
  title: string;
  content: string;
  url?: string;
  type: NoteType;
  tags: string[];
  aiSummary?: string;
  aiGenerated: boolean;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotesResponse {
  notes: Note[];
  total: number;
  page: number;
  totalPages: number;
  allTags: string[];
}

export interface StatsResponse {
  total: number;
  withAI: number;
  byType: Record<NoteType, number>;
  topTags: { tag: string; count: number }[];
}

export type SortOption = "createdAt" | "title";

export interface FilterState {
  q: string;
  tag: string;
  type: string;
  sort: SortOption;
}
