import { t } from '../trpc';
import { z } from 'zod';
import ogs from 'open-graph-scraper';

export const exampleRouter = t.router({
	hello: t.procedure
		.input(z.object({ text: z.string().nullish() }).nullish())
		.query(({ input }) => {
			return {
				greeting: `Hello ${input?.text ?? 'world'}`,
			};
		}),
	og: t.procedure.input(z.string().url()).query(({ input }) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const ogPromise = new Promise((resolve, reject) => {
			ogs(
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				{ url: input, onlyGetOpenGraphInfo: true, downloadLimit: 100_000_000 },
				(err, res) => {
					if (!err) {
						resolve(res);
					}
					reject(err);
				}
			);
		});

		return ogPromise;
	}),
	getAll: t.procedure.query(({ ctx }) => {
		return ctx.prisma.example.findMany();
	}),
});
