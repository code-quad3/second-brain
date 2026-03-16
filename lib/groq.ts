import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const GROQ_MODEL = "llama-3.3-70b-versatile";

export async function summarizeContent(content: string): Promise<string> {
  const chat = await groq.chat.completions.create({
    model: GROQ_MODEL,
    messages: [
      {
        role: "system",
        content:
          "You are a knowledge assistant. Summarize the given note or content in 2-3 concise sentences. Focus on the core insight or key takeaway. Be precise and clear.",
      },
      { role: "user", content },
    ],
    max_tokens: 200,
    temperature: 0.4,
  });
  return chat.choices[0]?.message?.content?.trim() ?? "";
}

export async function generateTags(content: string, title: string): Promise<string[]> {
  const chat = await groq.chat.completions.create({
    model: GROQ_MODEL,
    messages: [
      {
        role: "system",
        content:
          'You are a knowledge categorization assistant. Generate 3-6 relevant tags for the given note. Return ONLY a JSON array of lowercase single-word or hyphenated tags like ["machine-learning","productivity","research"]. No explanation, just the JSON array.',
      },
      { role: "user", content: `Title: ${title}\n\nContent: ${content}` },
    ],
    max_tokens: 100,
    temperature: 0.3,
  });

  const raw = chat.choices[0]?.message?.content?.trim() ?? "[]";
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    const match = raw.match(/\[[\s\S]*?\]/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return [];
      }
    }
    return [];
  }
}

export async function queryKnowledgeBase(
  question: string,
  context: string
): Promise<string> {
  const chat = await groq.chat.completions.create({
    model: GROQ_MODEL,
    messages: [
      {
        role: "system",
        content: `You are an intelligent knowledge assistant. The user has a personal knowledge base. 
Answer their question based ONLY on the notes provided. 
If the answer isn't in the notes, say so clearly.
Be concise, insightful, and reference specific notes when relevant.
Format your response with markdown for readability.`,
      },
      {
        role: "user",
        content: `My Knowledge Base:\n\n${context}\n\n---\n\nQuestion: ${question}`,
      },
    ],
    max_tokens: 600,
    temperature: 0.5,
  });
  return chat.choices[0]?.message?.content?.trim() ?? "";
}

export default groq;
