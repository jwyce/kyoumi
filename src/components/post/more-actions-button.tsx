import { useState } from 'react';
import { useRouter } from 'next/router';
import { CheckCircle, Ellipsis, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { AppRouter } from '@/server/api/root';
import type { RouterInputs } from '@/utils/api';
import type { inferRouterOutputs } from '@trpc/server';
import { api } from '@/utils/api';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { buttonVariants } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';

type RouterOutput = inferRouterOutputs<AppRouter>;
type Post = RouterOutput['post']['getPosts']['data'][0];
type PostInput = RouterInputs['post']['getPosts'];

type MoreActionsProps = {
	post: Post;
	input?: PostInput;
};

export const MoreActionsButton = ({ post, input }: MoreActionsProps) => {
	const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
	const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
	const [completeConfirmOpen, setCompleteConfirmOpen] = useState(false);

	const utils = api.useUtils();

	const router = useRouter();

	async function onSettled() {
		return await utils.post.getPost.invalidate({ slug: post.slug! });
	}

	const complete = api.post.complete.useMutation({
		onMutate: async () => {
			toast.success('Post marked as complete');
			if (input) {
				await utils.post.getPosts.cancel();
				const prevPosts = utils.post.getPosts.getInfiniteData(input);
				const newPosts = prevPosts?.pages.map((page) => {
					const newData = page.data.map((p) =>
						p.id === post.id ? { ...p, complete: true } : p
					);
					return { ...page, data: newData };
				});

				utils.post.getPosts.setInfiniteData(input, (old) => {
					if (old && newPosts) {
						return { ...old, pages: newPosts };
					}

					return old;
				});

				return { prevPosts };
			}
			await utils.post.getPost.cancel();
			const prev = utils.post.getPost.getData({ slug: post.slug! });
			utils.post.getPost.setData({ slug: post.slug! }, (old) =>
				old ? { ...old, complete: true } : old
			);

			return { prev };
		},
		onError: (_err, _vars, context) => {
			toast.error('Failed to mark post as complete');
			if (input) {
				utils.post.getPosts.setInfiniteData(input, context?.prevPosts);
			} else {
				utils.post.getPost.setData({ slug: post.slug! }, context?.prev);
			}
		},
		onSettled,
	});

	const remove = api.post.delete.useMutation({
		onMutate: async () => {
			if (input) {
				toast.success('Post deleted');
				await utils.post.getPosts.cancel();
				const prevPosts = utils.post.getPosts.getInfiniteData(input);
				const newPosts = prevPosts?.pages.map((page) => {
					const newData = page.data.filter((p) => p.id !== post.id);
					return { ...page, data: newData };
				});

				utils.post.getPosts.setInfiniteData(input, (old) => {
					if (old && newPosts) {
						return { ...old, pages: newPosts };
					}

					return old;
				});

				return { prevPosts };
			}
		},
		onError: async (_err, _vars, context) => {
			toast.error('Failed to delete post');
			if (input) {
				utils.post.getPosts.setInfiniteData(input, context?.prevPosts);
			}
		},
		onSettled,
	});

	return (
		<div
			onClick={(e) => {
				e.preventDefault();
				e.stopPropagation();
			}}
		>
			<DropdownMenu open={moreDropdownOpen} onOpenChange={setMoreDropdownOpen}>
				<DropdownMenuTrigger className="group flex items-center rounded-full text-sm transition-colors duration-300 hover:text-sky-500">
					<Tooltip>
						<TooltipTrigger asChild>
							<div className="rounded-full p-2 group-hover:bg-sky-500/10">
								<Ellipsis size={18} />
							</div>
						</TooltipTrigger>
						<TooltipContent>More</TooltipContent>
					</Tooltip>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-56">
					<DropdownMenuGroup>
						<DropdownMenuItem
							onClick={() => router.push(`/post/${post.slug}/edit`)}
						>
							<Pencil className="mr-2 h-4 w-4" /> Edit
						</DropdownMenuItem>
						{!post.complete && (
							<DropdownMenuItem
								onClick={(e) => e.stopPropagation()}
								onSelect={() => {
									setTimeout(() => setCompleteConfirmOpen(true));
								}}
							>
								<CheckCircle className="mr-2 h-4 w-4" />
								Complete
							</DropdownMenuItem>
						)}
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className="text-destructive"
						onClick={(e) => e.stopPropagation()}
						onSelect={() => {
							setTimeout(() => setDeleteConfirmOpen(true));
						}}
					>
						<Trash2 className="mr-2 h-4 w-4" /> Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<AlertDialog
				open={completeConfirmOpen}
				onOpenChange={setCompleteConfirmOpen}
			>
				<AlertDialogContent onClick={(e) => e.preventDefault()}>
					<AlertDialogHeader>
						<AlertDialogTitle>Complete this post?</AlertDialogTitle>
						<AlertDialogDescription>
							Are you finished discussing this topic and/or have followed up on
							it? This action cannot be undone and will remove this post from
							the explore page.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel
							onClick={(e) => {
								e.preventDefault();
								setCompleteConfirmOpen(false);
							}}
						>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={async (e) => {
								e.preventDefault();
								setCompleteConfirmOpen(false);
								await complete.mutateAsync({ id: post.id });
							}}
						>
							Complete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
			<AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
				<AlertDialogContent onClick={(e) => e.preventDefault()}>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete your
							post and remove it from our servers.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel
							onClick={(e) => {
								e.preventDefault();
								setDeleteConfirmOpen(false);
							}}
						>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							className={buttonVariants({ variant: 'destructive' })}
							onClick={async (e) => {
								e.preventDefault();
								setDeleteConfirmOpen(false);
								await remove.mutateAsync({ id: post.id });
								if (!input) {
									toast.success('Post deleted');
									await router.push('/explore');
								}
							}}
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
};
