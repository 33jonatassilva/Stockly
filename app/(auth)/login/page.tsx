"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, CheckCircle2, ListChecks, Package, TrendingDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { StocklyLogo } from "@/components/stockly-logo"

const features = [
  { icon: ListChecks, text: "Listas de compras inteligentes" },
  { icon: Package,    text: "Controle de estoque doméstico" },
  { icon: TrendingDown, text: "Economize até 30% todo mês" },
]

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [showSenha, setShowSenha] = useState(false)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro("")
    if (!email || !senha) {
      setErro("Preencha todos os campos.")
      return
    }
    setLoading(true)
    // Simula autenticação
    await new Promise((r) => setTimeout(r, 800))
    setLoading(false)
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen flex">
      {/* ── Painel esquerdo — formulário ─────────────────────────── */}
      <div className="flex flex-col w-full lg:w-1/2 px-6 py-10 sm:px-12 lg:px-16 xl:px-24 justify-center">
        {/* Logo */}
        <div className="mb-10">
          <Link href="/">
            <StocklyLogo size="md" />
          </Link>
        </div>

        <div className="max-w-sm w-full">
          <h1 className="text-3xl font-extrabold text-foreground mb-1 text-balance">
            Bem-vindo de volta
          </h1>
          <p className="text-muted-foreground text-sm mb-8">
            Entre na sua conta para continuar organizando suas compras.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-xl"
                autoComplete="email"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="senha">Senha</Label>
                <Link
                  href="#"
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="senha"
                  type={showSenha ? "text" : "password"}
                  placeholder="••••••••"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="h-11 rounded-xl pr-11"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowSenha(!showSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showSenha ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {erro && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                {erro}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="h-11 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 mt-1"
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <p className="mt-6 text-sm text-muted-foreground text-center">
            Não tem uma conta?{" "}
            <Link href="/cadastro" className="text-primary font-semibold hover:underline">
              Criar conta grátis
            </Link>
          </p>
        </div>
      </div>

      {/* ── Painel direito — branding ────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col items-center justify-center px-16 relative overflow-hidden">
        {/* Círculos decorativos */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/10" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-white/10" />
        <div className="absolute top-1/4 right-8 w-40 h-40 rounded-full bg-white/5" />

        <div className="relative z-10 text-center max-w-sm">
          <StocklyLogo size="lg" inverted className="justify-center mb-10" />

          <h2 className="text-3xl font-extrabold text-white mb-4 text-balance leading-tight">
            Organize suas compras com inteligência
          </h2>
          <p className="text-white/70 text-sm leading-relaxed mb-10">
            Nunca mais desperdice dinheiro comprando o que já tem em casa ou esquecendo o que realmente precisa.
          </p>

          <ul className="flex flex-col gap-4 text-left">
            {features.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <span className="flex-none w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-white" />
                </span>
                <span className="text-white/90 text-sm font-medium">{text}</span>
              </li>
            ))}
          </ul>

          {/* Mini mockup card */}
          <div className="mt-12 bg-white rounded-2xl p-4 text-left shadow-xl">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
              Sua lista de hoje
            </p>
            {[
              { nome: "Feijão Carioca", qtd: "2 kg", done: true },
              { nome: "Shampoo", qtd: "1 un", done: true },
              { nome: "Arroz", qtd: "3 kg", done: false },
            ].map((item) => (
              <div key={item.nome} className="flex items-center gap-2 py-1.5">
                <CheckCircle2
                  className={`w-4 h-4 flex-none ${item.done ? "text-primary" : "text-muted-foreground/30"}`}
                />
                <span className={`text-sm ${item.done ? "line-through text-muted-foreground" : "text-foreground font-medium"}`}>
                  {item.nome}
                </span>
                <span className="ml-auto text-xs text-muted-foreground">{item.qtd}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
