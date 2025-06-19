// SPDX-License-Identifier: Apache-2.0
// Copyright 2025 Chanda Mulenga
export default function AuthLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className="h-screen w-full bg-zinc-900 text-white">{children}</div>
  )
}
