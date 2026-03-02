"use client"

import { Menu, Bell } from "lucide-react"
import { usePathname } from "next/navigation"

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/dashboard":     { title: "Dashboard",           subtitle: "Visao geral do estoque da casa" },
  "/produtos":      { title: "Produtos",             subtitle: "Gerencie os produtos da casa" },
  "/lista":         { title: "Lista de compras",     subtitle: "O que a casa precisa comprar" },
  "/despesas":      { title: "Despesas",             subtitle: "Controle de gastos mensais" },
  "/casa":          { title: "Minha casa",           subtitle: "Gerencie membros e configuracoes" },
  "/configuracoes": { title: "Configuracoes",        subtitle: "Personalize o Stockly" },
}

interface AppHeaderProps {
  onMenuClick: () => void
  userName?: string
}

export function AppHeader({ onMenuClick, userName = "Usuário" }: AppHeaderProps) {
  const pathname = usePathname()
  const page = pageTitles[pathname] ?? { title: "Stockly", subtitle: "" }
  const initials = userName
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <header className="h-16 flex-none flex items-center justify-between px-5 bg-background border-b border-border">
      {/* Left: hamburger + title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
          aria-label="Abrir menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base font-bold text-foreground leading-none">{page.title}</h1>
          {page.subtitle && (
            <p className="text-xs text-muted-foreground mt-0.5">{page.subtitle}</p>
          )}
        </div>
      </div>

      {/* Right: bell + avatar */}
      <div className="flex items-center gap-2">
        <button
          className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground relative"
          aria-label="Notificações"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
        </button>
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <span className="text-xs font-bold text-primary-foreground">{initials}</span>
        </div>
      </div>
    </header>
  )
}
