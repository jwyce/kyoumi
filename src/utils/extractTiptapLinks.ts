import type { Content } from '@tiptap/react';

export function extractTiptapLinks(doc: Content) {
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
