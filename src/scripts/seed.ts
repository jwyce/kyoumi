import { db } from '@/server/db';
import { bookmarks, likes, posts, users } from '@/server/db/schema';
import { faker } from '@faker-js/faker';

function generateTiptapContent(): object {
	return {
		type: 'doc',
		content: [
			{
				type: 'heading',
				attrs: { level: 2 },
				content: [{ type: 'text', text: faker.lorem.sentence() }],
			},
			{
				type: 'paragraph',
				content: [{ type: 'text', text: faker.lorem.paragraph() }],
			},
			{
				type: 'bulletList',
				content: Array.from({ length: 3 }, () => ({
					type: 'listItem',
					content: [
						{
							type: 'paragraph',
							content: [{ type: 'text', text: faker.lorem.sentence() }],
						},
					],
				})),
			},
		],
	};
}

async function generateData() {
	const seedUsers = Array.from({ length: 20 }, () => ({}));

	const userIds = await db
		.insert(users)
		.values(seedUsers)
		.returning({ id: users.id });

	const seedPosts = Array.from({ length: 100 }, () => ({
		title: faker.lorem.sentence(),
		content: generateTiptapContent(),
		topic: faker.helpers.arrayElement([
			'pain-point',
			'brown-bag',
			'new-idea',
			'improvement',
			'fun',
		]),
		complete: faker.datatype.boolean(),
		authorId: faker.helpers.arrayElement(userIds).id,
	}));

	const postIds = await db
		.insert(posts)
		.values(seedPosts)
		.returning({ id: posts.id });

	const seedLikes = Array.from({ length: 400 }, () => ({
		postId: faker.helpers.arrayElement(postIds).id,
		authorId: faker.helpers.arrayElement(userIds).id,
	}));

	await db.insert(likes).values(seedLikes);

	const seedBookmarks = Array.from({ length: 100 }, () => ({
		postId: faker.helpers.arrayElement(postIds).id,
		authorId: faker.helpers.arrayElement(userIds).id,
	}));

	await db.insert(bookmarks).values(seedBookmarks);
}

async function seed() {
	console.log('Seeding started...');
	await generateData();
	console.log('Seeding finished!');
}

seed().catch((error) => {
	console.error('Error during seeding:', error);
	process.exit(1);
});
