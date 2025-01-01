import * as React from 'react';
import { uploadFiles } from '@/server/uploadthing';
import { Placeholder } from '@tiptap/extension-placeholder';
import { TextStyle } from '@tiptap/extension-text-style';
import { Typography } from '@tiptap/extension-typography';
import { Underline } from '@tiptap/extension-underline';
import { useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { toast } from 'sonner';
import type { Content, Editor, UseEditorOptions } from '@tiptap/react';
import { cn } from '@/lib/utils';
import {
	CodeBlockShiki,
	Color,
	FileHandler,
	HorizontalRule,
	Image,
	Link,
	ResetMarksOnEnter,
	Selection,
	UnsetAllMarks,
} from '../extensions';
import { useThrottle } from '../hooks/use-throttle';
import { fileToBase64, getOutput, randomId } from '../utils';

export interface UseMinimalTiptapEditorProps extends UseEditorOptions {
	value?: Content;
	output?: 'html' | 'json' | 'text';
	placeholder?: string;
	editorClassName?: string;
	throttleDelay?: number;
	onUpdate?: (content: Content) => void;
	onBlur?: (content: Content) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
const createExtensions = (placeholder: string) => [
	StarterKit.configure({
		horizontalRule: false,
		codeBlock: false,
		paragraph: { HTMLAttributes: { class: 'text-node' } },
		heading: { HTMLAttributes: { class: 'heading-node' } },
		blockquote: { HTMLAttributes: { class: 'block-node' } },
		bulletList: { HTMLAttributes: { class: 'list-node' } },
		orderedList: { HTMLAttributes: { class: 'list-node' } },
		code: { HTMLAttributes: { class: 'inline', spellcheck: 'false' } },
		dropcursor: { width: 2, class: 'ProseMirror-dropcursor border' },
	}),
	Link,
	Underline,
	Image.configure({
		allowedMimeTypes: ['image/*'],
		maxFileSize: 4 * 1024 * 1024,
		allowBase64: true,
		uploadFn: async (file) => {
			const res = await uploadFiles('imageUploader', { files: [file] });
			const uploadfile = res[0];
			if (uploadfile) {
				return { id: uploadfile.key, src: uploadfile.url };
			}

			const src = await fileToBase64(file);
			return { id: randomId(), src };
		},
		onToggle(editor, files, pos) {
			editor.commands.insertContentAt(
				pos,
				files.map((image) => {
					const blobUrl = URL.createObjectURL(image);
					const id = randomId();

					return {
						type: 'image',
						attrs: {
							id,
							src: blobUrl,
							alt: image.name,
							title: image.name,
							fileName: image.name,
						},
					};
				})
			);
		},
		onValidationError(errors) {
			errors.forEach((error) => {
				toast.error('Image validation error', {
					position: 'bottom-right',
					description: error.reason,
				});
			});
		},
		onActionSuccess({ action }) {
			const mapping = {
				copyImage: 'Copy Image',
				copyLink: 'Copy Link',
				download: 'Download',
			};
			toast.success(mapping[action], {
				position: 'bottom-right',
				description: 'Image action success',
			});
		},
		onActionError(error, { action }) {
			const mapping = {
				copyImage: 'Copy Image',
				copyLink: 'Copy Link',
				download: 'Download',
			};
			toast.error(`Failed to ${mapping[action]}`, {
				position: 'bottom-right',
				description: error.message,
			});
		},
	}),
	FileHandler.configure({
		allowBase64: true,
		allowedMimeTypes: ['image/*'],
		maxFileSize: 4 * 1024 * 1024,
		onDrop: (editor, files, pos) => {
			// eslint-disable-next-line @typescript-eslint/no-misused-promises
			files.forEach(async (file) => {
				const res = await uploadFiles('imageUploader', { files: [file] });
				const uploadfile = res[0];
				let attrs: Record<string, string>;
				if (uploadfile) {
					attrs = { id: uploadfile.key, src: uploadfile.url };
				} else {
					const src = await fileToBase64(file);
					attrs = { id: randomId(), src };
				}

				editor.commands.insertContentAt(pos, {
					type: 'image',
					attrs,
				});
			});
		},
		onPaste: (editor, files) => {
			// eslint-disable-next-line @typescript-eslint/no-misused-promises
			files.forEach(async (file) => {
				const res = await uploadFiles('imageUploader', { files: [file] });
				const uploadfile = res[0];
				let attrs: Record<string, string>;
				if (uploadfile) {
					attrs = { id: uploadfile.key, src: uploadfile.url };
				} else {
					const src = await fileToBase64(file);
					attrs = { id: randomId(), src };
				}

				editor.commands.insertContent({
					type: 'image',
					attrs,
				});
			});
		},
		onValidationError: (errors) => {
			errors.forEach((error) => {
				toast.error('Image validation error', {
					position: 'bottom-right',
					description: error.reason,
				});
			});
		},
	}),
	Color,
	TextStyle,
	Selection,
	Typography,
	UnsetAllMarks,
	HorizontalRule,
	ResetMarksOnEnter,
	CodeBlockShiki,
	Placeholder.configure({ placeholder: () => placeholder }),
];

export const useMinimalTiptapEditor = ({
	value,
	output = 'html',
	placeholder = '',
	editorClassName,
	throttleDelay = 0,
	onUpdate,
	onBlur,
	...props
}: UseMinimalTiptapEditorProps) => {
	const throttledSetValue = useThrottle((value) => {
		if (onUpdate) onUpdate(value as Content);
	}, throttleDelay);

	const handleUpdate = React.useCallback(
		(editor: Editor) => throttledSetValue(getOutput(editor, output)),
		[output, throttledSetValue]
	);

	const handleCreate = React.useCallback(
		(editor: Editor) => {
			if (value && editor.isEmpty) {
				editor.commands.setContent(value);
			}
		},
		[value]
	);

	const handleBlur = React.useCallback(
		(editor: Editor) => onBlur?.(getOutput(editor, output)),
		[output, onBlur]
	);

	const editor = useEditor({
		extensions: createExtensions(placeholder),
		editorProps: {
			attributes: {
				autocomplete: 'off',
				autocorrect: 'off',
				autocapitalize: 'off',
				class: cn('focus:outline-none', editorClassName),
			},
		},

		onUpdate: ({ editor }) => handleUpdate(editor),
		onCreate: ({ editor }) => handleCreate(editor),
		onBlur: ({ editor }) => handleBlur(editor),
		...props,
	});

	React.useEffect(() => {
		if (editor !== null && placeholder !== '') {
			const opts = editor.extensionManager.extensions.find(
				(extension) => extension.name === 'placeholder'
			)?.options as { placeholder: string };
			opts.placeholder = placeholder;
			editor.view.dispatch(editor.state.tr);
		}
	}, [editor, placeholder]);

	return editor;
};

export default useMinimalTiptapEditor;
