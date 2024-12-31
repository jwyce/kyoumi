import type { posts } from '@/server/db/schema';
import type { InferSelectModel } from 'drizzle-orm';

type Topic = InferSelectModel<typeof posts>['topic'];

export const topicPromptMap: Record<Topic, string[]> = {
	fun: [
		"What's the next cool event—Advent of Code, hackathons, or something better?",
		'Suggest a tech conference or meetup we need to check out.',
		'What’s funnier than struggling to vertically center a div with CSS?',
		'Suggest a tech conference or meetup we need to check out.',
		'What’s a guild activity or team-building idea that’s too good to miss?',
	],
	improvement: [
		'How can we make our UI smoother than a CSS transition?',
		'What’s one tweak that could turn our workflow into a thing of beauty?',
		'Got a clever shortcut for writing cleaner, leaner code?',
	],
	'brown-bag': [
		'What front-end magic trick would you love to demo?',
		'Got 30 minutes and a passion project? Inspire us!',
		"What’s a topic you'd love to nerd out about?",
		'Share your ‘ah-ha!’ moment that could level us all up.',
	],
	'pain-point': [
		'What’s one bug—er, issue—that’s been bugging you?',
		'What’s slowing you down more than a Friday afternoon outage?',
		'Share your gripe. No judgment, only fixes (we hope)!',
	],
	'new-idea': [
		'What’s one wild idea that might just work?',
		'Got a feature request or the next big thing? Don’t hold back!',
		'Think outside the box, or heck, redesign the box entirely.',
	],
};

export const getRandomTopicPrompt = (topic?: Topic) => {
	if (!topic) return "What's up?";

	const prompts = topicPromptMap[topic];
	return prompts[Math.floor(Math.random() * prompts.length)];
};
