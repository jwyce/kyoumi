import { useRef } from 'react';
import { usePathname } from 'next/navigation';
import { PlusCircle } from 'lucide-react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Button } from '@/components/ui/button';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { CommandMenu } from '@/components/command-menu';
import { MainNav } from '@/components/main-nav';
import { MobileNav } from '@/components/mobile-nav';
import { ModeSwitcher } from '@/components/mode-switcher';
import { AddPostButton } from './add-post';
import { DropdownMenuShortcut } from './ui/dropdown-menu';

export function SiteHeader() {
	const ref = useRef<HTMLButtonElement>(null);
	useHotkeys('mod+alt+shift+n', () => ref.current?.click());

	const pathname = usePathname();
	if (pathname === '/login') return null;

	return (
		<header className="border-grid sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<nav className="container flex h-14 items-center">
				<MainNav />
				<MobileNav />
				<div className="flex flex-1 items-center justify-end gap-2">
					<div className="flex w-3/4 items-center gap-2 lg:w-auto">
						<CommandMenu />
						<ModeSwitcher />
						<Tooltip>
							<AddPostButton>
								<TooltipTrigger asChild>
									<Button variant="outline" size="icon" ref={ref}>
										<PlusCircle className="h-4 w-4" />
									</Button>
								</TooltipTrigger>
							</AddPostButton>
							<TooltipContent className="flex items-center gap-4">
								Create new post
								<DropdownMenuShortcut>⌘⌥⇧N</DropdownMenuShortcut>
							</TooltipContent>
						</Tooltip>
					</div>
				</div>
			</nav>
		</header>
	);
}
