import { GeistSans } from 'geist/font/sans';
import type { AppType } from 'next/app';
import { api } from '@/utils/api';
import '@/styles/globals.css';
import '@/components/minimal-tiptap/styles/index.css';
import Head from 'next/head';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SiteHeader } from '@/components/site-header';
import { ThemeProvider } from '@/components/theme-provider';

const MyApp: AppType = ({ Component, pageProps }) => {
	const queryClient = new QueryClient();

	return (
		<>
			<Head>
				<title>kyoumi</title>
				<meta property="og:title" content="kyoumi 興味" />
				<meta property="og:site_name" content="kyoumi 興味" />
				<meta
					property="description"
					content="🐙 explore your curiosity, share interests, discuss topics anonymously"
				/>
				<meta
					property="og:description"
					content="🐙 explore your curiosity, share interests, discuss topics anonymously"
				/>
				<meta property="og:type" content="website" />
				<meta
					property="og:image"
					content="https://kyoumi.vercel.app/logo.svg"
				/>
				<link rel="icon" href="/logo.svg" />
			</Head>
			<main className={GeistSans.className}>
				<QueryClientProvider client={queryClient}>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<TooltipProvider>
							<SiteHeader />
							<Component {...pageProps} />
							<Toaster richColors />
						</TooltipProvider>
					</ThemeProvider>
				</QueryClientProvider>
			</main>
		</>
	);
};

export default api.withTRPC(MyApp);
