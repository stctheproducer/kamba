export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-gray-50 font-sans antialiased">
      {children}
    </main>
  )
}
