"use client"

import Link from "next/link"
import {
  Package,
  ShoppingCart,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  DollarSign,
  Home,
  Receipt,
} from "lucide-react"
import { useStore } from "@/lib/store"
import { CriticidadeBadge } from "@/lib/criticidade"
import { Button } from "@/components/ui/button"

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  iconBg,
  iconColor,
}: {
  icon: React.ElementType
  label: string
  value: number | string
  sub?: string
  iconBg: string
  iconColor: string
}) {
  return (
    <div className="bg-card rounded-2xl border border-border p-5 flex items-start gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-none ${iconBg}`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{label}</p>
        <p className="text-2xl font-extrabold text-foreground mt-0.5">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const store = useStore()
  const { stats, produtos, lista, usuario, casa, despesas } = store

  const criticos = produtos.filter((p) => p.criticidade === "critico").slice(0, 5)
  const urgentes = produtos.filter((p) => p.criticidade === "urgente").slice(0, 3)
  const recentes = lista.slice(0, 6)

  // Despesas recentes (ultimas 5)
  const despesasRecentes = [...despesas]
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    .slice(0, 5)

  // Total despesas do mes atual
  const now = new Date()
  const despesasMes = despesas.filter((d) => {
    const dDate = new Date(d.data)
    return dDate.getMonth() === now.getMonth() && dDate.getFullYear() === now.getFullYear()
  })
  const totalMes = despesasMes.reduce((acc, d) => acc + d.valor, 0)

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      {/* Saudacao + Casa */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-foreground">
            Ola, {usuario.nome.split(" ")[0]}!
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Aqui esta o resumo do estoque da casa.
          </p>
        </div>
        <Link
          href="/casa"
          className="hidden sm:flex items-center gap-2.5 bg-card border border-border rounded-xl px-4 py-2.5 hover:bg-muted/50 transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Home className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{casa.nome}</p>
            <p className="text-xs text-muted-foreground">{casa.membros.length} membros</p>
          </div>
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Package}
          label="Total de produtos"
          value={stats.total}
          sub="cadastrados"
          iconBg="bg-primary/10"
          iconColor="text-primary"
        />
        <StatCard
          icon={AlertTriangle}
          label="Criticos"
          value={stats.criticos}
          sub="sem estoque ou quase"
          iconBg="bg-red-50"
          iconColor="text-red-600"
        />
        <StatCard
          icon={ShoppingCart}
          label="Na lista"
          value={stats.itensPendentes}
          sub="itens para comprar"
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
        <StatCard
          icon={DollarSign}
          label="Gastos do mes"
          value={`R$ ${totalMes.toFixed(2).replace(".", ",")}`}
          sub={`${despesasMes.length} despesa${despesasMes.length !== 1 ? "s" : ""}`}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
      </div>

      {/* Barra de criticidade visual */}
      <div className="bg-card rounded-2xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-bold text-foreground">Status do estoque</p>
          <Link href="/produtos" className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline">
            Ver todos <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="flex gap-2 h-3 rounded-full overflow-hidden">
          {stats.criticos > 0 && (
            <div
              className="bg-red-500 rounded-full"
              style={{ width: `${(stats.criticos / stats.total) * 100}%` }}
              title={`${stats.criticos} criticos`}
            />
          )}
          {stats.urgentes > 0 && (
            <div
              className="bg-orange-400 rounded-full"
              style={{ width: `${(stats.urgentes / stats.total) * 100}%` }}
              title={`${stats.urgentes} urgentes`}
            />
          )}
          {stats.atencao > 0 && (
            <div
              className="bg-amber-400 rounded-full"
              style={{ width: `${(stats.atencao / stats.total) * 100}%` }}
              title={`${stats.atencao} atencao`}
            />
          )}
          {stats.normais > 0 && (
            <div
              className="bg-emerald-400 rounded-full flex-1"
              style={{ minWidth: `${(stats.normais / stats.total) * 100}%` }}
              title={`${stats.normais} normais`}
            />
          )}
        </div>
        <div className="flex gap-4 mt-3 flex-wrap">
          {[
            { label: "Critico",  count: stats.criticos, dotClass: "bg-red-500" },
            { label: "Urgente",  count: stats.urgentes, dotClass: "bg-orange-400" },
            { label: "Atencao",  count: stats.atencao,  dotClass: "bg-amber-400" },
            { label: "Normal",   count: stats.normais,  dotClass: "bg-emerald-400" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${item.dotClass}`} />
              <span className="text-xs text-muted-foreground">
                {item.label}: <strong className="text-foreground">{item.count}</strong>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Produtos criticos */}
        <div className="bg-card rounded-2xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-foreground">Produtos criticos</p>
            <Link href="/produtos" className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline">
              Ver todos <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {criticos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CheckCircle2 className="w-8 h-8 text-primary mb-2" />
              <p className="text-sm text-muted-foreground">Nenhum produto critico</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-2">
              {criticos.map((p) => (
                <li key={p.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{p.nome}</p>
                    <p className="text-xs text-muted-foreground">{p.categoria}</p>
                  </div>
                  <div className="flex items-center gap-2 text-right">
                    <span className="text-xs text-muted-foreground">
                      {p.quantidade} / {p.quantidadeMinima} {p.unidade}
                    </span>
                    <CriticidadeBadge value={p.criticidade} />
                  </div>
                </li>
              ))}
            </ul>
          )}
          {urgentes.length > 0 && (
            <>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-4 mb-2">
                Urgente
              </p>
              <ul className="flex flex-col gap-2">
                {urgentes.map((p) => (
                  <li key={p.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{p.nome}</p>
                      <p className="text-xs text-muted-foreground">{p.categoria}</p>
                    </div>
                    <CriticidadeBadge value={p.criticidade} />
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* Lista de compras */}
        <div className="bg-card rounded-2xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-foreground">Lista de compras</p>
            <Link href="/lista" className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline">
              Ver completa <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {recentes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <ShoppingCart className="w-8 h-8 text-muted-foreground/40 mb-2" />
              <p className="text-sm text-muted-foreground">Nenhum item na lista</p>
              <Button size="sm" variant="outline" className="mt-3 rounded-full text-xs" asChild>
                <Link href="/lista">Gerar lista</Link>
              </Button>
            </div>
          ) : (
            <ul className="flex flex-col gap-1">
              {recentes.map((item) => (
                <li key={item.id} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                  <CheckCircle2
                    className={`w-4 h-4 flex-none ${item.comprado ? "text-primary" : "text-muted-foreground/30"}`}
                  />
                  <span className={`text-sm flex-1 ${item.comprado ? "line-through text-muted-foreground" : "text-foreground font-medium"}`}>
                    {item.nome}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {item.quantidade} {item.unidade}
                  </span>
                </li>
              ))}
            </ul>
          )}
          {lista.length > 6 && (
            <p className="text-xs text-muted-foreground mt-3 text-center">
              +{lista.length - 6} itens na lista
            </p>
          )}
        </div>
      </div>

      {/* Despesas recentes + Membros */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Despesas recentes */}
        <div className="bg-card rounded-2xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-foreground">Despesas recentes</p>
            <Link href="/despesas" className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline">
              Ver todas <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {despesasRecentes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Receipt className="w-8 h-8 text-muted-foreground/40 mb-2" />
              <p className="text-sm text-muted-foreground">Nenhuma despesa registrada</p>
              <Button size="sm" variant="outline" className="mt-3 rounded-full text-xs" asChild>
                <Link href="/despesas">Registrar despesa</Link>
              </Button>
            </div>
          ) : (
            <ul className="flex flex-col gap-1">
              {despesasRecentes.map((d) => (
                <li key={d.id} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{d.descricao}</p>
                    <p className="text-xs text-muted-foreground">{d.membroNome}</p>
                  </div>
                  <span className="text-sm font-bold text-foreground flex-none ml-3">
                    R$ {d.valor.toFixed(2).replace(".", ",")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Membros da casa */}
        <div className="bg-card rounded-2xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-foreground">Membros da casa</p>
            <Link href="/casa" className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline">
              Gerenciar <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <ul className="flex flex-col gap-2">
            {casa.membros.map((m) => (
              <li key={m.id} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-none">
                  <span className="text-xs font-bold text-primary">
                    {m.nome.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{m.nome}</p>
                  <p className="text-xs text-muted-foreground">{m.email}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  m.role === "admin" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                }`}>
                  {m.role === "admin" ? "Admin" : "Membro"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
