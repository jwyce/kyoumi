import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { parseCookies } from 'oslo/cookie';
import type { GetServerSidePropsContext } from 'next/types';
import { api } from '@/utils/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const { req } = context;
	const deviceId = parseCookies(req.headers.cookie ?? '').get('device-id');

	if (deviceId && context.query.expired !== 'true') {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}

	return { props: {} };
}

export default function Login() {
	const [password, setPassword] = useState('');
	const router = useRouter();
	const login = api.auth.login.useMutation();

	return (
		<div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-gradient-to-b from-fuchsia-950 via-neutral-950 to-neutral-950 px-4">
			<div className="flex items-center justify-center sm:gap-2">
				<Image
					src="/logo.svg"
					alt="logo"
					width={200}
					height={200}
					className="max-w-[150px] rounded-md sm:max-w-[200px]"
				/>
				<h1
					className="bg-gradient-to-br bg-clip-text text-center text-8xl font-bold text-transparent sm:text-9xl"
					style={{
						backgroundImage:
							'linear-gradient(to bottom right, white 20%, #ea3c7a 70%, #ac1c5b 80%)',
					}}
				>
					<span className="block text-5xl sm:text-6xl">kyoumi</span>
					<span className="block">興味</span>
				</h1>
			</div>
			<p className="text-center font-semibold text-muted-foreground">
				explore your curiosity, share interests, discuss topics anonymously
			</p>
			<form
				className="w-full px-8 sm:w-auto"
				onSubmit={async (e) => {
					e.preventDefault();
					const user = await login.mutateAsync({ password });
					if (user) {
						await router.push('/');
					}
				}}
			>
				<div className="flex w-full flex-col items-center gap-2 sm:w-auto sm:flex-row">
					<Input
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<Button type="submit" className="w-full sm:w-auto">
						Login
					</Button>
				</div>
			</form>
		</div>
	);
}
