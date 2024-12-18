import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';

export type SelectOption = {
	value: string;
	label: string;
	addornment?: React.ReactNode;
};

type ComboboxProps = {
	options: SelectOption[];
	fieldValue: string;
	selectionPlaceholder?: string;
	placeholder?: string;
	className?: string;
	onSelect: (option: SelectOption) => void;
};

export function Combobox({
	fieldValue,
	options,
	placeholder,
	selectionPlaceholder,
	className,
	onSelect,
}: ComboboxProps) {
	const [open, setOpen] = React.useState(false);
	const [value, setValue] = React.useState(fieldValue);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-[200px] justify-between"
				>
					{value ? (
						<>
							{(() => {
								const opt = options.find((option) => option.value === value);
								if (opt?.addornment) {
									return (
										<div className="flex w-full items-center justify-between">
											{opt.label}

											{opt.addornment}
										</div>
									);
								}
								return opt?.label;
							})()}
						</>
					) : (
						(selectionPlaceholder ?? 'Select an option...')
					)}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command className={className}>
					<CommandInput placeholder={placeholder ?? 'Search an option'} />
					<CommandList>
						<CommandEmpty>No results found.</CommandEmpty>
						<CommandGroup>
							{options.map((option) => (
								<CommandItem
									key={option.value}
									value={option.value}
									onSelect={(currentValue) => {
										setValue(currentValue === value ? '' : currentValue);
										onSelect(option);
										setOpen(false);
									}}
								>
									<Check
										className={cn(
											'mr-2 h-4 w-4',
											value === option.value ? 'opacity-100' : 'opacity-0'
										)}
									/>

									{option.addornment ? (
										<div className="flex w-full items-center justify-between">
											{option.label}

											{option.addornment}
										</div>
									) : (
										<>{option.label}</>
									)}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
