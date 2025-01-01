import TiptapCodeBlockShiki from 'tiptap-extension-code-block-shiki';

export const CodeBlockShiki = TiptapCodeBlockShiki.configure({
	defaultTheme: 'rose-pine',
	HTMLAttributes: {
		class: 'block-node',
	},
});

export default CodeBlockShiki;
