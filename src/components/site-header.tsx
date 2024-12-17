import { usePathname } from 'next/navigation';
import { PlusCircle } from 'lucide-react';
import { CommandMenu } from '@/components/command-menu';
import { MainNav } from '@/components/main-nav';
import { MobileNav } from '@/components/mobile-nav';
import { ModeSwitcher } from '@/components/mode-switcher';
import { AddPostButton } from './add-post';
import { Button } from './ui/button';

export function SiteHeader() {
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
						<AddPostButton>
							<Button variant="outline" size="icon">
								<PlusCircle className="h-4 w-4" />
							</Button>
						</AddPostButton>
					</div>
				</div>
			</nav>
		</header>
	);
}
