import { getNotes } from '@/server/actions'
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'

export const draftRouter = createTRPCRouter({
  getAll: publicProcedure.query(async () => {
    const notes = await getNotes()

    return notes.filter(note => note.hasDraft)
  }),
})
