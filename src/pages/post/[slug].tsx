import Head from 'next/head';
import { useParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { Masonry } from 'react-plock';
import type { Content } from '@tiptap/react';
import { api } from '@/utils/api';
import { getRelativeTimeStrict } from '@/utils/relativeTime';
import { Loading } from '@/components/ui/loading';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { LinkPreview } from '@/components/link-preview';
import { MinimalTiptapEditor } from '@/components/minimal-tiptap';
import { BookmarkButton } from '@/components/post/bookmark-button';
import { LikeButton } from '@/components/post/like-button';
import { MoreActionsButton } from '@/components/post/more-actions-button';
import { ShareButton } from '@/components/post/share-button';
import { TopicBadge } from '@/components/topic-badge';

export default function Post() {
	const params = useParams();

	const { data: me, isLoading: isMeLoading } = api.auth.me.useQuery();

	const { data: post, isLoading } = api.post.getPost.useQuery(
		{ slug: params?.slug as string },
		{ enabled: !!params?.slug }
	);

	const { data: previews } = api.post.getLinkPreviews.useQuery(
		{ slug: params?.slug as string },
		{ enabled: !!params?.slug }
	);

	if (isLoading || isMeLoading || !me) return <Loading />;

	if (!post)
		return (
			<div className="flex h-[90vh] w-full items-center justify-center text-sm font-semibold text-muted-foreground">
				No post found
			</div>
		);

	const mine = post.authorId === me.id || !!me.admin;

	return (
		<>
			<Head>
				<title>{post.title} | kyoumi</title>
			</Head>
			<div className="mx-auto mt-4 px-4 pb-8 lg:w-2/3">
				<div>
					<div className="text-2xl font-bold">{post.title}</div>
					<div className="flex flex-col gap-1">
						<div className="flex items-center gap-2 text-center duration-300 sm:gap-5">
							<TopicBadge topic={post.topic} />
							{post.complete && (
								<Tooltip>
									<TooltipTrigger asChild>
										<CheckCircle
											className="stroke-green-600 dark:stroke-green-300"
											size={18}
										/>
									</TooltipTrigger>
									<TooltipContent>Complete</TooltipContent>
								</Tooltip>
							)}
							<LikeButton post={post} />
							<BookmarkButton post={post} />
							<ShareButton post={post} />
							{mine && <MoreActionsButton post={post} />}
						</div>
						<div className="whitespace-nowrap text-sm text-muted-foreground">
							{getRelativeTimeStrict(post.createdAt)}
						</div>
					</div>
				</div>
				<MinimalTiptapEditor
					value={post.content as Content}
					className="w-full"
					editorContentClassName="p-5"
					output="json"
					placeholder="What's up?"
					autofocus={false}
					editable={false}
					immediatelyRender={false}
					editorClassName="focus:outline-none"
				/>

				{previews && (
					<Masonry
						items={previews}
						config={{
							columns: [1, 2, 3],
							gap: [12, 12, 24],
							media: [820, 1800, 1920],
							useBalancedLayout: true,
						}}
						render={(preview, idx) => (
							<LinkPreview key={idx} idx={idx} preview={preview} />
						)}
					/>
				)}
			</div>
		</>
	);
}
