import Head from 'next/head';
import { Posts } from '@/components/posts';

export default function Completed() {
	return (
		<>
			<Head>
				<title>completed | kyoumi</title>
			</Head>
			<Posts type="completed" emptyMessage="Nothing completed yet" />
		</>
	);
}
