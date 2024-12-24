import { EmbeddedTweet, TweetNotFound, TweetSkeleton } from 'react-tweet';
import { api } from '@/utils/api';

type Props = {
	id: string;
};
export const Tweet = ({ id }: Props) => {
	const {
		data: tweet,
		isLoading,
		error,
	} = api.helper.getTweet.useQuery({ id }, { staleTime: 3600 * 24 });

	if (isLoading) return <TweetSkeleton />;
	if (!tweet) return <TweetNotFound error={error} />;

	return <EmbeddedTweet tweet={tweet} />;
};
