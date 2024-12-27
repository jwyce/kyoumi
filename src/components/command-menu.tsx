'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { type DialogProps } from '@radix-ui/react-dialog';
import { CheckCircle, Laptop, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { api } from '@/utils/api';
import { getRelativeTime } from '@/utils/relativeTime';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import { TopicBadge } from './topic-badge';
import { Spinner } from './ui/loading';

export function CommandMenu({ ...props }: DialogProps) {
	const router = useRouter();
	const { setTheme } = useTheme();

	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState('');

	const { data: posts, isLoading } = api.post.search.useQuery(
		{ query },
		{ staleTime: 1000 * 60 * 5 }
	);

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || e.key === '/') {
				if (
					(e.target instanceof HTMLElement && e.target.isContentEditable) ||
					e.target instanceof HTMLInputElement ||
					e.target instanceof HTMLTextAreaElement ||
					e.target instanceof HTMLSelectElement
				) {
					return;
				}

				e.preventDefault();
				setOpen((open) => !open);
			}
		};

		document.addEventListener('keydown', down);
		return () => document.removeEventListener('keydown', down);
	}, []);

	const runCommand = useCallback((command: () => unknown) => {
		setOpen(false);
		command();
	}, []);

	return (
		<>
			<Button
				variant="outline"
				className={cn(
					'relative h-8 w-full justify-start rounded-[0.5rem] bg-muted/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-56 xl:w-64'
				)}
				onClick={() => setOpen(true)}
				{...props}
			>
				<span className="hidden lg:inline-flex">Search kyoumi...</span>
				<span className="inline-flex lg:hidden">Search...</span>
				<kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
					<span className="text-xs">⌘</span>K
				</kbd>
			</Button>
			<CommandDialog
				open={open}
				onOpenChange={setOpen}
				filter={(value, search) => {
					if (
						value.toLowerCase().includes(search.toLowerCase()) ||
						posts?.find((p) => p.title === value)
					)
						return 1;
					return 0;
				}}
			>
				<CommandInput
					placeholder="Type a command or search..."
					value={query}
					onValueChange={setQuery}
				/>
				{!isLoading && <CommandEmpty>No results found.</CommandEmpty>}
				<CommandList>
					{isLoading && (
						<div className="my-4 flex w-full items-center justify-center">
							<Spinner className="fill-rose-400" />
						</div>
					)}
					{(posts?.length ?? 0) > 0 && query && (
						<>
							{posts?.map((post) => (
								<CommandItem
									key={post.slug}
									value={post.title}
									onSelect={() =>
										runCommand(() => router.push(`/post/${post.slug}`))
									}
								>
									<div className="flex flex-col">
										<div className="flex items-center gap-4">
											<span>{post.title}</span>
											{post.complete && (
												<CheckCircle
													className="stroke-green-600 dark:stroke-green-300"
													size={18}
												/>
											)}
											<TopicBadge topic={post.topic} />
										</div>
										<span className="text-sm text-muted-foreground">
											{getRelativeTime(post.createdAt)}
										</span>
									</div>
								</CommandItem>
							))}
						</>
					)}
					<CommandGroup heading="Theme">
						<CommandItem onSelect={() => runCommand(() => setTheme('light'))}>
							<Sun />
							Light
						</CommandItem>
						<CommandItem onSelect={() => runCommand(() => setTheme('dark'))}>
							<Moon />
							Dark
						</CommandItem>
						<CommandItem onSelect={() => runCommand(() => setTheme('system'))}>
							<Laptop />
							System
						</CommandItem>
					</CommandGroup>
				</CommandList>
			</CommandDialog>
		</>
	);
}
