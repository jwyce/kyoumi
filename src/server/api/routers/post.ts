import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { bookmarks, likes, posts } from '@/server/db/schema';
import { and, eq } from 'drizzle-orm';
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
	like: protectedProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ input, ctx }) => {
			const like = await ctx.db.query.likes.findFirst({
				where: and(eq(likes.postId, input.id), eq(likes.authorId, ctx.userId)),
			});

			if (like) {
				await ctx.db
					.delete(likes)
					.where(
						and(eq(likes.postId, input.id), eq(likes.authorId, ctx.userId))
					);
			} else {
				await ctx.db.insert(likes).values({
					postId: input.id,
					authorId: ctx.userId,
				});
			}
		}),
	bookmark: protectedProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ input, ctx }) => {
			const bookmark = await ctx.db.query.bookmarks.findFirst({
				where: and(
					eq(bookmarks.postId, input.id),
					eq(bookmarks.authorId, ctx.userId)
				),
			});

			if (bookmark) {
				await ctx.db
					.delete(bookmarks)
					.where(
						and(
							eq(bookmarks.postId, input.id),
							eq(bookmarks.authorId, ctx.userId)
						)
					);
			} else {
				await ctx.db.insert(bookmarks).values({
					postId: input.id,
					authorId: ctx.userId,
				});
			}
		}),
});
