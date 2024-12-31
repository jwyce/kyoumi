import { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { AppRouter } from '@/server/api/root';
import type { Content, Editor } from '@tiptap/react';
import type { inferRouterInputs } from '@trpc/server';
import { api } from '@/utils/api';
import { topicFilterOptions } from '@/lib/topicFilterOptions';
import { getRandomTopicPrompt } from '@/lib/topicPromptMap';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loading } from '@/components/ui/loading';
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

type RouterInput = inferRouterInputs<AppRouter>;
type PostCreateInput = RouterInput['post']['create'];

export default function Edit() {
	const params = useParams();
	const router = useRouter();

	const utils = api.useUtils();

	const edit = api.post.edit.useMutation();

	const [title, setTitle] = useState<string | undefined>();
	const [topic, setTopic] = useState<PostCreateInput['topic'] | undefined>();
	const [content, setContent] = useState<Content>(null);

	const topicPrompt = useMemo(() => getRandomTopicPrompt(topic), [topic]);

	const { data: post, isLoading } = api.post.getPost.useQuery(
		{ slug: params?.slug as string },
		{ enabled: !!params?.slug }
	);

	useEffect(() => {
		if (post) {
			setTitle(post.title);
			setTopic(post.topic);
		}
	}, [post]);

	const handleCreate = useCallback(
		({ editor }: { editor: Editor }) => {
			if (post?.content && editor.isEmpty) {
				editor.commands.setContent(post.content);
			}
		},
		[post]
	);

	if (isLoading) return <Loading />;

	if (!post)
		return (
			<div className="flex h-[90vh] w-full items-center justify-center text-sm font-semibold text-muted-foreground">
				No post found
			</div>
		);

	return (
		<>
			<Head>
				<title>edit - {post.title} | kyoumi</title>
			</Head>
			<div className="mx-auto mt-4 flex w-full flex-col items-center gap-4 px-4 pb-8 lg:w-2/3">
				<div className="flex w-full flex-col gap-4 sm:flex-row">
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
							<SelectTrigger className="sm:w-[180px]" id="topic">
								<SelectValue placeholder="Select a topic" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectLabel>Topics</SelectLabel>
									{topicFilterOptions
										.filter((x) => x.value !== 'all')
										.map((option) => (
											<SelectItem key={option.value} value={option.value}>
												<div className="flex items-center gap-2">
													{option.addornment}

													{option.label}
												</div>
											</SelectItem>
										))}
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
					placeholder={topicPrompt}
					autofocus={true}
					editable={true}
					immediatelyRender={false}
					editorClassName="focus:outline-none"
					onCreate={handleCreate}
				/>
				<div className="flex w-full justify-end">
					<Button
						onClick={async () => {
							if (!title || !topic || !content) {
								toast.error('Please fill in all fields');
								return;
							}
							await edit.mutateAsync({ id: post.id, title, topic, content });
							await utils.post.getPost.invalidate({ slug: post.slug! });
							router.push(`/post/${post.slug}`);
							toast.success('Post saved');
						}}
						disabled={edit.isPending}
					>
						Save post
					</Button>
				</div>
			</div>
		</>
	);
}
