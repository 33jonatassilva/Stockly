"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app/app-sidebar"
import { AppHeader } from "@/components/app/app-header"
import { useStore } from "@/lib/store"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { usuario, casa } = useStore()

  return (
    <div className="flex h-screen overflow-hidden bg-muted/30">
      <AppSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        casaNome={casa.nome}
        casaMembros={casa.membros.length}
      />
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <AppHeader onMenuClick={() => setSidebarOpen(true)} userName={usuario.nome} />
        <main className="flex-1 overflow-y-auto px-5 py-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  )
}
