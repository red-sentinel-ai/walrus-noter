/**
 * USE AUTH HOOK — single-user local mode.
 *
 * zkLogin / wallet / Enoki auth was removed. The app runs as one fixed local
 * user and Walrus Memory uses the shared env credentials on the server, so
 * there is nothing to authenticate on the client. This hook exists only to
 * keep existing consumers (`isAuthenticated`, `user`, `logout`, ...) compiling.
 */

"use client";

import type { User } from "@/shared/db/type";

const LOCAL_USER = {
  id: "00000000-0000-0000-0000-000000000001",
  suiAddress: "local-dev",
  authMethod: "enoki",
  name: "Local User"
} as unknown as User;

export function useAuth() {
  return {
    isAuthenticated: true,
    isLoading: false,
    user: LOCAL_USER,
    suiAddress: null as string | null,
    provider: null,
    session: null,
    logout: async () => {},
    isLoginPending: false,
    isLogoutPending: false
  };
}
