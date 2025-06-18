// import type React from "react"
import { Button, Text, Hr, Tailwind } from '@react-email/components'

interface OTPDisplayProps {
  otp: string
}

export function OTPDisplay({ otp }: OTPDisplayProps) {
  return (
    <Tailwind>
      <div className="bg-slate-50 border-2 border-dashed border-[#0097a7] rounded-lg p-6 text-center my-8">
        <Text className="text-sm text-slate-600 m-0 mb-2 font-medium">Your verification code</Text>
        <Text className="text-3xl font-bold text-[#0097a7] tracking-[8px] m-0 font-mono">
          {otp}
        </Text>
        <Text className="text-xs text-slate-400 m-0 mt-2">This code expires in 10 minutes</Text>
      </div>
    </Tailwind>
  )
}

interface ActionButtonProps {
  href: string
  children: React.ReactNode
}

export function ActionButton({ href, children }: ActionButtonProps) {
  return (
    <Tailwind>
      <Button
        href={href}
        className="bg-[#0097a7] text-white px-6 py-3 rounded-md no-underline font-semibold text-base border-none cursor-pointer inline-block my-4 hover:bg-[#007a87] transition-colors"
      >
        {children}
      </Button>
    </Tailwind>
  )
}

export function SecurityNotice() {
  return (
    <Tailwind>
      <Hr className="border-slate-200 my-8" />
      <Text className="text-sm text-slate-600 leading-relaxed my-4">
        <strong>Security Notice:</strong> If you didn't request this verification code, please
        ignore this email. Your account remains secure and no action is required.
      </Text>
      <Text className="text-sm text-slate-600 leading-relaxed my-4">
        For security reasons, never share this code with anyone. Our team will never ask for your
        verification code.
      </Text>
    </Tailwind>
  )
}
