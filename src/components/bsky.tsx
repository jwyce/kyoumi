/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useQuery } from '@tanstack/react-query';
import { EmbeddedPost, PostNotFound, PostSkeleton } from 'bsky-react-post';
import { fetchPost } from 'bsky-react-post/api';
import 'bsky-react-post/theme.css';

type Props = {
	id: string;
	handle: string;
};
export const Bsky = ({ id, handle }: Props) => {
	const {
		data: thread,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['bsky', id, handle],
		queryFn: () => fetchPost({ id, handle }),
		staleTime: 3600 * 24,
	});

	if (isLoading) return <PostSkeleton />;
	if (!thread) return <PostNotFound error={error} />;

	return <EmbeddedPost thread={thread} />;
};
