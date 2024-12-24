import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { bookmarks, likes, posts } from '@/server/db/schema';
import { TRPCError } from '@trpc/server';
import { and, eq } from 'drizzle-orm';
import { getLinkPreview } from 'link-preview-js';
import { z } from 'zod';
import type { Content } from '@tiptap/react';
import { extractTiptapLinks } from '@/utils/extractTiptapLinks';
import {
	getPaginatedHotPosts,
	getPaginatedNewPosts,
} from '@/utils/paginatedPosts';

const topicSchema = z.enum([
	'pain-point',
	'brown-bag',
	'new-idea',
	'improvement',
	'fun',
]);

export const postRouter = createTRPCRouter({
	getPost: protectedProcedure
		.input(z.object({ slug: z.string() }))
		.query(async ({ input, ctx }) => {
			const post = await ctx.db.query.posts.findFirst({
				where: and(eq(posts.slug, input.slug), eq(posts.cloak, false)),
				with: {
					likes: true,
					bookmarks: true,
				},
			});

			if (!post) {
				throw new TRPCError({ code: 'NOT_FOUND', message: 'Post not found' });
			}

			const { likes, bookmarks, ...rest } = post;

			return {
				...rest,
				likes: likes.length,
				bookmarks: bookmarks.length,
				likedByMe: !!likes.find((l) => l.authorId === ctx.userId),
				bookmarkedByMe: !!bookmarks.find((l) => l.authorId === ctx.userId),
			};
		}),
	getPosts: protectedProcedure
		.input(
			z.object({
				topic: topicSchema.or(z.enum(['all'])),
				completed: z.boolean().default(false),
				bookmarked: z.boolean().default(false),
				cursor: z.string().optional(),
				limit: z.number().min(1).max(100).default(30),
				sortBy: z.enum(['new', 'hot']).default('new'),
			})
		)
		.query(async ({ input, ctx }) => {
			const { db, userId } = ctx;

			if (input.sortBy === 'hot') {
				return await getPaginatedHotPosts({ db, userId, ...input });
			}

			return await getPaginatedNewPosts({ db, userId, ...input });
		}),
	getLinkPreviews: protectedProcedure
		.input(z.object({ slug: z.string() }))
		.query(async ({ input, ctx }) => {
			const post = await ctx.db.query.posts.findFirst({
				where: eq(posts.slug, input.slug),
			});

			if (!post) {
				throw new TRPCError({ code: 'NOT_FOUND' });
			}

			const links = extractTiptapLinks(post.content as Content);

			const previews = await Promise.all(
				links.map(async (link) => await getLinkPreview(link))
			);

			return previews
				.filter((p) => p.contentType === 'text/html')
				.map((p) => {
					const { title, images, favicons, siteName, ...rest } =
						p as unknown as {
							url: string;
							title: string;
							description: string;
							siteName: string;
							images: string[];
							favicons: string[];
						};

					const newTitle = title.replace(/\s[\-\/|>]+\s.*$/, '').trim();

					return {
						...rest,
						siteName: siteName ?? newTitle,
						title: newTitle,
						image: images.at(0),
						favicon: favicons.at(0),
					};
				});
		}),
	create: protectedProcedure
		.input(
			z.object({
				title: z.string(),
				topic: topicSchema,
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
