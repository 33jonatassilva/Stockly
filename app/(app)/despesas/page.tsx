"use client"

import { useState, useMemo } from "react"
import {
  Plus,
  Trash2,
  X,
  DollarSign,
  TrendingUp,
  Users,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Sparkles,
  Droplets,
  MoreHorizontal,
  Receipt,
} from "lucide-react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { DespesaCategoria } from "@/lib/types"

const CATEGORIAS_DESPESA: { value: DespesaCategoria; label: string; icon: React.ElementType; cor: string }[] = [
  { value: "mercado", label: "Mercado", icon: ShoppingCart, cor: "text-blue-600 bg-blue-50 border-blue-200" },
  { value: "feira", label: "Feira", icon: Sparkles, cor: "text-green-600 bg-green-50 border-green-200" },
  { value: "limpeza", label: "Limpeza", icon: Droplets, cor: "text-cyan-600 bg-cyan-50 border-cyan-200" },
  { value: "higiene", label: "Higiene", icon: Droplets, cor: "text-purple-600 bg-purple-50 border-purple-200" },
  { value: "outros", label: "Outros", icon: MoreHorizontal, cor: "text-gray-600 bg-gray-50 border-gray-200" },
]

function getCatConfig(cat: DespesaCategoria) {
  return CATEGORIAS_DESPESA.find((c) => c.value === cat) ?? CATEGORIAS_DESPESA[4]
}

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
]

export default function DespesasPage() {
  const store = useStore()
  const now = new Date()
  const [mesOffset, setMesOffset] = useState(0)
  const [addOpen, setAddOpen] = useState(false)
  const [filtroCategoria, setFiltroCategoria] = useState<DespesaCategoria | "todos">("todos")

  // Form state
  const [descricao, setDescricao] = useState("")
  const [valor, setValor] = useState("")
  const [categoria, setCategoria] = useState<DespesaCategoria>("mercado")
  const [data, setData] = useState(now.toISOString().slice(0, 10))
  const [membroId, setMembroId] = useState(store.casa.membros[0]?.id ?? "")

  // Mês selecionado
  const mesAtual = new Date(now.getFullYear(), now.getMonth() + mesOffset, 1)
  const mesLabel = `${MESES[mesAtual.getMonth()]} ${mesAtual.getFullYear()}`

  // Despesas filtradas pelo mes
  const despesasMes = useMemo(() => {
    return store.despesas.filter((d) => {
      const dDate = new Date(d.data)
      return dDate.getMonth() === mesAtual.getMonth() && dDate.getFullYear() === mesAtual.getFullYear()
    })
  }, [store.despesas, mesAtual])

  // Despesas com filtro de categoria
  const despesasFiltradas = useMemo(() => {
    if (filtroCategoria === "todos") return despesasMes
    return despesasMes.filter((d) => d.categoria === filtroCategoria)
  }, [despesasMes, filtroCategoria])

  // Stats do mes
  const totalMes = despesasMes.reduce((acc, d) => acc + d.valor, 0)
  const mediaPorMembro = store.casa.membros.length > 0 ? totalMes / store.casa.membros.length : 0

  // Gastos por membro
  const gastosPorMembro = useMemo(() => {
    const map = new Map<string, { nome: string; total: number; count: number }>()
    for (const m of store.casa.membros) {
      map.set(m.id, { nome: m.nome, total: 0, count: 0 })
    }
    for (const d of despesasMes) {
      const entry = map.get(d.membroId)
      if (entry) {
        entry.total += d.valor
        entry.count += 1
      }
    }
    return Array.from(map.values()).sort((a, b) => b.total - a.total)
  }, [despesasMes, store.casa.membros])

  // Gastos por categoria
  const gastosPorCategoria = useMemo(() => {
    const map = new Map<DespesaCategoria, number>()
    for (const d of despesasMes) {
      map.set(d.categoria, (map.get(d.categoria) ?? 0) + d.valor)
    }
    return CATEGORIAS_DESPESA.map((c) => ({
      ...c,
      total: map.get(c.value) ?? 0,
      pct: totalMes > 0 ? ((map.get(c.value) ?? 0) / totalMes) * 100 : 0,
    })).filter((c) => c.total > 0)
  }, [despesasMes, totalMes])

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!descricao.trim() || !valor) return
    const membro = store.casa.membros.find((m) => m.id === membroId)
    store.addDespesa({
      descricao: descricao.trim(),
      valor: Number(valor),
      categoria,
      data,
      membroId,
      membroNome: membro?.nome ?? "Desconhecido",
    })
    setDescricao("")
    setValor("")
    setCategoria("mercado")
    setData(now.toISOString().slice(0, 10))
    setAddOpen(false)
  }

  // Despesas agrupadas por data
  const despesasPorData = useMemo(() => {
    const map = new Map<string, typeof despesasFiltradas>()
    const sorted = [...despesasFiltradas].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    for (const d of sorted) {
      if (!map.has(d.data)) map.set(d.data, [])
      map.get(d.data)!.push(d)
    }
    return Array.from(map.entries())
  }, [despesasFiltradas])

  function formatarData(dateStr: string) {
    const d = new Date(dateStr + "T12:00:00")
    const hoje = new Date()
    const ontem = new Date(hoje)
    ontem.setDate(ontem.getDate() - 1)

    if (d.toDateString() === hoje.toDateString()) return "Hoje"
    if (d.toDateString() === ontem.toDateString()) return "Ontem"
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-5">
      {/* Navegacao de mes */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setMesOffset((o) => o - 1)}
          className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-extrabold text-foreground">{mesLabel}</h2>
        <button
          onClick={() => setMesOffset((o) => o + 1)}
          disabled={mesOffset >= 0}
          className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground disabled:opacity-30"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-card rounded-2xl border border-border p-5 flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center flex-none">
            <DollarSign className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Total do mes</p>
            <p className="text-2xl font-extrabold text-foreground mt-0.5">
              R$ {totalMes.toFixed(2).replace(".", ",")}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{despesasMes.length} despesa{despesasMes.length !== 1 ? "s" : ""}</p>
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border p-5 flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center flex-none">
            <Users className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Por membro</p>
            <p className="text-2xl font-extrabold text-foreground mt-0.5">
              R$ {mediaPorMembro.toFixed(2).replace(".", ",")}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">media por pessoa</p>
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border p-5 flex items-start gap-4 col-span-2 lg:col-span-1">
          <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center flex-none">
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Maior categoria</p>
            <p className="text-2xl font-extrabold text-foreground mt-0.5">
              {gastosPorCategoria[0]?.label ?? "---"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {gastosPorCategoria[0] ? `R$ ${gastosPorCategoria[0].total.toFixed(2).replace(".", ",")}` : "sem despesas"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Coluna principal - Despesas */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFiltroCategoria("todos")}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  filtroCategoria === "todos"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border hover:border-primary/50"
                }`}
              >
                Todas
              </button>
              {CATEGORIAS_DESPESA.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setFiltroCategoria(c.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    filtroCategoria === c.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border hover:border-primary/50"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <Button
              size="sm"
              className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 flex-none"
              onClick={() => setAddOpen(true)}
            >
              <Plus className="w-3.5 h-3.5" />
              Nova despesa
            </Button>
          </div>

          {/* Lista de despesas */}
          {despesasPorData.length === 0 ? (
            <div className="bg-card rounded-2xl border border-border flex flex-col items-center justify-center py-16 gap-3">
              <Receipt className="w-10 h-10 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground font-medium">
                Nenhuma despesa neste periodo.
              </p>
              <Button
                size="sm"
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5"
                onClick={() => setAddOpen(true)}
              >
                <Plus className="w-3.5 h-3.5" />
                Registrar despesa
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {despesasPorData.map(([dataStr, despesas]) => (
                <div key={dataStr} className="bg-card rounded-2xl border border-border overflow-hidden">
                  <div className="px-5 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      {formatarData(dataStr)}
                    </p>
                    <span className="text-xs font-semibold text-foreground">
                      R$ {despesas.reduce((a, d) => a + d.valor, 0).toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                  <ul className="flex flex-col">
                    {despesas.map((d) => {
                      const catCfg = getCatConfig(d.categoria)
                      const CatIcon = catCfg.icon
                      return (
                        <li
                          key={d.id}
                          className="flex items-center gap-3 px-5 py-3.5 border-b border-border last:border-0 hover:bg-muted/10 transition-colors group"
                        >
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-none border ${catCfg.cor}`}>
                            <CatIcon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{d.descricao}</p>
                            <p className="text-xs text-muted-foreground">{d.membroNome}</p>
                          </div>
                          <span className="text-sm font-bold text-foreground flex-none">
                            R$ {d.valor.toFixed(2).replace(".", ",")}
                          </span>
                          <button
                            onClick={() => store.deleteDespesa(d.id)}
                            className="flex-none opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                            aria-label="Remover despesa"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar - Resumos */}
        <div className="flex flex-col gap-4">
          {/* Por categoria */}
          <div className="bg-card rounded-2xl border border-border p-5">
            <p className="text-sm font-bold text-foreground mb-4">Por categoria</p>
            {gastosPorCategoria.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">Sem dados</p>
            ) : (
              <div className="flex flex-col gap-3">
                {gastosPorCategoria.map((c) => (
                  <div key={c.value}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-foreground">{c.label}</span>
                      <span className="text-xs text-muted-foreground">
                        R$ {c.total.toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${c.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Por membro */}
          <div className="bg-card rounded-2xl border border-border p-5">
            <p className="text-sm font-bold text-foreground mb-4">Por membro</p>
            {gastosPorMembro.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">Sem dados</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {gastosPorMembro.map((m) => (
                  <li key={m.nome} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-none">
                      <span className="text-xs font-bold text-muted-foreground">
                        {m.nome.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{m.nome}</p>
                      <p className="text-xs text-muted-foreground">{m.count} despesa{m.count !== 1 ? "s" : ""}</p>
                    </div>
                    <span className="text-sm font-bold text-foreground">
                      R$ {m.total.toFixed(2).replace(".", ",")}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Modal nova despesa */}
      {addOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
            onClick={() => setAddOpen(false)}
          />
          <div className="relative bg-card rounded-2xl border border-border shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-base font-bold text-foreground">Nova despesa</h2>
              <button
                onClick={() => setAddOpen(false)}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="px-5 py-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="d-desc">Descricao *</Label>
                <Input
                  id="d-desc"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Ex: Compra semanal no mercado"
                  required
                  className="h-10 rounded-xl"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="d-valor">Valor (R$) *</Label>
                  <Input
                    id="d-valor"
                    type="number"
                    min={0.01}
                    step={0.01}
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    placeholder="0,00"
                    required
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="d-data">Data</Label>
                  <Input
                    id="d-data"
                    type="date"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    className="h-10 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>Categoria</Label>
                <div className="flex gap-2 flex-wrap">
                  {CATEGORIAS_DESPESA.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setCategoria(c.value)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        categoria === c.value
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card text-muted-foreground border-border hover:border-primary/50"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="d-membro">Quem pagou</Label>
                <select
                  id="d-membro"
                  value={membroId}
                  onChange={(e) => setMembroId(e.target.value)}
                  className="h-10 rounded-xl border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
                >
                  {store.casa.membros.map((m) => (
                    <option key={m.id} value={m.id}>{m.nome}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-1">
                <Button type="button" variant="outline" className="flex-1 rounded-xl" onClick={() => setAddOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                  Registrar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
