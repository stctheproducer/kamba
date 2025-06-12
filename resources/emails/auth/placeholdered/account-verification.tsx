import { Html, Head, Body, Container, Text, Section, Preview, Tailwind } from "@react-email/components"
import { OTPDisplay, ActionButton, SecurityNotice } from "../../components/auth/shared"

interface AccountVerificationEmailProps {
  userEmail?: string
  otp?: string
  verificationUrl?: string
}

export default function AccountVerificationEmail({
  userEmail = "{{userEmail}}",
  otp = "{{code}}",
  verificationUrl = "{{verificationUrl}}",
}: AccountVerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Verify your account with code {otp}</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="max-w-[600px] mx-auto p-5">
            <Section className="text-center mb-8">
              <div className="w-15 h-15 bg-[#0097a7] rounded-xl inline-flex items-center justify-center mx-auto mb-4">
                <Text className="text-white text-2xl font-bold m-0">✓</Text>
              </div>
              <Text className="text-2xl font-bold text-slate-900 m-0">Verify Your Account</Text>
            </Section>

            <Text className="text-base text-slate-700 leading-relaxed m-0 mb-6">
              Hi there! Welcome to our platform. To complete your account setup and ensure the security of your account,
              please verify your email address using the code below.
            </Text>

            <OTPDisplay otp={otp} />

            <Text className="text-base text-slate-700 leading-relaxed my-6">
              You can also click the button below to verify your account directly:
            </Text>

            <div className="text-center">
              <ActionButton href={verificationUrl}>Verify Account</ActionButton>
            </div>

            <Text className="text-sm text-slate-600 leading-relaxed my-6">
              This verification is for the email address: <strong>{userEmail}</strong>
            </Text>

            <SecurityNotice />

            <Text className="text-xs text-slate-400 text-center mt-8 m-0">
              © 2024 Your Company Name. All rights reserved.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
