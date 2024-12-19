import { bookmarks, likes, posts } from '@/server/db/schema';
import { and, desc, eq, getTableColumns, gt, lt, or, sql } from 'drizzle-orm';
import type { db as DB } from '@/server/db';
import type { InferSelectModel } from 'drizzle-orm';
import { decodeCursor, encodeCursor } from './serdeCursor';

type Input = {
	db: typeof DB;
	userId: string;
	cursor?: string;
	limit?: number;
	topic: InferSelectModel<typeof posts>['topic'] | 'all';
	completed?: boolean;
	bookmarked?: boolean;
};

export async function getPaginatedHotPosts({
	db,
	userId,
	cursor,
	limit = 30,
	topic,
	completed,
	bookmarked,
}: Input) {
	let cursorClause = undefined;
	if (cursor) {
		const [likeCount, createdAt] = decodeCursor(cursor) as [number, string];
		cursorClause = or(
			sql`like_count < ${likeCount}`,
			and(
				sql`like_count = ${likeCount}`,
				lt(posts.createdAt, new Date(createdAt))
			)
		);
	}

	const baseQuery = db
		.select({
			...getTableColumns(posts),
			bookmarks: db
				.$count(bookmarks, eq(bookmarks.postId, posts.id))
				.as('bookmark_count'),
			bookmarkedByMe: db
				.$count(
					bookmarks,
					and(eq(bookmarks.postId, posts.id), eq(bookmarks.authorId, userId))
				)
				.as('bookmarked_by_me'),
			likes: db.$count(likes, eq(likes.postId, posts.id)).as('like_count'),
			likedByMe: db
				.$count(
					likes,
					and(eq(likes.postId, posts.id), eq(likes.authorId, userId))
				)

				.as('liked_by_me'),
		})
		.from(posts)
		.leftJoin(bookmarks, eq(posts.id, bookmarks.postId))
		.leftJoin(likes, eq(posts.id, likes.postId))
		.groupBy(posts.id)
		.orderBy(desc(sql`like_count`), desc(posts.createdAt))
		.limit(limit);

	baseQuery.where(
		and(
			cursorClause,
			topic !== 'all' ? eq(posts.topic, topic) : undefined,
			completed ? eq(posts.complete, true) : undefined,
			bookmarked ? sql`bookmarked_by_me = 1` : undefined
		)
	);

	const results = await baseQuery;
	const mapped = results.map((r) => {
		const { likedByMe, bookmarkedByMe, ...rest } = r;
		return {
			...rest,
			likedByMe: !!likedByMe,
			bookmarkedByMe: !!bookmarkedByMe,
		};
	});

	const nextCursor =
		results.length > 0
			? encodeCursor([
					results[results.length - 1]?.likes,
					results[results.length - 1]?.createdAt.toISOString(),
				])
			: null;

	return {
		data: mapped,
		nextCursor,
	};
}

export async function getPaginatedNewPosts({
	db,
	userId,
	cursor,
	limit = 30,
	topic,
	completed,
	bookmarked,
}: Input) {
	let whereCondition = undefined;
	if (cursor) {
		whereCondition = lt(posts.createdAt, new Date(cursor));
	}

	const baseQuery = db
		.select({
			...getTableColumns(posts),
			bookmarks: db
				.$count(bookmarks, eq(bookmarks.postId, posts.id))
				.as('bookmark_count'),
			bookmarkedByMe: db
				.$count(
					bookmarks,
					and(eq(bookmarks.postId, posts.id), eq(bookmarks.authorId, userId))
				)
				.as('bookmarked_by_me'),
			likes: db.$count(likes, eq(likes.postId, posts.id)).as('like_count'),
			likedByMe: db
				.$count(
					likes,
					and(eq(likes.postId, posts.id), eq(likes.authorId, userId))
				)
				.as('liked_by_me'),
		})
		.from(posts)
		.leftJoin(bookmarks, eq(posts.id, bookmarks.postId))
		.leftJoin(likes, eq(posts.id, likes.postId))
		.groupBy(posts.id)
		.orderBy(desc(posts.createdAt))
		.limit(limit);

	baseQuery.where(
		and(
			whereCondition,
			topic !== 'all' ? eq(posts.topic, topic) : undefined,
			completed ? eq(posts.complete, true) : undefined,
			bookmarked ? sql`bookmarked_by_me = 1` : undefined
		)
	);

	const results = await baseQuery;
	const mapped = results.map((r) => {
		const { likedByMe, bookmarkedByMe, ...rest } = r;
		return {
			...rest,
			likedByMe: !!likedByMe,
			bookmarkedByMe: !!bookmarkedByMe,
		};
	});

	const nextCursor =
		results.length > 0
			? encodeCursor(results[results.length - 1]?.createdAt.toISOString())
			: null;

	return {
		data: mapped,
		nextCursor,
	};
}
