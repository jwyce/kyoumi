import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { z } from 'zod';

// import { posts } from "@/server/db/schema";

export const postRouter = createTRPCRouter({
	hello: protectedProcedure
		.input(z.object({ text: z.string() }))
		.query(({ input }) => {
			return {
				greeting: `Hello ${input.text}`,
			};
		}),

	// create: publicProcedure
	//   .input(z.object({ name: z.string().min(1) }))
	//   .mutation(async ({ ctx, input }) => {
	//     await ctx.db.insert(posts).values({
	//       name: input.name,
	//     });
	//   }),
	//
	// getLatest: publicProcedure.query(async ({ ctx }) => {
	//   const post = await ctx.db.query.posts.findFirst({
	//     orderBy: (posts, { desc }) => [desc(posts.createdAt)],
	//   });
	//
	//   return post ?? null;
	// }),
});
