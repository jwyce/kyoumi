import Image from 'next/image';
import Link from 'next/link';
import { Compass, PlusCircle } from 'lucide-react';
import { parseCookies } from 'oslo/cookie';
import type { GetServerSidePropsContext } from 'next/types';
import { api } from '@/utils/api';
import { Button } from '@/components/ui/button';
import { AddPostButton } from '@/components/add-post';

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const { req } = context;
	const deviceId = parseCookies(req.headers.cookie ?? '').get('device-id');

	if (!deviceId) {
		return {
			redirect: {
				destination: '/login',
				permanent: false,
			},
		};
	}

	return { props: {} };
}

export default function Home() {
	const { data } = api.post.hello.useQuery({ text: 'world' });

	return (
		<div className="flex min-h-[calc(100vh-58px)] flex-col items-center justify-center">
			<div className="flex items-center justify-center gap-2">
				<Image
					src="/logo.svg"
					alt="logo"
					width={200}
					height={200}
					className="rounded-md"
				/>
				<h1
					className="bg-gradient-to-br bg-clip-text text-center text-9xl font-bold text-transparent"
					style={{
						backgroundImage:
							'linear-gradient(to bottom right, white 20%, #ea3c7a 70%, #ac1c5b 80%)',
					}}
				>
					<span className="block text-6xl">kyoumi</span>
					<span className="block">興味</span>
				</h1>
			</div>
			<p className="font-semibold text-muted-foreground">
				explore your curiosity, share interests, discuss topics anonymously
			</p>
			<div className="mt-4 flex flex-col-reverse gap-3 md:flex-row">
				<Button
					asChild
					className="hero-join-button-dark group relative mx-auto hidden w-fit overflow-hidden rounded-xl p-[1px] font-bold transition-all duration-300 dark:block dark:hover:shadow-[0_0_2rem_-0.5rem_#fff8] md:mr-0 lg:mr-auto"
					variant="outline"
				>
					<Link href="/explore">
						<span className="inline-flex h-full w-fit items-center gap-2 rounded-xl px-4 py-2 transition-all duration-300 dark:bg-neutral-900 dark:text-white group-hover:dark:bg-black">
							<Compass className="h-4 w-4" />
							Explore
						</span>
					</Link>
				</Button>
				<AddPostButton>
					<Button
						className="flex items-center gap-2 rounded-xl border-2 px-4 py-2 dark:text-white"
						variant="outline"
					>
						<PlusCircle className="h-4 w-4" />
						Add new
					</Button>
				</AddPostButton>
			</div>
			<p className="hidden">{data?.greeting}</p>
		</div>
	);
}
