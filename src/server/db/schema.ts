// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from 'drizzle-orm';
import { index, int, sqliteTableCreator, text } from 'drizzle-orm/sqlite-core';
import { humanId } from 'human-id';
import { v4 } from 'uuid';

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator((name) => `kyoumi_${name}`);

export const users = createTable('users', {
	id: text('id').primaryKey().$default(v4),
	admin: int('admin', { mode: 'boolean' }),
});

export const posts = createTable(
	'posts',
	{
		id: int('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
		slug: text('slug', { length: 30 }).$default(() =>
			humanId({ separator: '-', capitalize: false })
		),
		title: text('title', { length: 30 }).notNull(),
		content: text('content', { mode: 'json' }).notNull(),
		topic: text('topic', {
			enum: ['pain-point', 'brown-bag', 'new-idea', 'improvement', 'fun'],
		}).notNull(),
		complete: int('complete', { mode: 'boolean' }).default(false),
		cloak: int('cloak', { mode: 'boolean' }).default(false),
		authorId: text('author_id').notNull(),
		createdAt: int('created_at', { mode: 'timestamp' })
			.default(sql`(unixepoch())`)
			.notNull(),
		updatedAt: int('updated_at', { mode: 'timestamp' }).$onUpdate(
			() => new Date()
		),
	},
	(table) => {
		return {
			slugIdx: index('slug_idx').on(table.slug),
			titleIdx: index('title_idx').on(table.title),
		};
	}
);

export const likes = createTable('likes', {
	id: int('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	authorId: text('author_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	postId: int('post_id')
		.notNull()
		.references(() => posts.id, { onDelete: 'cascade' }),
});

export const bookmarks = createTable('bookmarks', {
	id: int('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	authorId: text('author_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	postId: int('post_id')
		.notNull()
		.references(() => posts.id, { onDelete: 'cascade' }),
});

export const usersRelations = relations(users, ({ many }) => ({
	posts: many(posts),
	likes: many(likes),
	bookmarks: many(bookmarks),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
	author: one(users, {
		fields: [posts.authorId],
		references: [users.id],
	}),
	likes: many(likes),
	bookmarks: many(bookmarks),
}));

export const likesRelations = relations(likes, ({ one }) => ({
	user: one(users, {
		fields: [likes.authorId],
		references: [users.id],
	}),
	post: one(posts, {
		fields: [likes.postId],
		references: [posts.id],
	}),
}));

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
	user: one(users, {
		fields: [bookmarks.authorId],
		references: [users.id],
	}),
	post: one(posts, {
		fields: [bookmarks.postId],
		references: [posts.id],
	}),
}));
