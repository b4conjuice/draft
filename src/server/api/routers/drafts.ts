import { z } from 'zod'

import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc'

export const draftsRouter = createTRPCRouter({
  get: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.draft.findFirst({
          where: {
            id: input.id,
          },
        })
      } catch (error) {
        console.log(error)
      }
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.draft.findMany()
    } catch (error) {
      console.log(error)
    }
  }),
  save: protectedProcedure
    .input(
      z.object({
        id: z.string().nullish(),
        title: z.string().nullish(),
        items: z.array(z.string()),
        teams: z.array(z.string()),
        options: z.array(z.string()).nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.draft.upsert({
          where: {
            id: input.id ?? '',
          },
          update: {
            title: input.title ?? 'untitled',
            items: input.items,
            teams: input.teams,
            options: input.options ?? [],
          },
          create: {
            title: input.title ?? 'untitled',
            items: input.items,
            teams: input.teams,
            options: input.options ?? [],
          },
        })
      } catch (error) {
        console.log(error)
      }
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.draft.delete({
          where: {
            id: input.id,
          },
        })
      } catch (error) {
        console.log(error)
      }
    }),
})
