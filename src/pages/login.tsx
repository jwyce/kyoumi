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
		<div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gradient-to-b from-fuchsia-950 via-neutral-950 to-neutral-950">
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
			<div className="flex items-center gap-2">
				<Input
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<Button
					variant="secondary"
					onClick={async () => {
						const user = await login.mutateAsync({ password });
						if (user) {
							await router.push('/');
						}
					}}
				>
					Login
				</Button>
			</div>
		</div>
	);
}
