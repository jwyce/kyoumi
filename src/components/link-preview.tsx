import { useEffect, useRef, useState } from 'react';
import NextImage from 'next/image';
import { FastAverageColor } from 'fast-average-color';
import { Spotify } from 'react-spotify-embed';
import YouTube from 'react-youtube';
import type { AppRouter } from '@/server/api/root';
import type { inferRouterOutputs } from '@trpc/server';
import { Bsky } from './bsky';
import { Tweet } from './tweet';

type RouterOutput = inferRouterOutputs<AppRouter>;
type Preview = RouterOutput['post']['getLinkPreviews'][0];

type Props = {
	preview: Preview;
	idx: number;
};

export const LinkPreview = ({ preview, idx }: Props) => {
	const [colors, setColors] = useState<string[]>([]);
	const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
	const [imagesLoaded, setImagesLoaded] = useState<number>(0);

	useEffect(() => {
		const fac = new FastAverageColor();

		const calculateColors = async () => {
			const newColors = await Promise.all(
				imageRefs.current.map(async (img) => {
					if (img?.complete) {
						try {
							const color = fac.getColor(img);
							return color.hex;
						} catch {
							return '#1f2938';
						}
					}
					return '#1f2938';
				})
			);
			setColors(newColors);
		};

		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		calculateColors();
	}, [imagesLoaded]);

	return (
		<div className="relative max-w-[400px] rounded-md bg-muted/50 p-4 text-sm">
			<div
				className="absolute left-0 top-0 h-full w-1 rounded-l-md"
				style={{ background: colors[idx] }}
			/>
			<div className="flex flex-col gap-1">
				<div className="flex items-center gap-2 font-semibold">
					{preview.favicon && (
						<NextImage
							src={preview.favicon}
							alt={preview.title}
							width={15}
							height={15}
							crossOrigin="anonymous"
							onLoad={() => setImagesLoaded((prev) => prev + 1)}
							ref={(el) => {
								if (el) imageRefs.current[idx] = el;
							}}
						/>
					)}
					{preview.siteName}
				</div>
				<a
					href={preview.url}
					target="_blank"
					className="text-primary-foreground hover:underline"
				>
					{preview.title}
				</a>
				{preview && <Extras preview={preview} />}
			</div>
		</div>
	);
};

function Extras({ preview }: { preview: Preview }) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
	const onPlayerReady = (event: any) => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
		event.target.pauseVideo();
	};
	const ytOpts = {
		height: '200',
		width: '350',
		playerVars: {
			autoplay: 0,
		},
	};

	if (preview.url.includes('spotify')) {
		return <Spotify wide link={preview.url} className="!rounded-2xl" />;
	} else if (preview.url.includes('youtube') && preview.url.includes('watch')) {
		return (
			<YouTube
				videoId={RegExp(/[?&]v=([a-zA-Z0-9_-]+)/).exec(preview.url)![1]}
				opts={ytOpts}
				onReady={onPlayerReady}
			/>
		);
	} else if (preview.url.includes('x.com') && preview.url.includes('status')) {
		const id = RegExp(/status\/([0-9]+)/).exec(preview.url)![1] ?? '';
		return <Tweet id={id} />;
	} else if (
		preview.url.includes('bsky') &&
		preview.url.includes('profile') &&
		preview.url.includes('post')
	) {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const [_, handle, id] = RegExp(/\/profile\/([^/]+)\/post\/([^/]+)/).exec(
			preview.url
		)!;
		return <Bsky handle={handle ?? ''} id={id ?? ''} />;
	}

	return (
		<>
			<div className="line-clamp-2 text-muted-foreground">
				{preview.description}
			</div>
			{preview.image && (
				<NextImage
					src={preview.image}
					alt={preview.title}
					width={340}
					height={340}
					className="rounded-md"
				/>
			)}
		</>
	);
}
