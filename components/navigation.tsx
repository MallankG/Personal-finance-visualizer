"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, CreditCard, IndianRupee, Home, Menu, PieChart, X } from "lucide-react"
import { useState } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const links = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Transactions", href: "/transactions", icon: CreditCard },
  { name: "Categories", href: "/categories", icon: PieChart },
  { name: "Budgets", href: "/budgets", icon: BarChart3 },
]

export function Navigation() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-6">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b px-2 py-4">
                  <Link href="/" className="flex items-center gap-2 font-semibold" onClick={() => setOpen(false)}>
                    <IndianRupee className="h-5 w-5 text-primary" />
                    <span>Finance Visualizer</span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <nav className="flex-1 overflow-auto py-4">
                  <div className="flex flex-col gap-1 px-2">
                    {links.map((link) => {
                      const LinkIcon = link.icon
                      const isActive = pathname === link.href
                      return (
                        <Link
                          key={link.name}
                          href={link.href}
                          onClick={() => setOpen(false)}
                          className={cn("nav-link", isActive && "nav-link-active")}
                        >
                          <LinkIcon className="h-4 w-4" />
                          {link.name}
                        </Link>
                      )
                    })}
                  </div>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <IndianRupee className="h-5 w-5 text-white" />
            </div>
            <span className="hidden font-bold sm:inline-block">Finance Visualizer</span>
          </Link>
          <nav className="hidden md:flex md:gap-2">
            {links.map((link) => {
              const LinkIcon = link.icon
              const isActive = pathname === link.href
              return (
                <Link key={link.name} href={link.href} className={cn("nav-link", isActive && "nav-link-active")}>
                  <LinkIcon className="h-4 w-4" />
                  {link.name}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button asChild className="hidden sm:flex">
            <Link href="/transactions/new">
              <IndianRupee className="mr-2 h-4 w-4" />
              Add Transaction
            </Link>
          </Button>
          <Button asChild size="icon" className="sm:hidden">
            <Link href="/transactions/new">
              <IndianRupee className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
