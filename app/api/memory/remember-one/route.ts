/**
 * Memory Remember One API — saves a single approved memory text to Walrus Memory.
 * Used by the memory panel's "Approve" flow (individual memory saves).
 * Single-user local mode: uses the shared env delegate key.
 * Returns { id, blob_id, owner, namespace } for blockchain data display.
 */

import { rememberText } from "@/feature/note/lib/pdw-client";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string") {
      return Response.json({ error: "text is required" }, { status: 400 });
    }

    if (text.trim().length < 10) {
      return Response.json({ error: "Text too short to remember" }, { status: 400 });
    }

    if (!process.env.MEMWAL_PRIVATE_KEY || !process.env.MEMWAL_ACCOUNT_ID) {
      return Response.json(
        { error: "[Walrus Memory] Not configured — set MEMWAL_PRIVATE_KEY and MEMWAL_ACCOUNT_ID in .env" },
        { status: 401 }
      );
    }

    const result = await rememberText(text);
    return Response.json(result);
  } catch (error) {
    console.error("[memory/remember-one] Error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
