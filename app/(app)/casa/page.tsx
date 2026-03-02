"use client"

import { useState } from "react"
import {
  Home,
  Users,
  Copy,
  Check,
  Plus,
  Trash2,
  Shield,
  ShieldCheck,
  UserPlus,
  X,
  Pencil,
  Crown,
} from "lucide-react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { MembroRole } from "@/lib/types"

export default function CasaPage() {
  const store = useStore()
  const { casa } = store

  const [copiado, setCopiado] = useState(false)
  const [editandoNome, setEditandoNome] = useState(false)
  const [nomeEdit, setNomeEdit] = useState(casa.nome)
  const [addOpen, setAddOpen] = useState(false)
  const [novoNome, setNovoNome] = useState("")
  const [novoEmail, setNovoEmail] = useState("")
  const [removendoId, setRemovendoId] = useState<string | null>(null)

  function copiarCodigo() {
    navigator.clipboard.writeText(casa.codigo)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  function salvarNome() {
    if (nomeEdit.trim()) {
      store.updateCasa({ nome: nomeEdit.trim() })
    }
    setEditandoNome(false)
  }

  function handleAddMembro(e: React.FormEvent) {
    e.preventDefault()
    if (!novoNome.trim() || !novoEmail.trim()) return
    store.addMembro(novoNome.trim(), novoEmail.trim())
    setNovoNome("")
    setNovoEmail("")
    setAddOpen(false)
  }

  function confirmarRemover(id: string) {
    setRemovendoId(id)
  }

  function handleRemover() {
    if (removendoId) {
      store.removeMembro(removendoId)
      setRemovendoId(null)
    }
  }

  function toggleRole(id: string, currentRole: MembroRole) {
    store.updateMembroRole(id, currentRole === "admin" ? "membro" : "admin")
  }

  const admins = casa.membros.filter((m) => m.role === "admin")
  const membros = casa.membros.filter((m) => m.role === "membro")

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      {/* Card da Casa */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-none">
            <Home className="w-7 h-7 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            {editandoNome ? (
              <div className="flex items-center gap-2">
                <Input
                  value={nomeEdit}
                  onChange={(e) => setNomeEdit(e.target.value)}
                  className="h-9 rounded-xl text-lg font-bold"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") salvarNome()
                    if (e.key === "Escape") setEditandoNome(false)
                  }}
                />
                <button
                  onClick={salvarNome}
                  className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setEditandoNome(false)}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-foreground">{casa.nome}</h2>
                <button
                  onClick={() => { setNomeEdit(casa.nome); setEditandoNome(true) }}
                  className="p-1 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
                  aria-label="Editar nome"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <p className="text-sm text-muted-foreground mt-1">
              {casa.membros.length} membro{casa.membros.length !== 1 ? "s" : ""} na casa
            </p>
          </div>
        </div>

        {/* Codigo de convite */}
        <div className="mt-5 bg-muted/40 rounded-xl p-4 flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
              Codigo de convite
            </p>
            <p className="text-lg font-extrabold text-foreground tracking-wider mt-0.5">
              {casa.codigo}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Compartilhe este codigo para que outros membros entrem na casa.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl gap-1.5 flex-none"
            onClick={copiarCodigo}
          >
            {copiado ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copiado ? "Copiado" : "Copiar"}
          </Button>
        </div>

        {/* Stats da casa */}
        <div className="grid grid-cols-3 gap-3 mt-5">
          <div className="text-center py-3 rounded-xl bg-muted/30">
            <p className="text-xl font-extrabold text-foreground">{casa.membros.length}</p>
            <p className="text-xs text-muted-foreground">Membros</p>
          </div>
          <div className="text-center py-3 rounded-xl bg-muted/30">
            <p className="text-xl font-extrabold text-foreground">{store.stats.total}</p>
            <p className="text-xs text-muted-foreground">Produtos</p>
          </div>
          <div className="text-center py-3 rounded-xl bg-muted/30">
            <p className="text-xl font-extrabold text-foreground">
              R$ {store.despesas.reduce((acc, d) => acc + d.valor, 0).toFixed(0)}
            </p>
            <p className="text-xs text-muted-foreground">Total gasto</p>
          </div>
        </div>
      </div>

      {/* Membros */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              Membros da casa
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Gerencie quem faz parte desta casa.
            </p>
          </div>
          <Button
            size="sm"
            className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5"
            onClick={() => setAddOpen(true)}
          >
            <UserPlus className="w-3.5 h-3.5" />
            Convidar
          </Button>
        </div>

        {/* Admins */}
        {admins.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 px-1">
              Administradores
            </p>
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              {admins.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center gap-3 px-5 py-4 border-b border-border last:border-0 group"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-none">
                    <span className="text-sm font-bold text-primary">
                      {m.nome.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">{m.nome}</p>
                      <Crown className="w-3.5 h-3.5 text-amber-500" />
                    </div>
                    <p className="text-xs text-muted-foreground">{m.email}</p>
                  </div>
                  <span className="text-xs text-primary font-semibold bg-primary/10 px-2.5 py-1 rounded-full">
                    Admin
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Membros */}
        {membros.length > 0 && (
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 px-1">
              Membros
            </p>
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              {membros.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center gap-3 px-5 py-4 border-b border-border last:border-0 group"
                >
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-none">
                    <span className="text-sm font-bold text-muted-foreground">
                      {m.nome.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{m.nome}</p>
                    <p className="text-xs text-muted-foreground">{m.email}</p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => toggleRole(m.id, m.role)}
                      className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      aria-label="Tornar admin"
                      title="Tornar admin"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => confirmarRemover(m.id)}
                      className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                      aria-label="Remover"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Modal adicionar membro */}
      {addOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
            onClick={() => setAddOpen(false)}
          />
          <div className="relative bg-card rounded-2xl border border-border shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-base font-bold text-foreground">Convidar membro</h2>
              <button
                onClick={() => setAddOpen(false)}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddMembro} className="px-5 py-5 flex flex-col gap-4">
              <div className="bg-muted/40 rounded-xl p-3 flex items-start gap-2">
                <Shield className="w-4 h-4 text-muted-foreground flex-none mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  No prototipo, o membro e adicionado diretamente. Em producao, um convite seria enviado por e-mail.
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="m-nome">Nome</Label>
                <Input
                  id="m-nome"
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  placeholder="Nome do membro"
                  required
                  className="h-10 rounded-xl"
                  autoFocus
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="m-email">E-mail</Label>
                <Input
                  id="m-email"
                  type="email"
                  value={novoEmail}
                  onChange={(e) => setNovoEmail(e.target.value)}
                  placeholder="email@exemplo.com"
                  required
                  className="h-10 rounded-xl"
                />
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

      {/* Modal de confirmacao de remocao */}
      {removendoId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={() => setRemovendoId(null)} />
          <div className="relative bg-card rounded-2xl border border-border shadow-xl p-6 w-full max-w-sm">
            <h3 className="text-base font-bold text-foreground mb-2">Remover membro?</h3>
            <p className="text-sm text-muted-foreground mb-5">
              Este membro sera removido da casa e perdera acesso ao estoque e listas compartilhadas.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setRemovendoId(null)}>
                Cancelar
              </Button>
              <Button
                className="flex-1 rounded-xl bg-destructive text-white hover:bg-destructive/90 font-semibold"
                onClick={handleRemover}
              >
                Remover
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
