import Head from 'next/head';
import { Posts } from '@/components/posts';

export default function Explore() {
	return (
		<>
			<Head>
				<title>explore | kyoumi</title>
			</Head>
			<Posts type="explore" />
		</>
	);
}
