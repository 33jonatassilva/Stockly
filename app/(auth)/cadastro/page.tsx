"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { StocklyLogo } from "@/components/stockly-logo"

const beneficios = [
  "Acesso gratuito por 30 dias",
  "Sem necessidade de cartão de crédito",
  "Cancele quando quiser",
  "Suporte por e-mail incluído",
]

export default function CadastroPage() {
  const router = useRouter()
  const [form, setForm] = useState({ nome: "", email: "", senha: "", confirmar: "" })
  const [showSenha, setShowSenha] = useState(false)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState("")

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro("")
    if (!form.nome || !form.email || !form.senha || !form.confirmar) {
      setErro("Preencha todos os campos.")
      return
    }
    if (form.senha !== form.confirmar) {
      setErro("As senhas não coincidem.")
      return
    }
    if (form.senha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.")
      return
    }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 900))
    setLoading(false)
    router.push("/dashboard")
  }

  const senhaForte = form.senha.length >= 8
  const senhaMedia = form.senha.length >= 6 && form.senha.length < 8

  return (
    <div className="min-h-screen flex">
      {/* ── Painel esquerdo — formulário ─────────────────────────── */}
      <div className="flex flex-col w-full lg:w-1/2 px-6 py-10 sm:px-12 lg:px-16 xl:px-24 justify-center">
        <div className="mb-10">
          <Link href="/">
            <StocklyLogo size="md" />
          </Link>
        </div>

        <div className="max-w-sm w-full">
          <h1 className="text-3xl font-extrabold text-foreground mb-1 text-balance">
            Crie sua conta grátis
          </h1>
          <p className="text-muted-foreground text-sm mb-8">
            Comece a organizar suas compras em menos de 2 minutos.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nome">Nome completo</Label>
              <Input
                id="nome"
                type="text"
                placeholder="Seu nome"
                value={form.nome}
                onChange={(e) => update("nome", e.target.value)}
                className="h-11 rounded-xl"
                autoComplete="name"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className="h-11 rounded-xl"
                autoComplete="email"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="senha">Senha</Label>
              <div className="relative">
                <Input
                  id="senha"
                  type={showSenha ? "text" : "password"}
                  placeholder="Mínimo 6 caracteres"
                  value={form.senha}
                  onChange={(e) => update("senha", e.target.value)}
                  className="h-11 rounded-xl pr-11"
                  autoComplete="new-password"
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
              {/* Indicador de força */}
              {form.senha && (
                <div className="flex gap-1 mt-1">
                  <div className={`h-1 flex-1 rounded-full transition-colors ${form.senha.length >= 1 ? (senhaForte ? "bg-primary" : senhaMedia ? "bg-amber-400" : "bg-red-400") : "bg-border"}`} />
                  <div className={`h-1 flex-1 rounded-full transition-colors ${form.senha.length >= 6 ? (senhaForte ? "bg-primary" : "bg-amber-400") : "bg-border"}`} />
                  <div className={`h-1 flex-1 rounded-full transition-colors ${senhaForte ? "bg-primary" : "bg-border"}`} />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="confirmar">Confirmar senha</Label>
              <Input
                id="confirmar"
                type={showSenha ? "text" : "password"}
                placeholder="Repita a senha"
                value={form.confirmar}
                onChange={(e) => update("confirmar", e.target.value)}
                className="h-11 rounded-xl"
                autoComplete="new-password"
                required
              />
              {form.confirmar && form.senha !== form.confirmar && (
                <p className="text-xs text-destructive">As senhas não coincidem.</p>
              )}
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
              {loading ? "Criando conta..." : "Criar conta grátis"}
            </Button>
          </form>

          <p className="mt-6 text-xs text-muted-foreground text-center">
            Ao criar sua conta você concorda com nossos{" "}
            <Link href="#" className="text-primary hover:underline">Termos de uso</Link>
            {" "}e{" "}
            <Link href="#" className="text-primary hover:underline">Política de privacidade</Link>.
          </p>

          <p className="mt-4 text-sm text-muted-foreground text-center">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>

      {/* ── Painel direito — branding ────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col items-center justify-center px-16 relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/10" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-white/10" />

        <div className="relative z-10 text-center max-w-sm">
          <StocklyLogo size="lg" inverted className="justify-center mb-10" />

          <h2 className="text-3xl font-extrabold text-white mb-4 text-balance leading-tight">
            Tudo que você precisa para comprar melhor
          </h2>
          <p className="text-white/70 text-sm leading-relaxed mb-10">
            Junte-se a milhares de pessoas que já economizam tempo e dinheiro todo mês com o Stockly.
          </p>

          <ul className="flex flex-col gap-3 text-left mb-12">
            {beneficios.map((b) => (
              <li key={b} className="flex items-center gap-3">
                <span className="flex-none w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </span>
                <span className="text-white/90 text-sm">{b}</span>
              </li>
            ))}
          </ul>

          {/* Mini stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { valor: "10k+", label: "Usuários" },
              { valor: "30%", label: "Economia média" },
              { valor: "4.9", label: "Avaliação" },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
                <p className="text-white font-extrabold text-xl">{s.valor}</p>
                <p className="text-white/60 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
