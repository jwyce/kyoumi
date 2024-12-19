import {
	CheckCircle,
	Circle,
	Diamond,
	Plus,
	Sparkle,
	Triangle,
} from 'lucide-react';
import type { AppRouter } from '@/server/api/root';
import type { Content } from '@tiptap/react';
import type { inferRouterOutputs } from '@trpc/server';
import { getRelativeTimeStrict } from '@/utils/relativeTime';
import { cn } from '@/lib/utils';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { MinimalTiptapEditor } from '@/components/minimal-tiptap/';
import { BookmarkButton } from './post/bookmark-button';
import { LikeButton } from './post/like-button';
import { MoreActionsButton } from './post/more-actions-button';
import { ShareButton } from './post/share-button';
import { TopicBadge } from './topic-badge';

type RouterOutput = inferRouterOutputs<AppRouter>;
type Post = RouterOutput['post']['getPosts']['data'][0];
type Me = Exclude<RouterOutput['auth']['me'], undefined>;

export const BORDERS_BY_TOPIC = {
	fun: 'hover:border-topic-fun group-focus:border-topic-fun hover:shadow-fun group-focus:shadow-fun',
	improvement:
		'hover:border-topic-improvement group-focus:border-topic-improvement hover:shadow-improvement group-focus:shadow-improvement',
	'brown-bag':
		'hover:border-topic-brown-bag group-focus:border-topic-brown-bag hover:shadow-brown-bag group-focus:shadow-brown-bag',
	'pain-point':
		'hover:border-topic-pain-point group-focus:border-topic-pain-point hover:shadow-pain-point group-focus:shadow-pain-point',
	'new-idea':
		'hover:border-topic-new-idea group-focus:border-topic-new-idea hover:shadow-new-idea group-focus:shadow-new-idea',
};

export function TopicIcon({ topic }: { topic: Post['topic'] }) {
	switch (topic) {
		case 'fun':
			return (
				<>
					<Circle className="absolute -right-4 -top-8 h-24 w-24 origin-top-right stroke-[0.5] text-black/10 duration-300 group-hover/card:scale-90 group-hover/card:text-topic-fun dark:text-white/10" />
					<Circle className="absolute -right-4 -top-8 h-32 w-32 origin-top-right stroke-[0.4] text-black/10 duration-500 group-hover/card:scale-90 group-hover/card:text-topic-fun dark:text-white/10" />
				</>
			);
		case 'improvement':
			return (
				<>
					<Diamond className="absolute -right-5 -top-10 h-24 w-24 origin-top-right stroke-[0.66] text-black/10 duration-300 group-hover/card:rotate-6 group-hover/card:scale-90 group-hover/card:text-topic-improvement dark:text-white/10" />
					<Diamond className="absolute -right-6 -top-12 h-36 w-36 rotate-12 stroke-[0.44] text-black/10 duration-500 group-hover/card:-translate-y-2 group-hover/card:translate-x-3 group-hover/card:rotate-6 group-hover/card:scale-90 group-hover/card:text-topic-improvement dark:text-white/10" />
				</>
			);
		case 'brown-bag':
			return (
				<>
					<Triangle className="absolute -right-5 -top-5 h-16 w-16 rotate-0 stroke-[0.75] text-black/10 duration-500 group-hover/card:-translate-x-10 group-hover/card:translate-y-10 group-hover/card:rotate-[90deg] group-hover/card:text-topic-brown-bag dark:text-white/10" />
					<Triangle className="absolute -right-14 -top-16 h-36 w-36 rotate-12 stroke-[0.4] text-black/10 duration-300 group-hover/card:translate-x-3 group-hover/card:rotate-[30deg] group-hover/card:scale-50 group-hover/card:stroke-[0.66] group-hover/card:text-topic-brown-bag dark:text-white/10" />
				</>
			);
		case 'pain-point':
			return (
				<>
					<Plus className="absolute -right-4 -top-8 h-24 w-24 stroke-[0.5] text-black/10 duration-300 group-hover/card:scale-0 group-hover/card:text-topic-pain-point dark:text-white/10" />
					<Plus className="absolute -right-4 -top-8 h-32 w-32 stroke-[0.5] text-black/10 duration-500 group-hover/card:-translate-y-5 group-hover/card:translate-x-9 group-hover/card:-rotate-90 group-hover/card:scale-75 group-hover/card:text-topic-pain-point dark:text-white/10" />
				</>
			);
		case 'new-idea':
			return (
				<>
					<Sparkle className="absolute -right-4 -top-10 h-24 w-24 stroke-[0.5] text-black/10 duration-500 group-hover/card:-translate-x-4 group-hover/card:translate-y-10 group-hover/card:-rotate-[125deg] group-hover/card:text-topic-new-idea dark:text-white/10" />
					<Sparkle className="absolute -right-14 -top-24 h-48 w-48 origin-top-right -rotate-3 stroke-[0.33] text-black/10 duration-300 group-hover/card:scale-50 group-hover/card:text-topic-new-idea dark:text-white/10" />
				</>
			);
		default:
			return null;
	}
}

export interface ExploreCardProps {
	post: Post;
	me: Me;
}
export function ExploreCard({
	post,
	me,
	className,
}: ExploreCardProps & { className?: string }) {
	const content = post.content as Content;
	const mine = post.authorId === me.id || !!me.admin;

	return (
		<Card
			className={cn(
				`group/card relative overflow-hidden bg-background duration-300 hover:bg-card-hovered sm:min-w-[420px] xl:min-w-[450px] ${BORDERS_BY_TOPIC[post.topic]}`,
				className
			)}
		>
			<TopicIcon topic={post.topic} />
			<CardHeader className="relative flex flex-col items-start gap-1 pb-0 pt-5">
				<CardTitle className="max-w-[75%] truncate text-2xl duration-300">
					{post.title}
				</CardTitle>
				<div className="flex flex-col gap-1">
					<div className="flex items-center gap-5 text-center duration-300">
						<TopicBadge topic={post.topic} />
						{post.complete && (
							<CheckCircle
								className="stroke-green-600 dark:stroke-green-300"
								size={18}
							/>
						)}
						<BookmarkButton post={post} />
						<LikeButton post={post} />
						<ShareButton post={post} />
						{mine && <MoreActionsButton />}
					</div>
					<div className="whitespace-nowrap text-sm text-muted-foreground">
						{getRelativeTimeStrict(post.createdAt)}
					</div>
				</div>
			</CardHeader>
			<CardContent className="relative flex flex-col justify-between gap-2 rounded-xl p-6 pb-0 pt-0 duration-300">
				<CardDescription className="tiptap-readonly relative h-44 pb-4 leading-[1.425rem]">
					<div className="pointer-events-none absolute inset-0 z-10 h-full w-full shadow-[inset_0_-1.5rem_1rem_-0.5rem_hsl(var(--card))] duration-300 group-hover/card:shadow-[inset_0_-1.5rem_1rem_-0.5rem_hsl(var(--card-hovered))] group-focus:shadow-[inset_0_-1.5rem_1rem_-0.5rem_hsl(var(--card-hovered))]" />
					<MinimalTiptapEditor
						value={content}
						className="w-full"
						editorContentClassName="p-5"
						output="json"
						placeholder="What's up?"
						autofocus={false}
						editable={false}
						editorClassName="focus:outline-none"
					/>
				</CardDescription>
			</CardContent>
		</Card>
	);
}
