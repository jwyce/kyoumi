import { useState } from 'react';
import { CheckCircle, Ellipsis, Pencil, Trash2 } from 'lucide-react';
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

export const MoreActionsButton = () => {
	const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
	const [completeConfirmOpen, setCompleteConfirmOpen] = useState(false);
	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				onClick={(e) => e.preventDefault()}
				className="group flex items-center rounded-full text-sm transition-colors duration-300 hover:text-sky-500"
			>
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
					<DropdownMenuItem>
						<Pencil className="mr-2 h-4 w-4" /> Edit
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={(e) => {
							e.preventDefault();
							setCompleteConfirmOpen(true);
						}}
					>
						<CheckCircle className="mr-2 h-4 w-4" />
						Complete
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem className="text-destructive">
					<Trash2 className="mr-2 h-4 w-4" /> Delete
				</DropdownMenuItem>
				<AlertDialog
					open={completeConfirmOpen}
					onOpenChange={(v) => setCompleteConfirmOpen(v)}
				>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Complete this post?</AlertDialogTitle>
							<AlertDialogDescription>
								Are you finished discussing this topic and/or have followed up
								on it? This action cannot be undone and will remove this post
								from the explore page.
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
							<AlertDialogAction>Complete</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
