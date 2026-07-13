/**
 * AUTH FEATURE — PUBLIC API
 *
 * zkLogin / wallet / Enoki auth was removed in favour of single-user local mode
 * (see shared/lib/trpc/init.ts). `useAuth` is a static stub kept only so the
 * few UI consumers still compile.
 */

export { useAuth } from "./hook/use-auth";
