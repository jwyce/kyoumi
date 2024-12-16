import { env } from "@/env"
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import { db } from "@/server/db"
import { users } from "@/server/db/schema"
import { TRPCError } from "@trpc/server"
import { serializeCookie } from "oslo/cookie"
import { z } from "zod"

export const authRouter = createTRPCRouter({
  login: publicProcedure
    .input(z.object({ password: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (input.password !== env.PASSWORD) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Invalid password",
        })
      }

      const user = (
        await db.insert(users).values({}).returning({ id: users.id })
      )[0]
      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "something went wrong",
        })
      }

      const serialized = serializeCookie("device-id", user.id, {
        path: "/",
        httpOnly: true,
        secure: true,
        expires: new Date("9999-12-31T23:59:59.000Z"),
        maxAge: 60 * 60 * 24 * 365 * 100, // 100 years
        sameSite: "lax",
      })

      ctx.res.setHeader("Set-Cookie", serialized)
      return user
    }),

  me: publicProcedure.query(async ({ ctx }) => {
    return ctx.userId
  }),
})
