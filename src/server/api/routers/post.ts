import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { bookmarks, likes, posts, users } from '@/server/db/schema';
import { TRPCError } from '@trpc/server';
import { and, eq } from 'drizzle-orm';
import { getLinkPreview } from 'link-preview-js';
import pmap, { pMapSkip } from 'p-map';
import { z } from 'zod';
import type { Content } from '@tiptap/react';
import type { InferSelectModel } from 'drizzle-orm';
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

type Post = InferSelectModel<typeof posts>;

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
	search: protectedProcedure
		.input(z.object({ query: z.string() }))
		.query(async ({ input, ctx }) => {
			const index = ctx.meilisearch.index('posts');

			const results = await index.search(input.query, {
				filter: ['cloak = false'],
			});

			return results.hits as Post[];
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
			if (links.length === 0) return [];

			const previews = await pmap(
				links,
				async (link) => {
					try {
						return await getLinkPreview(link, {
							headers: { 'user-agent': 'Twitterbot' },
						});
					} catch {
						return pMapSkip;
					}
				},
				{ concurrency: links.length }
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

					console.log({ previews });

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
			const post = await ctx.db
				.insert(posts)
				.values({
					title: input.title,
					topic: input.topic,
					content: input.content,
					authorId: ctx.userId,
				})
				.returning();
			const index = ctx.meilisearch.index('posts');
			await index.addDocuments(post);

			return post[0];
		}),
	edit: protectedProcedure
		.input(
			z.object({
				id: z.number(),
				title: z.string(),
				topic: topicSchema,
				content: z.unknown(),
			})
		)
		.mutation(async ({ input, ctx }) => {
			const { id, ...rest } = input;

			const post = await ctx.db.query.posts.findFirst({
				where: eq(posts.id, input.id),
			});
			const user = await ctx.db.query.users.findFirst({
				where: eq(users.id, ctx.userId),
			});

			if (!post) {
				throw new TRPCError({ code: 'NOT_FOUND' });
			}
			if (!user?.admin && post.authorId !== ctx.userId) {
				throw new TRPCError({ code: 'UNAUTHORIZED' });
			}

			const newPost = await ctx.db
				.update(posts)
				.set({ ...rest })
				.where(eq(posts.id, id))
				.returning();

			const index = ctx.meilisearch.index('posts');
			await index.addDocuments(newPost);

			return newPost[0];
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
	complete: protectedProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ input, ctx }) => {
			const user = await ctx.db.query.users.findFirst({
				where: eq(users.id, ctx.userId),
			});
			const post = await ctx.db.query.posts.findFirst({
				where: eq(posts.id, input.id),
			});

			if (!post) {
				throw new TRPCError({ code: 'NOT_FOUND' });
			}

			if (!user?.admin && post.authorId !== ctx.userId) {
				throw new TRPCError({ code: 'UNAUTHORIZED' });
			}

			await ctx.db
				.update(posts)
				.set({ complete: true })
				.where(eq(posts.id, input.id));
		}),
	delete: protectedProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ input, ctx }) => {
			const user = await ctx.db.query.users.findFirst({
				where: eq(users.id, ctx.userId),
			});
			const post = await ctx.db.query.posts.findFirst({
				where: eq(posts.id, input.id),
			});

			if (!post) {
				throw new TRPCError({ code: 'NOT_FOUND' });
			}

			if (!user?.admin && post.authorId !== ctx.userId) {
				throw new TRPCError({ code: 'UNAUTHORIZED' });
			}

			const newPost = await ctx.db
				.update(posts)
				.set({ cloak: true })
				.where(eq(posts.id, input.id))
				.returning();

			const index = ctx.meilisearch.index('posts');
			await index.addDocuments(newPost);

			return newPost[0];
		}),
});
