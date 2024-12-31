import { env } from '@/env';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { db } from '@/server/db';
import { users } from '@/server/db/schema';
import { TRPCError } from '@trpc/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { eq } from 'drizzle-orm';
import { serializeCookie } from 'oslo/cookie';
import { z } from 'zod';

// Create a new ratelimiter, that allows 3 requests per 1 minute
const ratelimit = new Ratelimit({
	redis: Redis.fromEnv(),
	limiter: Ratelimit.slidingWindow(3, '1 m'),
	analytics: true,
});

export const authRouter = createTRPCRouter({
	login: publicProcedure
		.input(z.object({ password: z.string() }))
		.mutation(async ({ input, ctx }) => {
			const forwarded = ctx.req.headers['x-forwarded-for'] as string;
			const ip = forwarded
				? forwarded.split(',')[0]!
				: ctx.req.socket.remoteAddress!;

			const { success } = await ratelimit.limit(ip);
			if (!success) throw new TRPCError({ code: 'TOO_MANY_REQUESTS' });

			if (input.password !== env.PASSWORD) {
				throw new TRPCError({
					code: 'UNAUTHORIZED',
					message: 'Invalid password',
				});
			}

			const user = (
				await db.insert(users).values({}).returning({ id: users.id })
			)[0];
			if (!user) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'something went wrong',
				});
			}

			const serialized = serializeCookie('device-id', user.id, {
				path: '/',
				httpOnly: true,
				secure: true,
				expires: new Date('9999-12-31T23:59:59.000Z'),
				maxAge: 60 * 60 * 24 * 365 * 100, // 100 years
				sameSite: 'lax',
			});

			ctx.res.setHeader('Set-Cookie', serialized);
			return user;
		}),

	me: publicProcedure.query(async ({ ctx }) => {
		const user = await ctx.db.query.users.findFirst({
			where: eq(users.id, ctx.userId ?? ''),
		});

		return user;
	}),
});
