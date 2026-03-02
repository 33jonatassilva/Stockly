"use client"

import { useState } from "react"
import { Plus, Trash2, Pencil, X, Check, AlertTriangle, AlertCircle, CheckCircle, Info } from "lucide-react"
import { useStore } from "@/lib/store"
import { criticidadeConfig } from "@/lib/criticidade"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Criticidade } from "@/lib/types"

const CRITICIDADE_ORDER: Criticidade[] = ["critico", "urgente", "atencao", "normal"]

const CRITICIDADE_ICONS = {
  critico: AlertCircle,
  urgente: AlertTriangle,
  atencao: Info,
  normal: CheckCircle,
}

const CRITICIDADE_DESC: Record<Criticidade, { threshold: string; example: string }> = {
  critico: {
    threshold: "Estoque = 0",
    example: "Ex: Arroz com 0 kg em casa",
  },
  urgente: {
    threshold: "Estoque ≤ 50% do mínimo",
    example: "Ex: Mínimo 4L de leite, tem 1L",
  },
  atencao: {
    threshold: "Estoque ≤ quantidade mínima",
    example: "Ex: Mínimo 4L de leite, tem 3L",
  },
  normal: {
    threshold: "Estoque acima do mínimo",
    example: "Ex: Mínimo 4L de leite, tem 6L",
  },
}

// ─── Categoria colors ──────────────────────────────────────────────────────
const COR_OPTIONS = [
  { label: "Verde",    value: "#22c55e" },
  { label: "Azul",    value: "#3b82f6" },
  { label: "Roxo",    value: "#8b5cf6" },
  { label: "Vermelho",value: "#ef4444" },
  { label: "Laranja", value: "#f97316" },
  { label: "Amarelo", value: "#eab308" },
  { label: "Ciano",   value: "#06b6d4" },
  { label: "Rosa",    value: "#ec4899" },
  { label: "Cinza",   value: "#6b7280" },
]

export default function ConfiguracoesPage() {
  const store = useStore()

  // Categorias
  const [newCat, setNewCat] = useState("")
  const [newCatCor, setNewCatCor] = useState(COR_OPTIONS[0].value)
  const [editCatId, setEditCatId] = useState<string | null>(null)
  const [editCatNome, setEditCatNome] = useState("")

  // Usuário
  const [nomeEdit, setNomeEdit] = useState(store.usuario.nome)
  const [emailEdit, setEmailEdit] = useState(store.usuario.email)
  const [userSaved, setUserSaved] = useState(false)

  function handleAddCat(e: React.FormEvent) {
    e.preventDefault()
    if (!newCat.trim()) return
    store.addCategoria(newCat.trim(), newCatCor)
    setNewCat("")
    setNewCatCor(COR_OPTIONS[0].value)
  }

  function handleSaveUser(e: React.FormEvent) {
    e.preventDefault()
    store.updateUsuario({ nome: nomeEdit, email: emailEdit })
    setUserSaved(true)
    setTimeout(() => setUserSaved(false), 2000)
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-8">

      {/* ── Seção: Níveis de Criticidade ─────────────────────────── */}
      <section>
        <div className="mb-4">
          <h2 className="text-base font-bold text-foreground">Níveis de criticidade</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Entenda como o Stockly calcula automaticamente o nível de cada produto.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CRITICIDADE_ORDER.map((key) => {
            const cfg = criticidadeConfig[key]
            const Icon = CRITICIDADE_ICONS[key]
            const desc = CRITICIDADE_DESC[key]
            return (
              <div
                key={key}
                className={`rounded-2xl border p-5 flex flex-col gap-3 ${cfg.bgClass} ${cfg.borderClass}`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`w-5 h-5 ${cfg.textClass}`} />
                  <span className={`text-sm font-bold ${cfg.textClass}`}>{cfg.label}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full flex-none ${cfg.dotClass}`} />
                    <span className={`text-xs font-semibold ${cfg.textClass}`}>{desc.threshold}</span>
                  </div>
                  <p className="text-xs text-muted-foreground pl-3.5">{desc.example}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className={`mt-4 rounded-2xl border border-border bg-muted/30 p-4 flex items-start gap-3`}>
          <Info className="w-4 h-4 text-muted-foreground flex-none mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            A criticidade é calculada automaticamente sempre que você atualiza a quantidade de um produto.
            Não é possível definir manualmente — ela reflete o estado real do seu estoque.
          </p>
        </div>
      </section>

      {/* ── Seção: Categorias ────────────────────────────────────── */}
      <section>
        <div className="mb-4">
          <h2 className="text-base font-bold text-foreground">Categorias</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Organize seus produtos por categorias personalizadas.
          </p>
        </div>

        {/* Formulário adicionar */}
        <form
          onSubmit={handleAddCat}
          className="flex items-end gap-3 bg-card border border-border rounded-2xl px-5 py-4 mb-4"
        >
          <div className="flex flex-col gap-1.5 flex-1 min-w-0">
            <Label htmlFor="cat-nome">Nova categoria</Label>
            <Input
              id="cat-nome"
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              placeholder="Ex: Congelados, Snacks..."
              className="h-10 rounded-xl"
            />
          </div>
          {/* Color picker */}
          <div className="flex flex-col gap-1.5 flex-none">
            <Label>Cor</Label>
            <div className="flex gap-1 flex-wrap h-10 items-center">
              {COR_OPTIONS.map((c) => (
                <button
                  type="button"
                  key={c.value}
                  onClick={() => setNewCatCor(c.value)}
                  className="w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center"
                  style={{
                    backgroundColor: c.value,
                    borderColor: newCatCor === c.value ? "oklch(0.18 0.04 250)" : "transparent",
                  }}
                  title={c.label}
                  aria-label={c.label}
                >
                  {newCatCor === c.value && <Check className="w-3 h-3 text-white" />}
                </button>
              ))}
            </div>
          </div>
          <Button
            type="submit"
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl flex items-center gap-1.5 h-10 flex-none"
          >
            <Plus className="w-3.5 h-3.5" />
            Adicionar
          </Button>
        </form>

        {/* Lista de categorias */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          {store.categorias.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm text-muted-foreground">Nenhuma categoria cadastrada.</p>
            </div>
          ) : (
            <ul className="flex flex-col">
              {store.categorias.map((cat) => (
                <li
                  key={cat.id}
                  className="flex items-center gap-3 px-5 py-3.5 border-b border-border last:border-0 group"
                >
                  {editCatId === cat.id ? (
                    <>
                      <span
                        className="w-3 h-3 rounded-full flex-none"
                        style={{ backgroundColor: cat.cor }}
                      />
                      <Input
                        value={editCatNome}
                        onChange={(e) => setEditCatNome(e.target.value)}
                        className="h-8 rounded-lg flex-1 text-sm"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Escape") setEditCatId(null)
                        }}
                      />
                      <button
                        onClick={() => {
                          if (editCatNome.trim()) {
                            store.updateCategoria(cat.id, editCatNome.trim())
                          }
                          setEditCatId(null)
                        }}
                        className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        aria-label="Confirmar"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setEditCatId(null)}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
                        aria-label="Cancelar"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <span
                        className="w-3 h-3 rounded-full flex-none"
                        style={{ backgroundColor: cat.cor }}
                      />
                      <span className="text-sm font-medium text-foreground flex-1">{cat.nome}</span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => { setEditCatId(cat.id); setEditCatNome(cat.nome) }}
                          className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                          aria-label="Editar"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => store.deleteCategoria(cat.id)}
                          className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                          aria-label="Excluir"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* ── Seção: Perfil ─────────────────────────────────────────── */}
      <section>
        <div className="mb-4">
          <h2 className="text-base font-bold text-foreground">Meu perfil</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Atualize suas informações pessoais.
          </p>
        </div>

        <form
          onSubmit={handleSaveUser}
          className="bg-card border border-border rounded-2xl px-5 py-5 flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="u-nome">Nome</Label>
            <Input
              id="u-nome"
              value={nomeEdit}
              onChange={(e) => setNomeEdit(e.target.value)}
              className="h-10 rounded-xl"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="u-email">E-mail</Label>
            <Input
              id="u-email"
              type="email"
              value={emailEdit}
              onChange={(e) => setEmailEdit(e.target.value)}
              className="h-10 rounded-xl"
              required
            />
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="submit"
              className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
            >
              {userSaved ? "Salvo!" : "Salvar alterações"}
            </Button>
            {userSaved && <Check className="w-4 h-4 text-primary" />}
          </div>
        </form>
      </section>

      {/* ── Seção: Dados ─────────────────────────────────────────── */}
      <section>
        <div className="mb-4">
          <h2 className="text-base font-bold text-foreground">Dados</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gerencie os dados armazenados localmente no seu dispositivo.
          </p>
        </div>
        <div className="bg-card border border-border rounded-2xl px-5 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-foreground">Redefinir todos os dados</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Remove todos os produtos, lista de compras e categorias. Esta ação não pode ser desfeita.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-destructive/40 text-destructive hover:bg-destructive/10 flex-none"
              onClick={() => {
                if (confirm("Tem certeza? Todos os dados serão apagados.")) {
                  localStorage.clear()
                  window.location.reload()
                }
              }}
            >
              Redefinir
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
