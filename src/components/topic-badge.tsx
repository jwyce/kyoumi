import { titleCase } from 'string-ts';
import type { AppRouter } from '@/server/api/root';
import type { inferRouterOutputs } from '@trpc/server';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

type RouterOutput = inferRouterOutputs<AppRouter>;
type Post = RouterOutput['post']['getPosts']['data'][0];

interface TopicBadgeProps {
	topic: Post['topic'];
	className?: string;
}

const COLORS_BY_TOPIC = {
	fun: 'bg-topic-fun hover:bg-topic-fun/80',
	improvement: 'bg-topic-improvement hover:bg-topic-improvement/80',
	'brown-bag': 'bg-topic-brown-bag hover:bg-topic-brown-bag/80',
	'pain-point': 'bg-topic-pain-point hover:bg-topic-pain-point/80',
	'new-idea': 'bg-topic-new-idea hover:bg-topic-new-idea/80',
};

export function TopicBadge({ className, topic }: TopicBadgeProps) {
	return (
		<Badge
			className={cn(
				`duration-300 ${COLORS_BY_TOPIC[topic]} text-white dark:text-black`,
				className
			)}
		>
			{titleCase(topic)}
		</Badge>
	);
}
