import { bookmarks, likes, posts } from '@/server/db/schema';
import { and, desc, eq, getTableColumns, lt, or, sql } from 'drizzle-orm';
import type { db as DB } from '@/server/db';
import { decodeCursor, encodeCursor } from './serdeCursor';

type Input = {
	db: typeof DB;
	cursor?: string;
	limit?: number;
};

export async function getPaginatedHotPosts({ db, cursor, limit = 10 }: Input) {
	const baseQuery = db
		.select({
			...getTableColumns(posts),
			likeCount: db.$count(likes, eq(likes.postId, posts.id)).as('like_count'),
		})
		.from(posts)
		.leftJoin(likes, eq(posts.id, likes.postId))
		.leftJoin(bookmarks, eq(posts.id, bookmarks.postId))
		.groupBy(posts.id)
		.orderBy(desc(sql`like_count`), desc(posts.createdAt))
		.limit(limit);

	if (cursor) {
		const [likeCount, createdAt] = decodeCursor(cursor) as [number, string];
		baseQuery.where(
			and(
				or(
					sql`like_count < ${likeCount}`,
					and(
						sql`like_count = ${likeCount}`,
						lt(posts.createdAt, new Date(createdAt))
					)
				)
			)
		);
	}

	const results = await baseQuery;

	const postsWithRelations = await Promise.all(
		results.map(async (post) => {
			const [likesData, bookmarksData] = await Promise.all([
				db.select().from(likes).where(eq(likes.postId, post.id)),
				db.select().from(bookmarks).where(eq(bookmarks.postId, post.id)),
			]);

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { likeCount, ...rest } = post;

			return {
				...rest,
				likes: likesData,
				bookmarks: bookmarksData,
			};
		})
	);

	const nextCursor =
		results.length > 0
			? encodeCursor([
					results[results.length - 1]?.likeCount,
					results[results.length - 1]?.createdAt.toISOString(),
				])
			: null;

	return {
		data: postsWithRelations,
		nextCursor,
	};
}

export async function getPaginatedNewPosts({ db, cursor, limit = 10 }: Input) {
	let whereCondition = undefined;
	if (cursor) {
		whereCondition = lt(posts.createdAt, new Date(cursor));
	}

	const baseQuery = db.query.posts.findMany({
		where: whereCondition,
		orderBy: desc(posts.createdAt),
		limit,
		with: {
			likes: true,
			bookmarks: true,
		},
	});

	const results = await baseQuery;

	const nextCursor =
		results.length > 0
			? encodeCursor(results[results.length - 1]?.createdAt.toISOString())
			: null;

	return {
		data: results,
		nextCursor,
	};
}
