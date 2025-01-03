import { Bookmark } from 'lucide-react';
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

type BookmarkButtonProps = {
	post: Post;
};

export const BookmarkButton = ({ post }: BookmarkButtonProps) => {
	const utils = api.useUtils();

	async function onSettled() {
    await utils.post.getPosts.invalidate();
		return await utils.post.getPost.invalidate({ slug: post.slug! });
	}

	const bookmark = api.post.bookmark.useMutation({ onSettled });

	const bookmarkedByMe = bookmark.isPending
		? !post.bookmarkedByMe
		: post.bookmarkedByMe;

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<button
					className={cn(
						'group flex items-center rounded-full text-sm transition-colors duration-300 hover:text-sky-500',
						{
							'text-sky-500': bookmarkedByMe,
						}
					)}
					onClick={async (e) => {
						e.preventDefault();
						await bookmark.mutateAsync({ id: post.id });
					}}
				>
					<div className="rounded-full p-2 group-hover:bg-sky-500/10">
						<Bookmark
							size={18}
							className={cn({ 'fill-sky-500': bookmarkedByMe })}
						/>
					</div>

					{bookmark.isPending ? (
						<span className="-ml-1">
							{post.bookmarks + (bookmarkedByMe ? 1 : -1)}
						</span>
					) : (
						<span className="-ml-1">{post.bookmarks}</span>
					)}
				</button>
			</TooltipTrigger>
			<TooltipContent>
				{bookmark.isPending ? (
					<span>{bookmarkedByMe ? 'Bookmark' : 'Remove from bookmarks'}</span>
				) : (
					<span>{bookmarkedByMe ? 'Remove from bookmarks' : 'Bookmark'}</span>
				)}
			</TooltipContent>
		</Tooltip>
	);
};
