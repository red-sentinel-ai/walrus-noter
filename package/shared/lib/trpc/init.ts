import { initTRPC, TRPCError } from "@trpc/server";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import superjson from "superjson";
import { db } from "@/shared/lib/db";
import { users } from "@/shared/db/schema";

/**
 * Single-user local mode.
 *
 * zkLogin / wallet / Enoki auth has been removed. Every request runs as one
 * fixed local user, and all Walrus Memory operations use the shared delegate
 * key + account from the environment (MEMWAL_PRIVATE_KEY / MEMWAL_ACCOUNT_ID).
 */
const LOCAL_USER_ID = "00000000-0000-0000-0000-000000000001";

export type Context = {
  db: typeof db;
  userId: string | null;
  /** Walrus Memory delegate key (from env). */
  memwalKey: string | null;
  /** Walrus Memory account ID (from env). */
  memwalAccountId: string | null;
};

/** Ensure the single local user row exists (notes.userId FKs to it). Runs once per process. */
let ensureUserPromise: Promise<void> | null = null;
function ensureLocalUser() {
  if (!ensureUserPromise) {
    ensureUserPromise = db
      .insert(users)
      .values({
        id: LOCAL_USER_ID,
        suiAddress: "local-dev",
        authMethod: "enoki",
        name: "Local User"
      })
      .onConflictDoNothing({ target: users.id })
      .then(() => undefined)
      .catch((err) => {
        // Reset so a transient failure can retry on the next request.
        ensureUserPromise = null;
        throw err;
      });
  }
  return ensureUserPromise;
}

export const createContext = async (
  _opts: FetchCreateContextFnOptions
): Promise<Context> => {
  await ensureLocalUser();
  return {
    db,
    userId: LOCAL_USER_ID,
    memwalKey: process.env.MEMWAL_PRIVATE_KEY ?? null,
    memwalAccountId: process.env.MEMWAL_ACCOUNT_ID ?? null
  };
};

const t = initTRPC.context<Context>().create({
  transformer: superjson
});

export const router = t.router;
export const procedure = t.procedure;

/**
 * Protected procedure. In single-user local mode there is always a user, but
 * we keep the guard so route code stays unchanged.
 */
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Authentication required"
    });
  }

  return next({
    ctx: {
      ...ctx,
      userId: ctx.userId
    }
  });
});
