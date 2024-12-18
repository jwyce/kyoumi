import Link from 'next/link';
import { api } from '@/utils/api';
import { Loading } from '@/components/ui/loading';
import { ExploreCard } from '@/components/explore-card';

export default function Explore() {
	const { data: me, isLoading: isMeLoading } = api.auth.me.useQuery();
	const { data: posts, isLoading } = api.post.getLatest.useQuery();

	if (isLoading || isMeLoading) return <Loading />;

	if (!me || !posts || posts.length === 0) return <div>No posts found</div>;

	return (
		<div className="mt-4 px-16">
			<div className="grid gap-8 xl:grid-cols-2 2xl:grid-cols-3">
				{posts.map((post) => (
					<Link key={post.slug} href={`/post/${post.slug}`} passHref>
						<ExploreCard post={post} me={me} />
					</Link>
				))}
			</div>
		</div>
	);
}
