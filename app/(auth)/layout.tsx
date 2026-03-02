import type { ReactNode } from "react"

// Login e cadastro gerenciam seu próprio layout split-screen interno
export default function AuthLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen font-sans">{children}</div>
}
