export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen font-sans antialiased">
      {children}
    </main>
  )
}
