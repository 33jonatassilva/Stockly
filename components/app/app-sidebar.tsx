"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  LogOut,
  X,
  Home,
  Receipt,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { StocklyLogo } from "@/components/stockly-logo"

const navItems = [
  { href: "/dashboard",      icon: LayoutDashboard, label: "Dashboard" },
  { href: "/produtos",       icon: Package,          label: "Produtos" },
  { href: "/lista",          icon: ShoppingCart,     label: "Lista de compras" },
  { href: "/despesas",       icon: Receipt,          label: "Despesas" },
  { href: "/casa",           icon: Home,             label: "Minha casa" },
  { href: "/configuracoes",  icon: Settings,         label: "Configuracoes" },
]

interface AppSidebarProps {
  open: boolean
  onClose: () => void
  casaNome?: string
  casaMembros?: number
}

export function AppSidebar({ open, onClose, casaNome, casaMembros }: AppSidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Backdrop mobile */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full w-64 bg-card border-r border-border flex flex-col transition-transform duration-300",
          "lg:translate-x-0 lg:static lg:z-auto",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-border flex-none">
          <StocklyLogo size="md" />
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
            aria-label="Fechar menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Casa badge */}
        {casaNome && (
          <Link
            href="/casa"
            onClick={onClose}
            className="mx-3 mt-4 mb-1 px-3 py-2.5 rounded-xl bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-none">
              <Home className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{casaNome}</p>
              {casaMembros !== undefined && (
                <p className="text-xs text-muted-foreground">{casaMembros} membro{casaMembros !== 1 ? "s" : ""}</p>
              )}
            </div>
          </Link>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">
          <p className="px-3 py-1 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
            Menu
          </p>
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || pathname.startsWith(href + "/")
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon className="w-4 h-4 flex-none" />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="flex-none px-3 py-4 border-t border-border">
          <Link
            href="/login"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all duration-150"
          >
            <LogOut className="w-4 h-4 flex-none" />
            Sair
          </Link>
        </div>
      </aside>
    </>
  )
}
