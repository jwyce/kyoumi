import { generateReactHelpers } from '@uploadthing/react';
import { parseCookies } from 'oslo/cookie';
import { createUploadthing } from 'uploadthing/next-legacy';
import { UploadThingError } from 'uploadthing/server';
import type { inferRouterOutputs } from '@trpc/server';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { FileRouter } from 'uploadthing/next-legacy';
import type { AppRouter } from './api/root';

type RouterOutput = inferRouterOutputs<AppRouter>;
type User = RouterOutput['auth']['me'];

const f = createUploadthing();

const auth = async (req: NextApiRequest, _res: NextApiResponse) => {
	const cookies = parseCookies(req.headers.cookie ?? '');
	const deviceId = cookies.get('device-id');
	if (!deviceId) return undefined;

	const protocol = (req.headers['x-forwarded-proto'] as string) ?? 'http';
	const host = req.headers.host;
	const origin = `${protocol}://${host}`;

	try {
		const user = (await fetch(`${origin}/api/trpc/auth.me`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		}).then((res) => res.json())) as User;

		return user;
	} catch (error) {
		console.error('Error fetching user:', error);
		return undefined;
	}
};

export const tiptapFileRouter = {
	imageUploader: f({
		image: {
			maxFileSize: '4MB',
			maxFileCount: 1,
		},
	})
		.middleware(async ({ req, res }) => {
			const user = await auth(req, res);

			// eslint-disable-next-line @typescript-eslint/only-throw-error
			if (!user) throw new UploadThingError('Unauthorized');

			return { userId: user.id };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			console.log('Upload complete for userId:', metadata.userId);

			console.log('file url', file.url);

			return { uploadedBy: metadata.userId, ...file };
		}),
} satisfies FileRouter;

export type TipTapFileRouter = typeof tiptapFileRouter;

export const { useUploadThing, uploadFiles } =
	generateReactHelpers<TipTapFileRouter>();
