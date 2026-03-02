"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { calcCriticidade } from "@/lib/store"
import { criticidadeConfig } from "@/lib/criticidade"
import type { Produto, Unidade, Categoria } from "@/lib/types"

const UNIDADES: { value: Unidade; label: string }[] = [
  { value: "un",  label: "Unidade (un)" },
  { value: "kg",  label: "Quilograma (kg)" },
  { value: "g",   label: "Grama (g)" },
  { value: "l",   label: "Litro (l)" },
  { value: "ml",  label: "Mililitro (ml)" },
  { value: "cx",  label: "Caixa (cx)" },
  { value: "pct", label: "Pacote (pct)" },
  { value: "dz",  label: "Dúzia (dz)" },
]

interface ProductModalProps {
  open: boolean
  onClose: () => void
  onSave: (data: Omit<Produto, "id" | "criticidade" | "criadoEm" | "atualizadoEm">) => void
  categorias: Categoria[]
  produto?: Produto | null
}

const EMPTY = {
  nome: "",
  categoria: "",
  quantidade: 0,
  quantidadeMinima: 1,
  unidade: "un" as Unidade,
  preco: undefined as number | undefined,
  local: "",
  observacao: "",
}

export function ProductModal({ open, onClose, onSave, categorias, produto }: ProductModalProps) {
  const [form, setForm] = useState(EMPTY)

  useEffect(() => {
    if (produto) {
      setForm({
        nome: produto.nome,
        categoria: produto.categoria,
        quantidade: produto.quantidade,
        quantidadeMinima: produto.quantidadeMinima,
        unidade: produto.unidade,
        preco: produto.preco,
        local: produto.local ?? "",
        observacao: produto.observacao ?? "",
      })
    } else {
      setForm(EMPTY)
    }
  }, [produto, open])

  function update<K extends keyof typeof EMPTY>(key: K, value: (typeof EMPTY)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave({
      ...form,
      categoria: form.categoria || (categorias[0]?.nome ?? "Geral"),
    })
    onClose()
  }

  const criticidadePreview = calcCriticidade(form.quantidade, form.quantidadeMinima)
  const crit = criticidadeConfig[criticidadePreview]

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Modal */}
      <div className="relative bg-card rounded-2xl border border-border shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-card z-10">
          <h2 className="text-base font-bold text-foreground">
            {produto ? "Editar produto" : "Novo produto"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          {/* Nome */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="p-nome">Nome do produto *</Label>
            <Input
              id="p-nome"
              value={form.nome}
              onChange={(e) => update("nome", e.target.value)}
              placeholder="Ex: Arroz, Shampoo..."
              required
              className="h-10 rounded-xl"
            />
          </div>

          {/* Categoria */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="p-cat">Categoria</Label>
            <select
              id="p-cat"
              value={form.categoria}
              onChange={(e) => update("categoria", e.target.value)}
              className="h-10 rounded-xl border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
            >
              <option value="">Selecione...</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.nome}>{c.nome}</option>
              ))}
            </select>
          </div>

          {/* Quantidade + Mínima */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="p-qtd">Quantidade atual *</Label>
              <Input
                id="p-qtd"
                type="number"
                min={0}
                step={0.1}
                value={form.quantidade}
                onChange={(e) => update("quantidade", Number(e.target.value))}
                required
                className="h-10 rounded-xl"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="p-min">Quantidade mínima *</Label>
              <Input
                id="p-min"
                type="number"
                min={1}
                step={0.1}
                value={form.quantidadeMinima}
                onChange={(e) => update("quantidadeMinima", Number(e.target.value))}
                required
                className="h-10 rounded-xl"
              />
            </div>
          </div>

          {/* Unidade + Preço */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="p-un">Unidade</Label>
              <select
                id="p-un"
                value={form.unidade}
                onChange={(e) => update("unidade", e.target.value as Unidade)}
                className="h-10 rounded-xl border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
              >
                {UNIDADES.map((u) => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="p-preco">Preço estimado (R$)</Label>
              <Input
                id="p-preco"
                type="number"
                min={0}
                step={0.01}
                value={form.preco ?? ""}
                onChange={(e) => update("preco", e.target.value ? Number(e.target.value) : undefined)}
                placeholder="0,00"
                className="h-10 rounded-xl"
              />
            </div>
          </div>

          {/* Local */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="p-local">Local de armazenamento</Label>
            <Input
              id="p-local"
              value={form.local}
              onChange={(e) => update("local", e.target.value)}
              placeholder="Ex: Despensa, Geladeira..."
              className="h-10 rounded-xl"
            />
          </div>

          {/* Observação */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="p-obs">Observação</Label>
            <textarea
              id="p-obs"
              value={form.observacao}
              onChange={(e) => update("observacao", e.target.value)}
              placeholder="Notas adicionais..."
              rows={2}
              className="rounded-xl border border-input bg-transparent px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring/50"
            />
          </div>

          {/* Preview criticidade */}
          <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border ${crit.bgClass} ${crit.borderClass}`}>
            <span className={`w-2 h-2 rounded-full flex-none ${crit.dotClass}`} />
            <p className={`text-xs font-semibold ${crit.textClass}`}>
              Criticidade calculada: <strong>{crit.label}</strong>
              {" "}— {form.quantidade} de {form.quantidadeMinima} {form.unidade} em estoque
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <Button type="button" variant="outline" className="flex-1 rounded-xl" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
              {produto ? "Salvar alterações" : "Cadastrar produto"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
