import * as React from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Link } from '@inertiajs/react'
import { Link as TuyauLink } from '@tuyau/inertia/react'
import { usePage } from '@inertiajs/react'
import { SharedProps } from '@adonisjs/inertia/types'
import { Bot, Menu, X } from 'lucide-react'
import { useChatRuntime } from '@assistant-ui/react-ai-sdk'
import { AssistantRuntimeProvider } from '@assistant-ui/react'

export default function Layout({ children }: { children: React.ReactNode }) {
  const runtime = useChatRuntime({
    api: '/api/chat',
  })

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <TopNavigation />
      <div className="antialiased">{children}</div>
    </AssistantRuntimeProvider>
  )
}

const TopNavigation = () => {
  const { props } = usePage<SharedProps>()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const links = [
    { name: "home", href: '/', label: "Home" },
    ...(!props.isAuthenticated ? [{ name: "auth.login", href: `/auth/${props.authProvider}/redirect`, label: "Login" }] : []),
    { name: 'chat.chat', href: '/chat', label: "Chat" }
  ] as const

  return (
    <header className="border-b border-zinc-800 bg-zinc-900/95 backdrop-blur supports-[backdrop-filter]:bg-zinc-900/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Brand */}
          <div className="flex items-center gap-2">
            <Bot className="w-8 h-8 text-primary" />
            <Link
              href="/"
              className="text-xl font-bold text-white hover:text-primary transition-colors"
            >
              Kamba
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navigationLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-zinc-300 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Authentication */}
          <div className="hidden md:flex items-center gap-4">
            {!props.isAuthenticated ? (
              <Link href={`/auth/${props.authProvider}/redirect`}>
                <Button variant="ghost" className="text-zinc-300 hover:text-white">
                  Sign In
                </Button>
              </Link>
            ) : (
              <TuyauLink route="auth.logout">
                <Button
                  variant="outline"
                  className="text-zinc-300 hover:text-white border-zinc-700"
                >
                  Logout
                </Button>
              </TuyauLink>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-zinc-300 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-zinc-800">
            <nav className="flex flex-col gap-4">
              {navigationLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-zinc-300 hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-zinc-800">
                {!props.isAuthenticated ? (
                  <Link
                    href={`/auth/${props.authProvider}/redirect`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-zinc-300 hover:text-white"
                    >
                      Sign In
                    </Button>
                  </Link>
                ) : (
                  <TuyauLink route="auth.logout" onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-zinc-300 hover:text-white border-zinc-700"
                    >
                      Logout
                    </Button>
                  </TuyauLink>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
