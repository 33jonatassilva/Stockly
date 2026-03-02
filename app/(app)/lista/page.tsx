"use client"

import { useState, useMemo } from "react"
import {
  Plus,
  RefreshCw,
  Trash2,
  CheckCircle2,
  Circle,
  ShoppingCart,
  Sparkles,
  X,
} from "lucide-react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Unidade } from "@/lib/types"

const UNIDADES: Unidade[] = ["un", "kg", "g", "l", "ml", "cx", "pct", "dz"]

interface NovoItemForm {
  nome: string
  quantidade: number
  unidade: Unidade
  preco: string
}

const EMPTY_FORM: NovoItemForm = { nome: "", quantidade: 1, unidade: "un", preco: "" }

export default function ListaPage() {
  const store = useStore()
  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState<NovoItemForm>(EMPTY_FORM)
  const [filtro, setFiltro] = useState<"todos" | "pendentes" | "comprados">("todos")

  function update<K extends keyof NovoItemForm>(key: K, value: NovoItemForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!form.nome.trim()) return
    store.addItemLista({
      nome: form.nome.trim(),
      quantidade: form.quantidade,
      unidade: form.unidade,
      comprado: false,
      preco: form.preco ? Number(form.preco) : undefined,
    })
    setForm(EMPTY_FORM)
    setAddOpen(false)
  }

  const listaFiltrada = useMemo(() => {
    return store.lista.filter((i) => {
      if (filtro === "pendentes") return !i.comprado
      if (filtro === "comprados") return i.comprado
      return true
    })
  }, [store.lista, filtro])

  // Agrupa por categoria
  const grupos = useMemo(() => {
    const map = new Map<string, typeof listaFiltrada>()
    for (const item of listaFiltrada) {
      const cat = item.categoria ?? "Outros"
      if (!map.has(cat)) map.set(cat, [])
      map.get(cat)!.push(item)
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [listaFiltrada])

  const pendentes = store.lista.filter((i) => !i.comprado).length
  const comprados = store.lista.filter((i) => i.comprado).length
  const totalEstimado = store.lista
    .filter((i) => !i.comprado && i.preco)
    .reduce((acc, i) => acc + (i.preco ?? 0) * i.quantidade, 0)

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-5">
      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Pendentes", value: pendentes, color: "text-amber-600" },
          { label: "Comprados", value: comprados, color: "text-primary" },
          {
            label: "Estimativa",
            value: `R$ ${totalEstimado.toFixed(2).replace(".", ",")}`,
            color: "text-blue-600",
          },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-2xl border border-border px-4 py-3 text-center">
            <p className={`text-xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        {/* Filtros */}
        <div className="flex gap-2">
          {(["todos", "pendentes", "comprados"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all capitalize ${
                filtro === f
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {f === "todos" ? "Todos" : f === "pendentes" ? "Pendentes" : "Comprados"}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            className="rounded-xl text-xs gap-1.5"
            onClick={store.gerarLista}
            title="Gera automaticamente com base nos produtos críticos"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Gerar automático
          </Button>
          {comprados > 0 && (
            <Button
              size="sm"
              variant="outline"
              className="rounded-xl text-xs gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/5"
              onClick={store.limparComprados}
            >
              <Trash2 className="w-3.5 h-3.5" />
              Limpar comprados
            </Button>
          )}
          <Button
            size="sm"
            className="rounded-xl text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => setAddOpen(true)}
          >
            <Plus className="w-3.5 h-3.5" />
            Adicionar item
          </Button>
        </div>
      </div>

      {/* Lista */}
      {grupos.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border flex flex-col items-center justify-center py-16 gap-3">
          <ShoppingCart className="w-10 h-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground font-medium">
            {filtro !== "todos" ? "Nenhum item neste filtro." : "Sua lista está vazia."}
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="rounded-full text-xs gap-1.5"
              onClick={store.gerarLista}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Gerar automático
            </Button>
            <Button
              size="sm"
              className="rounded-full text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => setAddOpen(true)}
            >
              <Plus className="w-3.5 h-3.5" />
              Adicionar item
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {grupos.map(([categoria, itens]) => (
            <div key={categoria} className="bg-card rounded-2xl border border-border overflow-hidden">
              {/* Cabeçalho do grupo */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-muted/30">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  {categoria}
                </p>
                <span className="text-xs text-muted-foreground">
                  {itens.filter((i) => i.comprado).length}/{itens.length}
                </span>
              </div>

              {/* Itens */}
              <ul className="flex flex-col">
                {itens.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center gap-3 px-5 py-3.5 border-b border-border last:border-0 hover:bg-muted/10 transition-colors group"
                  >
                    <button
                      onClick={() => store.toggleItemLista(item.id)}
                      className="flex-none text-muted-foreground hover:text-primary transition-colors"
                      aria-label={item.comprado ? "Desmarcar" : "Marcar como comprado"}
                    >
                      {item.comprado ? (
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${item.comprado ? "line-through text-muted-foreground" : "text-foreground"}`}>
                        {item.nome}
                      </p>
                      {item.preco && (
                        <p className="text-xs text-muted-foreground">
                          R$ {item.preco.toFixed(2).replace(".", ",")} × {item.quantidade} ={" "}
                          R$ {(item.preco * item.quantidade).toFixed(2).replace(".", ",")}
                        </p>
                      )}
                    </div>

                    <span className="text-sm text-muted-foreground font-medium flex-none">
                      {item.quantidade} {item.unidade}
                    </span>

                    <button
                      onClick={() => store.deleteItemLista(item.id)}
                      className="flex-none opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                      aria-label="Remover item"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Modal adicionar item */}
      {addOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
            onClick={() => setAddOpen(false)}
          />
          <div className="relative bg-card rounded-2xl border border-border shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-base font-bold text-foreground">Adicionar item</h2>
              <button
                onClick={() => setAddOpen(false)}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="px-5 py-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="l-nome">Nome do item *</Label>
                <Input
                  id="l-nome"
                  value={form.nome}
                  onChange={(e) => update("nome", e.target.value)}
                  placeholder="Ex: Leite, Sabão..."
                  required
                  className="h-10 rounded-xl"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-1.5 col-span-1">
                  <Label htmlFor="l-qtd">Qtd.</Label>
                  <Input
                    id="l-qtd"
                    type="number"
                    min={0.1}
                    step={0.1}
                    value={form.quantidade}
                    onChange={(e) => update("quantidade", Number(e.target.value))}
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="flex flex-col gap-1.5 col-span-1">
                  <Label htmlFor="l-un">Unidade</Label>
                  <select
                    id="l-un"
                    value={form.unidade}
                    onChange={(e) => update("unidade", e.target.value as Unidade)}
                    className="h-10 rounded-xl border border-input bg-transparent px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
                  >
                    {UNIDADES.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5 col-span-1">
                  <Label htmlFor="l-preco">Preço (R$)</Label>
                  <Input
                    id="l-preco"
                    type="number"
                    min={0}
                    step={0.01}
                    value={form.preco}
                    onChange={(e) => update("preco", e.target.value)}
                    placeholder="0,00"
                    className="h-10 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <Button type="button" variant="outline" className="flex-1 rounded-xl" onClick={() => setAddOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                  Adicionar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
