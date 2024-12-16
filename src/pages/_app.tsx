import { type AppType } from "next/app"
import { api } from "@/utils/api"
import { GeistSans } from "geist/font/sans"

import "@/styles/globals.css"

import Head from "next/head"

import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SiteHeader } from "@/components/site-header"
import { ThemeProvider } from "@/components/theme-provider"

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Kyoumi</title>
        <meta
          name="description"
          content="🐙 興味 - explore your curiosity, share interests, discuss topics anonymously"
        />
        <link rel="icon" href="/logo.svg" />
      </Head>
      <main className={GeistSans.className}>
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
      </main>
    </>
  )
}

export default api.withTRPC(MyApp)
