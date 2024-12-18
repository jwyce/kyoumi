import { useParams } from 'next/navigation';
import type { Content } from '@tiptap/react';
import { api } from '@/utils/api';
import { MinimalTiptapEditor } from '@/components/minimal-tiptap';

export default function Post() {
	const params = useParams();

	const { data: post, isLoading } = api.post.getPost.useQuery(
		{ slug: params?.slug as string },
		{ enabled: !!params?.slug }
	);

	console.log({ post });

	if (isLoading) return <div>Loading...</div>;

	if (!post) return <div>No post found</div>;

	return (
		<div className="mt-4 px-6">
			<MinimalTiptapEditor
				value={post.content as Content}
				className="w-full"
				editorContentClassName="p-5"
				output="json"
				placeholder="What's up?"
				autofocus={false}
				editable={false}
				editorClassName="focus:outline-none"
			/>
		</div>
	);
}
