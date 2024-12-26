'use client';

import Link from 'next/link';
import { motion, useAnimation } from 'motion/react';
import { Button } from '@/components/ui/button';

export const ExploreButton = () => {
	const controls = useAnimation();

	return (
		<Button
			asChild
			className="hero-join-button-dark group relative mx-auto hidden w-fit overflow-hidden rounded-xl p-[1px] font-bold transition-all duration-300 dark:block dark:hover:shadow-[0_0_2rem_-0.5rem_#fff8] md:mr-0 lg:mr-auto"
			variant="outline"
			onMouseEnter={() => controls.start('animate')}
			onMouseLeave={() => controls.start('normal')}
		>
			<Link href="/explore">
				<span className="inline-flex h-full w-fit items-center gap-2 rounded-xl px-4 py-2 transition-all duration-300 dark:bg-neutral-900 dark:text-white group-hover:dark:bg-black">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="28"
						height="28"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<circle cx="12" cy="12" r="10" />
						<motion.polygon
							points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"
							variants={{
								normal: {
									rotate: 0,
								},
								animate: {
									rotate: 360,
								},
							}}
							transition={{
								type: 'spring',
								stiffness: 120,
								damping: 15,
							}}
							animate={controls}
						/>
					</svg>
					Explore
				</span>
			</Link>
		</Button>
	);
};
