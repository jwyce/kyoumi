'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function MainNav() {
	const pathname = usePathname();

	return (
		<div className="mr-4 hidden md:flex">
			<Link href="/" className="mr-4 flex items-center gap-2 lg:mr-6">
				<Image src="/logo.svg" alt="kyoumi_logo" width={32} height={32} />
				<span className="hidden font-bold lg:inline-block">kyoumi 興味</span>
			</Link>
			<nav className="flex items-center gap-4 text-sm xl:gap-6">
				<Link
					href="/explore"
					className={cn(
						'transition-colors hover:text-foreground/80',
						pathname === '/explore' ? 'text-foreground' : 'text-foreground/60'
					)}
				>
					Explore
				</Link>
				<Link
					href="/bookmarks"
					className={cn(
						'transition-colors hover:text-foreground/80',
						pathname === '/bookmarks' ? 'text-foreground' : 'text-foreground/60'
					)}
				>
					Bookmarks
				</Link>
				<Link
					href="/completed"
					className={cn(
						'transition-colors hover:text-foreground/80',
						pathname === '/completed' ? 'text-foreground' : 'text-foreground/60'
					)}
				>
					Completed
				</Link>
			</nav>
		</div>
	);
}
