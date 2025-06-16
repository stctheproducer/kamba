import * as React from "react"
import {
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Link } from "@inertiajs/react"
import { Link as TuyauLink } from '@tuyau/inertia/react'
import { usePage } from "@inertiajs/react"
import { SharedProps } from "@adonisjs/inertia/types"

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


const TopNavigation = () => {
  const { props } = usePage<SharedProps>()

  const links = [
    { name: "home", href: '/', label: "Home" },
    { name: "auth.login", href: `/auth/${props.authProvider}/redirect`, label: "Login" },
    { name: 'chat.chat', href: '/chat', label: "Chat" }
  ] as const

  return (
    <NavigationMenu className='py-4'>
      <NavigationMenuList>
        {links.map((link) => (
          <NavigationMenuLink key={link.name} asChild>
            <Link href={link.href}>{link.label}</Link>
          </NavigationMenuLink>
        ))}
        {props.isAuthenticated && (
          <NavigationMenuLink key="logout" asChild className="bg-teal-800 text-white">
            <TuyauLink route="auth.logout">Logout</TuyauLink>
          </NavigationMenuLink>
        )}
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