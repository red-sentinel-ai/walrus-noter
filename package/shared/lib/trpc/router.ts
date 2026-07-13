import { router } from "./init";
import { noteRouter } from "@/feature/note/api/route";

export const appRouter = router({
  note: noteRouter
});

export type AppRouter = typeof appRouter;
