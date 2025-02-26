/**
 * This is the client-side entrypoint for your tRPC API. It is used to create the `api` object which
 * contains the Next.js App-wrapper, as well as your type-safe React Query hooks.
 *
 * We also create a few inference helpers for input and output types.
 */
import { type AppRouter } from '@/server/api/root';
import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { httpBatchLink, loggerLink, TRPCClientError } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server';
import { toast } from 'sonner';
import superjson from 'superjson';

const getBaseUrl = () => {
	if (typeof window !== 'undefined') return ''; // browser should use relative url
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
	return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

/** A set of type-safe react-query hooks for your tRPC API. */
export const api = createTRPCNext<AppRouter>({
	config() {
		return {
			queryClient: new QueryClient({
				defaultOptions: {
					queries: {
						retry(failureCount, err) {
							if (err instanceof TRPCClientError) {
								const error = err as TRPCClientError<AppRouter>;
								if (
									error.data?.code === 'UNAUTHORIZED' ||
									(error.data?.code === 'NOT_FOUND' &&
										error.data.path === 'post.getPost')
								) {
									return false;
								}
							}
							return failureCount < 3;
						},
					},
				},
				queryCache: new QueryCache({
					onError: (err) => {
						if (err instanceof TRPCClientError) {
							const error = err as TRPCClientError<AppRouter>;
							if (error.data?.code === 'UNAUTHORIZED') {
								window.location.href = '/login?expired=true';
							}
						}
					},
				}),
				mutationCache: new MutationCache({
					onError: (err) => {
						if (err instanceof TRPCClientError) {
							const error = err as TRPCClientError<AppRouter>;
							if (error.data?.code === 'UNAUTHORIZED') {
								if (error.data.path != 'auth.login') {
									window.location.href = '/login?expired=true';
								}
							}
							toast.error(error.message);
						}
					},
				}),
			}),
			/**
			 * Links used to determine request flow from client to server.
			 *
			 * @see https://trpc.io/docs/links
			 */
			links: [
				loggerLink({
					enabled: (opts) =>
						process.env.NODE_ENV === 'development' ||
						(opts.direction === 'down' && opts.result instanceof Error),
				}),
				httpBatchLink({
					/**
					 * Transformer used for data de-serialization from the server.
					 *
					 * @see https://trpc.io/docs/data-transformers
					 */
					transformer: superjson,
					url: `${getBaseUrl()}/api/trpc`,
				}),
			],
		};
	},
	/**
	 * Whether tRPC should await queries when server rendering pages.
	 *
	 * @see https://trpc.io/docs/nextjs#ssr-boolean-default-false
	 */
	ssr: false,
	transformer: superjson,
});

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;
