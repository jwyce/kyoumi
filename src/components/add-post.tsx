import { useEffect, useState } from 'react';
import type { Content } from '@tiptap/react';
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

function extractLinksFromTiptapJson(doc: Content) {
	const links: string[] = [];

	function traverse(node: Content) {
		if (typeof node === 'string' || node instanceof Array || node === null)
			return;
		if (node.type === 'text' && node.marks) {
			node.marks.forEach((mark) => {
				if (mark.type === 'link' && mark.attrs?.href) {
					links.push(mark.attrs.href as string);
				}
			});
		}

		if (node.content) {
			node.content.forEach(traverse);
		}
	}

	traverse(doc);
	return links;
}

export const AddPostButton = ({ children }: Props) => {
	const [value, setValue] = useState<Content>('');

	useEffect(
		() => console.log({ links: extractLinksFromTiptapJson(value) }),
		[value]
	);

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create a new post</DialogTitle>
					<DialogDescription>Fill in the form below to create a new post</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col items-center gap-4">
					<div className="flex w-full gap-4">
						<div className="flex w-full flex-col gap-2">
							<Label htmlFor="title">Title</Label>
							<Input id="title" placeholder="Title" />
						</div>

						<div className="flex w-full flex-1 flex-col gap-2">
							<Label htmlFor="topic">Topic</Label>
							<Select>
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
						value={value}
						onChange={setValue}
						className="w-full"
						editorContentClassName="p-5"
						output="json"
						placeholder="Type your description here..."
						autofocus={true}
						editable={true}
						editorClassName="focus:outline-none"
					/>
				</div>
				<DialogFooter>
					<Button type="submit">Post</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
