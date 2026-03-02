"use client"

import { useState, useMemo } from "react"
import { Plus, Search, Trash2, Pencil, Package } from "lucide-react"
import { useStore } from "@/lib/store"
import { CriticidadeBadge } from "@/lib/criticidade"
import { ProductModal } from "@/components/app/product-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Produto, Criticidade } from "@/lib/types"

const FILTROS: { value: Criticidade | "todos"; label: string }[] = [
  { value: "todos",   label: "Todos" },
  { value: "critico", label: "Crítico" },
  { value: "urgente", label: "Urgente" },
  { value: "atencao", label: "Atenção" },
  { value: "normal",  label: "Normal" },
]

export default function ProdutosPage() {
  const store = useStore()
  const [busca, setBusca] = useState("")
  const [filtro, setFiltro] = useState<Criticidade | "todos">("todos")
  const [modalOpen, setModalOpen] = useState(false)
  const [editando, setEditando] = useState<Produto | null>(null)
  const [deletandoId, setDeletandoId] = useState<string | null>(null)

  const produtosFiltrados = useMemo(() => {
    return store.produtos.filter((p) => {
      const matchBusca =
        p.nome.toLowerCase().includes(busca.toLowerCase()) ||
        p.categoria.toLowerCase().includes(busca.toLowerCase())
      const matchFiltro = filtro === "todos" || p.criticidade === filtro
      return matchBusca && matchFiltro
    })
  }, [store.produtos, busca, filtro])

  function abrirNovo() {
    setEditando(null)
    setModalOpen(true)
  }

  function abrirEditar(p: Produto) {
    setEditando(p)
    setModalOpen(true)
  }

  function handleSave(data: Omit<Produto, "id" | "criticidade" | "criadoEm" | "atualizadoEm">) {
    if (editando) {
      store.updateProduto(editando.id, data)
    } else {
      store.addProduto(data)
    }
  }

  function confirmarDelete(id: string) {
    setDeletandoId(id)
  }

  function handleDelete() {
    if (deletandoId) {
      store.deleteProduto(deletandoId)
      setDeletandoId(null)
    }
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-5">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {FILTROS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFiltro(f.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                filtro === f.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {f.label}
              {f.value !== "todos" && (
                <span className="ml-1 opacity-70">
                  ({store.produtos.filter((p) => p.criticidade === f.value).length})
                </span>
              )}
            </button>
          ))}
        </div>
        <Button
          onClick={abrirNovo}
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-semibold flex items-center gap-2 flex-none"
          size="sm"
        >
          <Plus className="w-4 h-4" />
          Novo produto
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar produtos ou categorias..."
          className="pl-9 h-10 rounded-xl"
        />
      </div>

      {/* Tabela */}
      {produtosFiltrados.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border flex flex-col items-center justify-center py-16 gap-3">
          <Package className="w-10 h-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            {busca || filtro !== "todos" ? "Nenhum produto encontrado." : "Nenhum produto cadastrado ainda."}
          </p>
          <Button size="sm" onClick={abrirNovo} className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
            Cadastrar primeiro produto
          </Button>
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">Produto</th>
                  <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">Categoria</th>
                  <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">Estoque</th>
                  <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">Mínimo</th>
                  <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">Preço</th>
                  <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {produtosFiltrados.map((p) => (
                  <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-foreground">{p.nome}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{p.categoria}</td>
                    <td className="px-5 py-3.5">
                      <span className={`font-bold ${p.quantidade === 0 ? "text-red-600" : "text-foreground"}`}>
                        {p.quantidade} {p.unidade}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">{p.quantidadeMinima} {p.unidade}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">
                      {p.preco ? `R$ ${p.preco.toFixed(2).replace(".", ",")}` : "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <CriticidadeBadge value={p.criticidade} />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => abrirEditar(p)}
                          className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                          aria-label="Editar"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => confirmarDelete(p.id)}
                          className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                          aria-label="Excluir"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden flex flex-col">
            {produtosFiltrados.map((p) => (
              <div key={p.id} className="flex items-start justify-between px-4 py-4 border-b border-border last:border-0">
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm truncate">{p.nome}</p>
                  <p className="text-xs text-muted-foreground">{p.categoria}</p>
                  <div className="flex items-center gap-2 flex-wrap mt-1">
                    <span className="text-xs text-muted-foreground">
                      Estoque: <strong className={`${p.quantidade === 0 ? "text-red-600" : "text-foreground"}`}>{p.quantidade} {p.unidade}</strong>
                    </span>
                    <CriticidadeBadge value={p.criticidade} />
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-none ml-2">
                  <button onClick={() => abrirEditar(p)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => confirmarDelete(p.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="px-5 py-3 border-t border-border bg-muted/20">
            <p className="text-xs text-muted-foreground">
              {produtosFiltrados.length} produto{produtosFiltrados.length !== 1 ? "s" : ""} exibido{produtosFiltrados.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      )}

      {/* Modal de produto */}
      <ProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        categorias={store.categorias}
        produto={editando}
      />

      {/* Modal de confirmação de exclusão */}
      {deletandoId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={() => setDeletandoId(null)} />
          <div className="relative bg-card rounded-2xl border border-border shadow-xl p-6 w-full max-w-sm">
            <h3 className="text-base font-bold text-foreground mb-2">Excluir produto?</h3>
            <p className="text-sm text-muted-foreground mb-5">
              Este produto será removido do estoque e da lista de compras. Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setDeletandoId(null)}>
                Cancelar
              </Button>
              <Button
                className="flex-1 rounded-xl bg-destructive text-white hover:bg-destructive/90 font-semibold"
                onClick={handleDelete}
              >
                Excluir
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
