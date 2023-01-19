import { createTRPCRouter } from './trpc'
import { exampleRouter } from './routers/example'
import { guestbookRouter } from './routers/guestbook'
import { draftsRouter } from './routers/drafts'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  guestbook: guestbookRouter,
  drafts: draftsRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
