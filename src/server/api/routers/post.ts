import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { posts } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export const postRouter = createTRPCRouter({
	getPost: protectedProcedure
		.input(z.object({ slug: z.string() }))
		.query(async ({ input, ctx }) => {
			const post = await ctx.db.query.posts.findFirst({
				where: eq(posts.slug, input.slug),
				with: {
					likes: true,
					bookmarks: true,
				},
			});

			return post;
		}),
	getLatest: protectedProcedure.query(async ({ ctx }) => {
		const latest = await ctx.db.query.posts.findMany({
			orderBy: (posts, { desc }) => [desc(posts.createdAt)],
			with: {
				likes: true,
				bookmarks: true,
			},
		});

		return latest;
	}),
	create: protectedProcedure
		.input(
			z.object({
				title: z.string(),
				topic: z.enum([
					'pain-point',
					'brown-bag',
					'new-idea',
					'improvement',
					'fun',
				]),
				content: z.unknown(),
			})
		)
		.mutation(async ({ input, ctx }) => {
			const post = (
				await ctx.db
					.insert(posts)
					.values({
						title: input.title,
						topic: input.topic,
						content: input.content,
						authorId: ctx.userId,
					})
					.returning({ slug: posts.slug })
			)[0];

			return post;
		}),
});
