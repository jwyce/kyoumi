import { CheckCircle, Ellipsis, Pencil, Trash2 } from 'lucide-react';
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
					<DropdownMenuItem>
						<CheckCircle className="mr-2 h-4 w-4" />
						Complete
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem className="text-destructive">
					<Trash2 className="mr-2 h-4 w-4" /> Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
