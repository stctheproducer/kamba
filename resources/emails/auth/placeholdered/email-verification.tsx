import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Hr,
  Tailwind,
} from '@react-email/components'

interface EmailVerificationProps {
  userFirstName?: string
  verificationUrl?: string
  supportUrl?: string
}

export const EmailVerificationTailwind = ({
  userFirstName = '',
  verificationUrl = 'https://example.com/verify?token=abc123',
  supportUrl = 'https://example.com/support',
}: EmailVerificationProps) => (
  <Html>
    <Head />
    <Preview>Please verify your email address to complete your account setup</Preview>
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              'brand': '#0097a7',
              'brand-50': '#f0fdff',
              'brand-100': '#ccfbf1',
              'brand-500': '#0097a7',
              'brand-600': '#0891b2',
              'brand-700': '#0e7490',
            },
          },
        },
      }}
    >
      <Body className="bg-slate-50 font-sans">
        <Container className="mx-auto py-5 pb-12 px-6 max-w-xl">
          {/* Logo Section */}
          <Section className="pb-5 text-center">
            <Heading className="text-brand text-2xl font-bold m-0">YourApp</Heading>
          </Section>

          {/* Main Heading */}
          <Heading className="text-slate-800 text-3xl font-bold my-10 px-0 text-center">
            Verify your email address
          </Heading>

          {/* Greeting */}
          <Text className="text-slate-800 text-base leading-7 my-4">Hi {userFirstName},</Text>

          {/* Main Content */}
          <Text className="text-slate-800 text-base leading-7 my-4">
            Thanks for signing up! We're excited to have you on board. To complete your account
            setup and ensure you receive important updates, please verify your email address by
            clicking the button below.
          </Text>

          {/* CTA Button */}
          <Section className="text-center my-8">
            <Button
              href={verificationUrl}
              className="bg-brand hover:bg-brand-600 text-white font-bold py-3.5 px-8 rounded-md no-underline inline-block cursor-pointer"
            >
              Verify Email Address
            </Button>
          </Section>

          {/* Security Notice */}
          <Text className="text-slate-800 text-base leading-7 my-4">
            This verification link will expire in 24 hours for security reasons. If you didn't
            create an account with us, you can safely ignore this email.
          </Text>

          <Hr className="border-slate-200 my-8" />

          {/* Fallback Instructions */}
          <Text className="text-slate-500 text-sm leading-6 my-4">
            If you're having trouble with the button above, copy and paste the URL below into your
            web browser:
          </Text>

          <Text className="text-sm my-4 break-all">
            <Link href={verificationUrl} className="text-brand underline">
              {verificationUrl}
            </Link>
          </Text>

          <Hr className="border-slate-200 my-8" />

          {/* Support Link */}
          <Text className="text-slate-500 text-sm leading-6 my-4">
            Need help? Visit our{' '}
            <Link href={supportUrl} className="text-brand underline">
              Help Center
            </Link>{' '}
            or contact our support team.
          </Text>

          {/* Signature */}
          <Text className="text-slate-500 text-sm leading-6 my-4">
            Best regards,
            <br />
            The YourApp Team
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
)

export default EmailVerificationTailwind
