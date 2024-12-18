import { Share2 } from 'lucide-react';
import type { AppRouter } from '@/server/api/root';
import type { inferRouterOutputs } from '@trpc/server';
import { copy } from '@/utils/copy';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';

type RouterOutput = inferRouterOutputs<AppRouter>;
type Post = RouterOutput['post']['getLatest'][0];

type ShareButtonProps = {
	post: Post;
};

export const ShareButton = ({ post }: ShareButtonProps) => {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<button
					className="group flex items-center rounded-full text-sm transition-colors duration-300 hover:text-emerald-600"
					onClick={async (e) => {
						e.preventDefault();
						await copy(
							`${window.location.origin}/post/${post.slug}`,
							'Link copied to clipboard'
						);
					}}
				>
					<div className="rounded-full p-2 group-hover:bg-emerald-600/10">
						<Share2 size={18} />
					</div>
				</button>
			</TooltipTrigger>
			<TooltipContent>Share</TooltipContent>
		</Tooltip>
	);
};
