export async function generateEmbedding(text: string): Promise<number[]> {
  const res = await fetch("https://api.voyageai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.VOYAGE_API_KEY}`,
    },
    body: JSON.stringify({
      input: text,
      model: "voyage-3-lite",
    }),
  });

  if (!res.ok) {
    throw new Error(`Voyage API error: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  return data.data[0].embedding;
}
