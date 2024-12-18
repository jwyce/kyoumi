import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { bookmarks, likes, posts } from '@/server/db/schema';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import {
	getPaginatedHotPosts,
	getPaginatedNewPosts,
} from '@/utils/paginatedPosts';

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
	getPosts: protectedProcedure
		.input(
			z.object({
				topic: z.enum([
					'all',
					'pain-point',
					'brown-bag',
					'new-idea',
					'improvement',
					'fun',
				]),
				cursor: z.string().optional(),
				limit: z.number().min(1).max(100).default(10),
				sortBy: z.enum(['new', 'hot']).default('new'),
			})
		)
		.query(async ({ input, ctx }) => {
			const { db } = ctx;
			const { cursor, limit, sortBy } = input;

			if (sortBy === 'hot') {
				console.log('HOT');
				return await getPaginatedHotPosts({ db, cursor, limit });
			}

				console.log('NEW');
			return await getPaginatedNewPosts({ db, cursor, limit });
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
