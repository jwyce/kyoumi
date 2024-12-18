import Link from 'next/link';
import { api } from '@/utils/api';
import { ExploreCard } from '@/components/explore-card';

export default function Login() {
	const { data: me, isLoading: isMeLoading } = api.auth.me.useQuery();
	const { data: posts, isLoading } = api.post.getLatest.useQuery();

	if (isLoading || isMeLoading) return <div>Loading...</div>;

	if (!me || !posts || posts.length === 0) return <div>No posts found</div>;

	return (
		<div className="mt-4 px-6">
			<div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
				{[...posts, ...posts].map((post) => (
					<Link key={post.slug} href={`/explore/${post.slug}`} passHref>
						<ExploreCard post={post} me={me} />
					</Link>
				))}
			</div>
		</div>
	);
}
