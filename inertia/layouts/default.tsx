import * as React from "react"
import {
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Link } from "@inertiajs/react"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="w-full flex justify-center">
        <TopNavigation />
      </header>
      <main className="antialiased">
        {children}
      </main>
    </>
  )
}

const links = [
  { name: "home", href: '/', label: "Home" },
  { name: "auth.login", href: '/auth/logto/redirect', label: "Login" },
] as const

const TopNavigation = () => {

  return (
    <NavigationMenu className='py-4'>
      <NavigationMenuList>
        {links.map((link) => (
          <NavigationMenuLink key={link.name} asChild>
            <Link href={link.href}>{link.label}</Link>
          </NavigationMenuLink>
        ))}
        {/* <NavigationMenuItem>
            <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink>Link</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem> */}
      </NavigationMenuList>
    </NavigationMenu>
  )
}