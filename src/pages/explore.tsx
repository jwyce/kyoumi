import { useState } from 'react';
import Link from 'next/link';
import { Flame, Sparkles } from 'lucide-react';
import type { SelectOption } from '@/components/ui/combo-box';
import type { AppRouter } from '@/server/api/root';
import type { inferRouterOutputs } from '@trpc/server';
import { api } from '@/utils/api';
import { Combobox } from '@/components/ui/combo-box';
import { Loading } from '@/components/ui/loading';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { ExploreCard } from '@/components/explore-card';

type RouterOutput = inferRouterOutputs<AppRouter>;
type Post = RouterOutput['post']['getPosts']['data'][0];

export default function Explore() {
	const [sortBy, setSortBy] = useState<'hot' | 'new'>('new');
	const [topic, setTopic] = useState<Post['topic'] | 'all'>('all');
	const { data: me, isLoading: isMeLoading } = api.auth.me.useQuery();
	const { data: posts, isLoading } = api.post.getPosts.useQuery({
		topic,
		sortBy,
	});

	if (isLoading || isMeLoading) return <Loading />;

	if (!me || !posts || posts.data.length === 0)
		return <div>No posts found</div>;

	const filterOptions: SelectOption[] = [
		{
			value: 'all',
			label: 'All',
			addornment: <div className="rainbow-circle" />,
		},
		{
			value: 'fun',
			label: 'Fun',
			addornment: <div className="h-4 w-4 rounded-full bg-topic-fun" />,
		},
		{
			value: 'improvement',
			label: 'Improvement',
			addornment: <div className="h-4 w-4 rounded-full bg-topic-improvement" />,
		},
		{
			value: 'brown-bag',
			label: 'Brown Bag',
			addornment: <div className="h-4 w-4 rounded-full bg-topic-brown-bag" />,
		},
		{
			value: 'pain-point',
			label: 'Paint Point',
			addornment: <div className="h-4 w-4 rounded-full bg-topic-pain-point" />,
		},
		{
			value: 'new-idea',
			label: 'New Idea',
			addornment: <div className="h-4 w-4 rounded-full bg-topic-new-idea" />,
		},
	];

	return (
		<div className="mt-4 px-16">
			<div className="flex items-center justify-end gap-2 pb-4">
				<Combobox
					fieldValue={topic}
					onSelect={(v) => setTopic(v.value as Post['topic'] | 'all')}
					placeholder="Filter by topic"
					options={filterOptions}
				/>
				<Select value={sortBy} onValueChange={(v) => setSortBy(v)}>
					<SelectTrigger className="w-[180px]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel>Sort by</SelectLabel>
							<SelectItem value="new">
								<div className="flex items-center gap-2">
									<Sparkles className="h-4 w-4" /> New
								</div>
							</SelectItem>
							<SelectItem value="hot">
								<div className="flex items-center gap-2">
									<Flame className="h-4 w-4" /> Hot
								</div>
							</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>

			<div className="grid gap-8 xl:grid-cols-2 2xl:grid-cols-3">
				{posts.data.map((post) => (
					<Link key={post.slug} href={`/post/${post.slug}`} passHref>
						<ExploreCard post={post} me={me} />
					</Link>
				))}
			</div>
		</div>
	);
}
