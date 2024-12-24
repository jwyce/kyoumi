import { Heart } from 'lucide-react';
import type { AppRouter } from '@/server/api/root';
import type { inferRouterOutputs } from '@trpc/server';
import { api } from '@/utils/api';
import { cn } from '@/lib/utils';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';

type RouterOutput = inferRouterOutputs<AppRouter>;
type Post = RouterOutput['post']['getPosts']['data'][0];

type LikeButtonProps = {
	post: Post;
};

export const LikeButton = ({ post }: LikeButtonProps) => {
	const utils = api.useUtils();

	async function onSettled() {
		return await utils.post.getPost.invalidate({ slug: post.slug! });
	}

	const like = api.post.like.useMutation({ onSettled });

	const likedByMe = like.isPending ? !post.likedByMe : post.likedByMe;
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<button
					className={cn(
						'group flex items-center rounded-full text-sm transition-colors duration-300 hover:text-pink-600',
						{
							'text-pink-600': likedByMe,
						}
					)}
					onClick={async (e) => {
						e.preventDefault();
						await like.mutateAsync({ id: post.id });
					}}
				>
					<div className="rounded-full p-2 group-hover:bg-pink-600/10">
						<Heart size={18} className={cn({ 'fill-pink-600': likedByMe })} />
					</div>

					{like.isPending ? (
						<span className="-ml-1">{post.likes + (likedByMe ? 1 : -1)}</span>
					) : (
						<span className="-ml-1">{post.likes}</span>
					)}
				</button>
			</TooltipTrigger>
			<TooltipContent>
				{like.isPending ? (
					<span>{likedByMe ? 'Like' : 'Unlike'}</span>
				) : (
					<span>{likedByMe ? 'Unlike' : 'Like'}</span>
				)}
			</TooltipContent>
		</Tooltip>
	);
};
