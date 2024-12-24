import { bookmarks, likes, posts } from '@/server/db/schema';
import { and, desc, eq, getTableColumns, lt, or, sql } from 'drizzle-orm';
import type { db as DB } from '@/server/db';
import type { InferSelectModel, SQL } from 'drizzle-orm';
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

const getPosts = async (
	{ db, limit = 30, userId, topic, completed, bookmarked }: Input,
	whereClause: Parameters<typeof and>[0],
	orderByClause: SQL[]
) => {
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
		.orderBy(...orderByClause)
		.limit(limit);

	baseQuery.where(
		and(
			whereClause,
			topic !== 'all' ? eq(posts.topic, topic) : undefined,
			completed !== undefined ? eq(posts.complete, completed) : undefined,
			bookmarked ? sql`bookmarked_by_me = 1` : undefined,
			eq(posts.cloak, false)
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

	return mapped;
};

export async function getPaginatedHotPosts(input: Input) {
	let cursorClause = undefined;
	if (input.cursor) {
		const [likeCount, createdAt] = decodeCursor(input.cursor) as [
			number,
			string,
		];
		cursorClause = or(
			sql`like_count < ${likeCount}`,
			and(
				sql`like_count = ${likeCount}`,
				lt(posts.createdAt, new Date(createdAt))
			)
		);
	}

	const results = await getPosts(input, cursorClause, [
		desc(sql`like_count`),
		desc(posts.createdAt),
	]);

	const nextCursor =
		results.length > 0
			? encodeCursor([
					results[results.length - 1]?.likes,
					results[results.length - 1]?.createdAt.toISOString(),
				])
			: null;

	return {
		data: results,
		nextCursor,
	};
}

export async function getPaginatedNewPosts(input: Input) {
	let whereCondition = undefined;
	if (input.cursor) {
		const createdAt = decodeCursor(input.cursor) as string;
		whereCondition = lt(posts.createdAt, new Date(createdAt));
	}

	const results = await getPosts(input, whereCondition, [
		desc(posts.createdAt),
	]);

	const nextCursor =
		results.length > 0
			? encodeCursor(results[results.length - 1]?.createdAt.toISOString())
			: null;

	return {
		data: results,
		nextCursor,
	};
}
