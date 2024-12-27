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
	emptyMessage?: string;
};

export const Posts = ({ type, emptyMessage }: PostsProps) => {
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

	const postsCount =
		posts?.pages.reduce((acc, p) => acc + p.data.length, 0) ?? 0;

	if (isLoading || isMeLoading) return <Loading />;

	if (!me || !posts || postsCount === 0)
		return (
			<div className="flex h-[90vh] w-full items-center justify-center text-sm text-muted-foreground">
				{emptyMessage ?? 'No posts found'}
			</div>
		);

	return (
		<div className="mt-4 min-h-[90vh] px-4 pb-8 sm:px-16">
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
				dataLength={postsCount}
				next={fetchNextPage}
				hasMore={hasNextPage && postsCount >= 30}
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
			>
				<div className="grid gap-8 xl:grid-cols-2 2xl:grid-cols-3">
					{posts?.pages.flatMap((page, idx) =>
						page.data.map((post) => (
							<Link
								key={post.slug}
								href={`/post/${post.slug}`}
								passHref
								className="motion-preset-fade motion-preset-slide-up w-[calc(100vw-2rem)] sm:w-full"
							>
								<ExploreCard
									post={post}
									me={me}
									input={{
										cursor:
											idx < 1
												? undefined
												: (posts.pages.at(idx - 1)?.nextCursor ?? undefined),
										topic,
										sortBy,
										bookmarked: type === 'bookmarks',
										completed: type === 'completed',
									}}
								/>
							</Link>
						))
					)}
				</div>
			</InfiniteScroll>
		</div>
	);
};
