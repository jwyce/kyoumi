'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { LinkProps } from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';

export function MobileNav() {
	const [open, setOpen] = React.useState(false);

	const onOpenChange = React.useCallback((open: boolean) => {
		setOpen(open);
	}, []);

	return (
		<Drawer open={open} onOpenChange={onOpenChange}>
			<DrawerTrigger asChild>
				<Button
					variant="ghost"
					className="-ml-2 mr-2 h-8 w-8 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth="1.5"
						stroke="currentColor"
						className="!size-6"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M3.75 9h16.5m-16.5 6.75h16.5"
						/>
					</svg>
					<span className="sr-only">Toggle Menu</span>
				</Button>
			</DrawerTrigger>
			<DrawerContent className="max-h-[60svh] p-0">
				<div className="overflow-auto p-6">
					<div className="flex flex-col space-y-3">
						<MobileLink href="/" onOpenChange={onOpenChange}>
							Home
						</MobileLink>
						<MobileLink href="/explore" onOpenChange={onOpenChange}>
							Explore
						</MobileLink>
						<MobileLink href="/bookmarks" onOpenChange={onOpenChange}>
							Bookmarks
						</MobileLink>
						<MobileLink href="/completed" onOpenChange={onOpenChange}>
							Completed
						</MobileLink>
					</div>
				</div>
			</DrawerContent>
		</Drawer>
	);
}

interface MobileLinkProps extends LinkProps {
	onOpenChange?: (open: boolean) => void;
	children: React.ReactNode;
	className?: string;
}

function MobileLink({
	href,
	onOpenChange,
	className,
	children,
	...props
}: MobileLinkProps) {
	const router = useRouter();
	return (
		<Link
			href={href}
			onClick={() => {
				// eslint-disable-next-line @typescript-eslint/no-base-to-string
				router.push(href.toString());
				onOpenChange?.(false);
			}}
			className={cn('text-base', className)}
			{...props}
		>
			{children}
		</Link>
	);
}
