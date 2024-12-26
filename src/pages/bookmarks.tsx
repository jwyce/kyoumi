import Head from 'next/head';
import { Posts } from '@/components/posts';

export default function Bookmarks() {
	return (
		<>
			<Head>
				<title>bookmarks | kyoumi</title>
			</Head>
			<Posts type="bookmarks" emptyMessage="Nothing bookmarked yet" />
		</>
	);
}
