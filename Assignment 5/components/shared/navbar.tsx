"use client"

import * as React from "react"
import Link from "next/link"
import {
  BarChart3,
  BookOpen,
  ChevronDown,
  CreditCard,
  LayoutGrid,
  LifeBuoy,
  LogOut,
  Menu,
  Settings,
  Sparkles,
  User,
  Users,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

type ProductLink = {
  title: string
  description: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const productLinks: ProductLink[] = [
  {
    title: "Analytics",
    description: "Track metrics and user behavior in real time.",
    href: "#analytics",
    icon: BarChart3,
  },
  {
    title: "Dashboards",
    description: "Build custom views for every team.",
    href: "#dashboards",
    icon: LayoutGrid,
  },
  {
    title: "Automations",
    description: "Trigger workflows without writing code.",
    href: "#automations",
    icon: Sparkles,
  },
  {
    title: "Team Access",
    description: "Manage roles, seats, and permissions.",
    href: "#team",
    icon: Users,
  },
]

const simpleLinks = [
  { title: "Pricing", href: "#pricing" },
  { title: "Docs", href: "#docs" },
  { title: "Blog", href: "#blog" },
]

export function Navbar(user : any) {
    const currentUser = user?.user?.data
    console.log(currentUser)
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Left: logo + desktop nav */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Sparkles className="size-4" />
            </span>
            <span className="text-base font-semibold tracking-tight">Luma</span>
          </Link>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Product</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[520px] grid-cols-2 gap-2 p-3">
                    {productLinks.map((item) => (
                      <li key={item.title}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={item.href}
                            className="flex select-none gap-3 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <item.icon className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
                            <div className="flex flex-col gap-1">
                              <span className="text-sm font-medium leading-none">
                                {item.title}
                              </span>
                              <span className="text-sm leading-snug text-muted-foreground">
                                {item.description}
                              </span>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {simpleLinks.map((link) => (
                <NavigationMenuItem key={link.title}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={link.href}
                      className="inline-flex h-9 items-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
                    >
                      {link.title}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right: auth + account menu */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="hidden sm:inline-flex" asChild>
            <Link href="/login">Sign in</Link>
          </Button>

          {/* Account dropdown menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="hidden items-center gap-2 px-2 md:inline-flex"
              >
                <Avatar className="size-7">
                  <AvatarImage src={currentUser?.image} alt={currentUser?.name} />
                  <AvatarFallback>{currentUser?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <ChevronDown className="size-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">{currentUser?.name}</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {currentUser?.email}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <User className="size-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard className="size-4" />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="size-4" />
                  Settings
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <LifeBuoy className="size-4" />
                  Support
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BookOpen className="size-4" />
                  Documentation
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <LogOut className="size-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button className="hidden sm:inline-flex" asChild>
            <Link href="#get-started">Get started</Link>
          </Button>

          {/* Mobile menu */}
          <MobileNav />
        </div>
      </div>
    </header>
  )
}

function MobileNav() {
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="size-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Sparkles className="size-4" />
            </span>
            Luma
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col gap-1 px-4">
          <p className="px-2 pb-1 pt-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Product
          </p>
          {productLinks.map((item) => (
            <SheetClose asChild key={item.title}>
              <Link
                href={item.href}
                className="flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <item.icon className="size-4 text-muted-foreground" />
                {item.title}
              </Link>
            </SheetClose>
          ))}

          <div className="my-2 h-px bg-border" />

          {simpleLinks.map((link) => (
            <SheetClose asChild key={link.title}>
              <Link
                href={link.href}
                className="rounded-md px-2 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {link.title}
              </Link>
            </SheetClose>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-2 border-t border-border p-4">
          <Button variant="outline" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild>
            <Link href="#get-started">Get started</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
