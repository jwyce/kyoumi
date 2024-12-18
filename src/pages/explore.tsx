import { useState } from 'react';
import Link from 'next/link';
import { Flame, Sparkles } from 'lucide-react';
import type { AppRouter } from '@/server/api/root';
import type { inferRouterOutputs } from '@trpc/server';
import { api } from '@/utils/api';
import { topicFilterOptions } from '@/lib/topicFilterOptions';
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
	const [sortBy, setSortBy] = useState<'hot' | 'new'>('hot');
	const [topic, setTopic] = useState<Post['topic'] | 'all'>('all');
	const { data: me, isLoading: isMeLoading } = api.auth.me.useQuery();
	const { data: posts, isLoading } = api.post.getPosts.useQuery({
		topic,
		sortBy,
	});

	if (isLoading || isMeLoading) return <Loading />;

	if (!me || !posts || posts.data.length === 0)
		return <div>No posts found</div>;

	return (
		<div className="mt-4 px-16">
			<div className="flex items-center justify-end gap-2 pb-4">
				<Combobox
					fieldValue={topic}
					onSelect={(v) => setTopic(v.value as Post['topic'] | 'all')}
					placeholder="Filter by topic"
					options={topicFilterOptions}
				/>
				<Select
					value={sortBy}
					onValueChange={(v) => setSortBy(v as 'new' | 'hot')}
				>
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
