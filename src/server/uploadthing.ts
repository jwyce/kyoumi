import { generateReactHelpers } from '@uploadthing/react';
import { createUploadthing } from 'uploadthing/next-legacy';
import { UploadThingError } from 'uploadthing/server';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { FileRouter } from 'uploadthing/next-legacy';

const f = createUploadthing();

const auth = (req: NextApiRequest, res: NextApiResponse) => ({ id: 'fakeId' }); // Fake auth function

export const ourFileRouter = {
	imageUploader: f({
		image: {
			maxFileSize: '4MB',
			maxFileCount: 1,
		},
	})
		.middleware(async ({ req, res }) => {
			const user = auth(req, res);

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

export type OurFileRouter = typeof ourFileRouter;

export const { useUploadThing, uploadFiles } =
	generateReactHelpers<OurFileRouter>();
