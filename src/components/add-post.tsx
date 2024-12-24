import { useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'sonner';
import type { AppRouter } from '@/server/api/root';
import type { Content } from '@tiptap/react';
import type { inferRouterInputs } from '@trpc/server';
import { api } from '@/utils/api';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { MinimalTiptapEditor } from '@/components/minimal-tiptap';

type Props = {
	children: React.ReactNode;
};

type RouterInput = inferRouterInputs<AppRouter>;
type PostCreateInput = RouterInput['post']['create'];

export const AddPostButton = ({ children }: Props) => {
	const [open, setOpen] = useState(false);

	const [title, setTitle] = useState<string | undefined>();
	const [topic, setTopic] = useState<PostCreateInput['topic'] | undefined>();
	const [content, setContent] = useState<Content>(null);

	const post = api.post.create.useMutation();
	const router = useRouter();

	return (
		<Dialog open={open} onOpenChange={(v) => setOpen(v)}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create a new post</DialogTitle>
					<DialogDescription>
						Fill in the form below to create a new post
					</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col items-center gap-4">
					<div className="flex w-full gap-4">
						<div className="flex w-full flex-col gap-2">
							<Label htmlFor="title">Title</Label>
							<Input
								id="title"
								placeholder="Title"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
							/>
						</div>

						<div className="flex w-full flex-1 flex-col gap-2">
							<Label htmlFor="topic">Topic</Label>
							<Select
								value={topic}
								onValueChange={(v) => setTopic(v as PostCreateInput['topic'])}
							>
								<SelectTrigger className="w-[180px]" id="topic">
									<SelectValue placeholder="Select a topic" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectLabel>Topics</SelectLabel>
										<SelectItem value="fun">Fun</SelectItem>
										<SelectItem value="new-idea">New Idea</SelectItem>
										<SelectItem value="brown-bag">Brown Bag</SelectItem>
										<SelectItem value="pain-point">Pain Point</SelectItem>
										<SelectItem value="improvement">Improvement</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>
					</div>

					<MinimalTiptapEditor
						value={content}
						onChange={setContent}
						className="w-full"
						editorContentClassName="p-5"
						output="json"
						placeholder="What's up?"
						autofocus={true}
						editable={true}
						editorClassName="focus:outline-none overflow-y-auto max-h-[300px]"
					/>
				</div>
				<DialogFooter>
					<Button
						type="submit"
						onClick={async () => {
							if (!title || !topic || !content) {
								toast.error('Please fill in all fields');
								return;
							}

							const newPost = await post.mutateAsync({ title, topic, content });
							if (newPost) {
								setOpen(false);
								setTitle(undefined);
								setTopic(undefined);
								setContent(null);
								toast.success('Post created!');
								await router.push(`/post/${newPost.slug}`);
							}
						}}
					>
						Post
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
