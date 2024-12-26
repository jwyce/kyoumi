'use client';

import { motion, useAnimation } from 'motion/react';
import type { Variants } from 'motion/react';
import { Button } from '@/components/ui/button';

const penVariants: Variants = {
	normal: {
		rotate: 0,
		x: 0,
		y: 0,
	},
	animate: {
		rotate: [-0.5, 0.5, -0.5],
		x: [0, -1, 1.5, 0],
		y: [0, 1.5, -1, 0],
	},
};

export const CreatePostButton = () => {
	const controls = useAnimation();

	return (
		<Button
			className="flex items-center gap-2 rounded-xl border-2 px-4 py-2 dark:text-white"
			variant="outline"
			onMouseEnter={() => controls.start('animate')}
			onMouseLeave={() => controls.start('normal')}
		>
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
				<path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
				<motion.path
					d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"
					variants={penVariants}
					animate={controls}
					transition={{
						duration: 0.5,
						repeat: 1,
						ease: 'easeInOut',
					}}
				/>
			</svg>
			Create post
		</Button>
	);
};
