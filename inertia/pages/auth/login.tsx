import { Link } from "@tuyau/inertia/react";
import { buttonVariants } from "@/components/ui/button"
import { Bot, Mail } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InferPageProps } from "@adonisjs/inertia/types";
import AuthController from "#controllers/auth_controller";

export default function Login(props: InferPageProps<AuthController, 'login'>) {
  const { appName } = props

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-900">
      {/* <Card className="mx-auto max-w-sm w-full bg-zinc-950 border-zinc-800"> */}
      <Card className="mx-auto max-w-sm w-full bg-zinc-950 border-zinc-800">
        <CardHeader className="text-center">
          <Bot className="mx-auto h-12 w-12 text-primary" />
          <CardTitle className="text-2xl mt-4">Login to {appName}</CardTitle>
          <CardDescription>Sign in with your preferred authentication method</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Link route={"auth.logto.redirect"} className={buttonVariants()}>
              <Mail className="h-4 w-4" />
              Continue with Email
            </Link>
            <div className="mt-4 text-center text-sm">
              By continuing, you agree to our{" "}
              {/* <Link href="/terms" className="underline text-primary">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline text-primary">
                Privacy Policy
              </Link> */}
              .
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}