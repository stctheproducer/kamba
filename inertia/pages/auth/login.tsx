import { Link } from '@tuyau/inertia/react'
import { buttonVariants } from '@/components/ui/button'
import { Bot } from 'lucide-react'
import { Icon } from '@iconify/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SharedProps } from '@adonisjs/inertia/types'
import { Head, usePage } from '@inertiajs/react'
import AuthLayout from '@/layouts/auth'

const Login = () => {
  const { props } = usePage<SharedProps>()
  const { appName } = props

  return (
    <>
      <Head title="Login" />
      <div className="flex items-center justify-center min-h-screen bg-zinc-900">
        <Card className="text-white mx-auto max-w-sm w-full bg-zinc-950 border-zinc-800">
          <CardHeader className="text-center">
            <Bot className="mx-auto h-12 w-12 text-primary" />
            <CardTitle className="text-2xl mt-4">Login to {appName}</CardTitle>
            <CardDescription>Sign in with your preferred authentication method</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <Link route={'auth.oauth.redirect'} params={{ provider: 'github' }} className={buttonVariants()}>
                <Icon icon="simple-icons:github" className="h-4 w-4" />
                Continue with GitHub
              </Link>
              {/* <div className="mt-4 text-center text-sm"> */}
              {/* By continuing, you agree to our{' '} */}
              {/* <Link href="/terms" className="underline text-primary">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline text-primary">
                Privacy Policy
              </Link> */}
              {/* . */}
              {/* </div> */}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

Login.layout = (page: React.ReactNode) => AuthLayout({ children: page })

export default Login
