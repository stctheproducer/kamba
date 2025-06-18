export default function AuthLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className="h-screen w-full bg-zinc-900 text-white">{children}</div>
  )
}
