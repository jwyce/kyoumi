import * as React from 'react';
import { ChevronDown, CodeXml, Minus, Plus, Quote } from 'lucide-react';
import type { toggleVariants } from '@/components/ui/toggle';
import type { Editor } from '@tiptap/react';
import type { VariantProps } from 'class-variance-authority';
import type { FormatAction } from '../../types';
import { ImageEditDialog } from '../image/image-edit-dialog';
import { LinkEditPopover } from '../link/link-edit-popover';
import { ToolbarSection } from '../toolbar-section';

type InsertElementAction = 'codeBlock' | 'blockquote' | 'horizontalRule';
interface InsertElement extends FormatAction {
	value: InsertElementAction;
}

const formatActions: InsertElement[] = [
	{
		value: 'codeBlock',
		label: 'Code block',
		icon: <CodeXml className="size-5" />,
		action: (editor) => editor.chain().focus().toggleCodeBlock().run(),
		isActive: (editor) => editor.isActive('codeBlock'),
		canExecute: (editor) =>
			editor.can().chain().focus().toggleCodeBlock().run(),
		shortcuts: ['mod', 'alt', 'C'],
	},
	{
		value: 'blockquote',
		label: 'Blockquote',
		icon: <Quote className="size-5" />,
		action: (editor) => editor.chain().focus().toggleBlockquote().run(),
		isActive: (editor) => editor.isActive('blockquote'),
		canExecute: (editor) =>
			editor.can().chain().focus().toggleBlockquote().run(),
		shortcuts: ['mod', 'shift', 'B'],
	},
	{
		value: 'horizontalRule',
		label: 'Divider',
		icon: <Minus className="size-5" />,
		action: (editor) => editor.chain().focus().setHorizontalRule().run(),
		isActive: () => false,
		canExecute: (editor) =>
			editor.can().chain().focus().setHorizontalRule().run(),
		shortcuts: ['mod', 'alt', '-'],
	},
];

interface SectionFiveProps extends VariantProps<typeof toggleVariants> {
	editor: Editor;
	activeActions?: InsertElementAction[];
	mainActionCount?: number;
}

export const SectionFive: React.FC<SectionFiveProps> = ({
	editor,
	activeActions = formatActions.map((action) => action.value),
	mainActionCount = 0,
	size,
	variant,
}) => {
	return (
		<>
			<LinkEditPopover editor={editor} size={size} variant={variant} />
			<ImageEditDialog editor={editor} size={size} variant={variant} />
			<ToolbarSection
				editor={editor}
				actions={formatActions}
				activeActions={activeActions}
				mainActionCount={mainActionCount}
				dropdownIcon={
					<>
						<Plus className="size-5" />
						<ChevronDown className="size-5" />
					</>
				}
				dropdownTooltip="Insert elements"
				size={size}
				variant={variant}
			/>
		</>
	);
};

SectionFive.displayName = 'SectionFive';

export default SectionFive;