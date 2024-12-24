import { useState } from 'react';
import Link from 'next/link';
import { Flame, Sparkles } from 'lucide-react';
import InfiniteScroll from 'react-infinite-scroll-component';
import type { AppRouter } from '@/server/api/root';
import type { inferRouterOutputs } from '@trpc/server';
import { api } from '@/utils/api';
import { topicFilterOptions } from '@/lib/topicFilterOptions';
import { Combobox } from '@/components/ui/combo-box';
import { Loading, Spinner } from '@/components/ui/loading';
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

type PostsProps = {
	type: 'explore' | 'bookmarks' | 'completed';
};

export const Posts = ({ type }: PostsProps) => {
	const [sortBy, setSortBy] = useState<'hot' | 'new'>('hot');
	const [topic, setTopic] = useState<Post['topic'] | 'all'>('all');
	const { data: me, isLoading: isMeLoading } = api.auth.me.useQuery();
	const {
		data: posts,
		isLoading,
		hasNextPage,
		fetchNextPage,
	} = api.post.getPosts.useInfiniteQuery(
		{
			topic,
			sortBy,
			bookmarked: type === 'bookmarks',
			completed: type === 'completed',
		},
		{ getNextPageParam: (last) => last.nextCursor }
	);

	if (isLoading || isMeLoading) return <Loading />;

	if (!me || !posts || posts.pages.length === 0)
		return <div>No posts found</div>;

	return (
		<div className="mt-4 px-16 pb-8">
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

			<InfiniteScroll
				dataLength={posts.pages.reduce((acc, p) => acc + p.data.length, 0)}
				next={fetchNextPage}
				hasMore={hasNextPage}
				loader={
					<div className="mt-4 flex w-full items-center justify-center">
						<Spinner className="fill-rose-400" />
					</div>
				}
				endMessage={
					<p className="mt-4 text-center">
						<b>Yay! You have seen it all 🎉</b>
					</p>
				}
				// eslint-disable-next-line @typescript-eslint/no-empty-function
				refreshFunction={() => {}}
				pullDownToRefresh
				pullDownToRefreshThreshold={50}
				pullDownToRefreshContent={
					<h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
				}
				releaseToRefreshContent={
					<h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
				}
			>
				<div className="grid gap-8 xl:grid-cols-2 2xl:grid-cols-3">
					{posts?.pages.flatMap((page) =>
						page.data.map((post) => (
							<Link key={post.slug} href={`/post/${post.slug}`} passHref>
								<ExploreCard post={post} me={me} />
							</Link>
						))
					)}
				</div>
			</InfiniteScroll>
		</div>
	);
};
