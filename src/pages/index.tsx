import Image from 'next/image';
import { parseCookies } from 'oslo/cookie';
import type { GetServerSidePropsContext } from 'next/types';
import { CreatePostButton } from '@/components/ui/create-post-button';
import { ExploreButton } from '@/components/ui/explore-button';
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
				<h1 className="bg-[linear-gradient(to_bottom_right,_black_20%,_#ea3c7a_70%,_#ac1c5b_80%)] bg-clip-text text-center text-9xl font-bold text-transparent dark:bg-[linear-gradient(to_bottom_right,_white_20%,_#ea3c7a_70%,_#ac1c5b_80%)]">
					<span className="block text-6xl">kyoumi</span>
					<span className="block">興味</span>
				</h1>
			</div>
			<p className="font-semibold text-muted-foreground">
				explore your curiosity, share interests, discuss topics anonymously
			</p>
			<div className="mt-4 flex flex-col-reverse gap-3 md:flex-row">
				<ExploreButton />
				<AddPostButton>
					<CreatePostButton />
				</AddPostButton>
			</div>
		</div>
	);
}
