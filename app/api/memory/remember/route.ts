/**
 * Memory Remember API — analyzes note text and extracts facts to Walrus Memory.
 * Single-user local mode: uses the shared env delegate key.
 */

import { extractMemories } from "@/feature/note/lib/pdw-client";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string") {
      return Response.json({ error: "text is required" }, { status: 400 });
    }

    if (text.trim().length < 10) {
      return Response.json({ error: "Text too short to analyze" }, { status: 400 });
    }

    if (!process.env.MEMWAL_PRIVATE_KEY || !process.env.MEMWAL_ACCOUNT_ID) {
      return Response.json({ facts: [], count: 0 });
    }

    const facts = await extractMemories("noter", text);
    return Response.json({ facts, count: facts.length });
  } catch (error) {
    console.error("[memory/remember] Error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
