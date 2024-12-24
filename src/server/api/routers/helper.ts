import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { getTweet } from 'react-tweet/api';
import { z } from 'zod';

export const helperRouter = createTRPCRouter({
	getTweet: protectedProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ input }) => {
			const tweet = await getTweet(input.id);
			return tweet;
		}),
});
