import { usePathname } from "next/navigation"

import { CommandMenu } from "@/components/command-menu"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { ModeSwitcher } from "@/components/mode-switcher"
import { AddCardButton } from "./add-card"

export function SiteHeader() {
  const pathname = usePathname()
  if (pathname === "/login") return null

  return (
    <header className="border-grid sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container m-auto flex h-14 items-center">
        <MainNav />
        <MobileNav />
        <div className="flex flex-1 items-center justify-end gap-2">
          <div className="flex items-center gap-2">
            <CommandMenu />
            <ModeSwitcher />
            <AddCardButton />
          </div>
        </div>
      </nav>
    </header>
  )
}
