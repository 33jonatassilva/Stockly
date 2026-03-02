"use client"

import { useState, useEffect, useCallback } from "react"
import type {
  Produto, ItemLista, Categoria, Usuario, StoreData,
  Criticidade, Casa, Membro, Despesa, DespesaCategoria, MembroRole,
} from "./types"

// ─── Seed data ─────────────────────────────────────────────────────────────
const categoriasSeed: Categoria[] = [
  { id: "c1", nome: "Higiene & Limpeza", cor: "#3b82f6" },
  { id: "c2", nome: "Alimentos", cor: "#f59e0b" },
  { id: "c3", nome: "Bebidas", cor: "#06b6d4" },
  { id: "c4", nome: "Laticínios", cor: "#8b5cf6" },
  { id: "c5", nome: "Hortifruti", cor: "#22c55e" },
  { id: "c6", nome: "Carnes", cor: "#ef4444" },
]

const membrosSeed: Membro[] = [
  { id: "m1", nome: "Você", email: "usuario@stockly.com", role: "admin", entrou: "2025-01-15T10:00:00Z" },
  { id: "m2", nome: "Ana Silva", email: "ana@email.com", role: "membro", entrou: "2025-01-20T14:00:00Z" },
  { id: "m3", nome: "Carlos Souza", email: "carlos@email.com", role: "membro", entrou: "2025-02-01T09:00:00Z" },
]

const casaSeed: Casa = {
  id: "casa1",
  nome: "Apartamento Centro",
  codigo: "STOCK-7K2M",
  criadaEm: "2025-01-15T10:00:00Z",
  membros: membrosSeed,
}

const despesasSeed: Despesa[] = [
  { id: "d1", descricao: "Compra semanal no mercado", valor: 187.40, categoria: "mercado", data: "2025-02-22", membroId: "m1", membroNome: "Você", criadoEm: "2025-02-22T18:00:00Z" },
  { id: "d2", descricao: "Feira do sábado", valor: 62.50, categoria: "feira", data: "2025-02-22", membroId: "m2", membroNome: "Ana Silva", criadoEm: "2025-02-22T12:00:00Z" },
  { id: "d3", descricao: "Produtos de limpeza", valor: 45.80, categoria: "limpeza", data: "2025-02-18", membroId: "m3", membroNome: "Carlos Souza", criadoEm: "2025-02-18T16:00:00Z" },
  { id: "d4", descricao: "Compra rápida - leite e pão", valor: 22.90, categoria: "mercado", data: "2025-02-15", membroId: "m1", membroNome: "Você", criadoEm: "2025-02-15T08:00:00Z" },
  { id: "d5", descricao: "Shampoo e condicionador", valor: 38.70, categoria: "higiene", data: "2025-02-12", membroId: "m2", membroNome: "Ana Silva", criadoEm: "2025-02-12T19:00:00Z" },
  { id: "d6", descricao: "Compra mensal grande", valor: 412.30, categoria: "mercado", data: "2025-02-01", membroId: "m1", membroNome: "Você", criadoEm: "2025-02-01T17:00:00Z" },
  { id: "d7", descricao: "Frutas e verduras", valor: 55.20, categoria: "feira", data: "2025-02-08", membroId: "m3", membroNome: "Carlos Souza", criadoEm: "2025-02-08T11:00:00Z" },
  { id: "d8", descricao: "Carne para churrasco", valor: 89.90, categoria: "mercado", data: "2025-02-15", membroId: "m2", membroNome: "Ana Silva", criadoEm: "2025-02-15T10:00:00Z" },
  { id: "d9", descricao: "Compra emergencial", valor: 34.50, categoria: "mercado", data: "2025-01-28", membroId: "m1", membroNome: "Você", criadoEm: "2025-01-28T20:00:00Z" },
  { id: "d10", descricao: "Material de limpeza mensal", valor: 78.60, categoria: "limpeza", data: "2025-01-25", membroId: "m3", membroNome: "Carlos Souza", criadoEm: "2025-01-25T15:00:00Z" },
]

const produtosSeed: Produto[] = [
  { id: "p1",  nome: "Sabão em Pó",       categoria: "Higiene & Limpeza", quantidade: 1,  quantidadeMinima: 2,  unidade: "kg",  criticidade: "urgente",  preco: 12.90, criadoEm: "2025-02-01T10:00:00Z", atualizadoEm: "2025-02-20T10:00:00Z" },
  { id: "p2",  nome: "Arroz",              categoria: "Alimentos",          quantidade: 2,  quantidadeMinima: 5,  unidade: "kg",  criticidade: "urgente",  preco: 29.90, criadoEm: "2025-02-01T10:00:00Z", atualizadoEm: "2025-02-18T10:00:00Z" },
  { id: "p3",  nome: "Feijão Carioca",     categoria: "Alimentos",          quantidade: 1,  quantidadeMinima: 3,  unidade: "kg",  criticidade: "critico",  preco: 10.50, criadoEm: "2025-02-01T10:00:00Z", atualizadoEm: "2025-02-22T10:00:00Z" },
  { id: "p4",  nome: "Leite Integral",     categoria: "Laticínios",         quantidade: 4,  quantidadeMinima: 6,  unidade: "l",   criticidade: "atencao",  preco: 7.90,  criadoEm: "2025-02-01T10:00:00Z", atualizadoEm: "2025-02-21T10:00:00Z" },
  { id: "p5",  nome: "Café Moído",         categoria: "Alimentos",          quantidade: 2,  quantidadeMinima: 2,  unidade: "pct", criticidade: "normal",   preco: 18.90, criadoEm: "2025-02-01T10:00:00Z", atualizadoEm: "2025-02-15T10:00:00Z" },
  { id: "p6",  nome: "Shampoo",            categoria: "Higiene & Limpeza", quantidade: 0,  quantidadeMinima: 1,  unidade: "un",  criticidade: "critico",  preco: 15.50, criadoEm: "2025-02-01T10:00:00Z", atualizadoEm: "2025-02-23T10:00:00Z" },
  { id: "p7",  nome: "Macarrão Espaguete", categoria: "Alimentos",          quantidade: 5,  quantidadeMinima: 3,  unidade: "pct", criticidade: "normal",   preco: 4.50,  criadoEm: "2025-02-01T10:00:00Z", atualizadoEm: "2025-02-10T10:00:00Z" },
  { id: "p8",  nome: "Azeite Extra Virgem",categoria: "Alimentos",          quantidade: 1,  quantidadeMinima: 2,  unidade: "l",   criticidade: "atencao",  preco: 34.90, criadoEm: "2025-02-01T10:00:00Z", atualizadoEm: "2025-02-19T10:00:00Z" },
  { id: "p9",  nome: "Água Mineral",       categoria: "Bebidas",            quantidade: 6,  quantidadeMinima: 12, unidade: "l",   criticidade: "urgente",  preco: 3.50,  criadoEm: "2025-02-01T10:00:00Z", atualizadoEm: "2025-02-20T10:00:00Z" },
  { id: "p10", nome: "Tomate",             categoria: "Hortifruti",         quantidade: 0,  quantidadeMinima: 1,  unidade: "kg",  criticidade: "critico",  preco: 8.90,  criadoEm: "2025-02-01T10:00:00Z", atualizadoEm: "2025-02-24T10:00:00Z" },
  { id: "p11", nome: "Frango Inteiro",     categoria: "Carnes",             quantidade: 2,  quantidadeMinima: 2,  unidade: "kg",  criticidade: "normal",   preco: 14.90, criadoEm: "2025-02-01T10:00:00Z", atualizadoEm: "2025-02-17T10:00:00Z" },
  { id: "p12", nome: "Papel Higiênico",    categoria: "Higiene & Limpeza", quantidade: 2,  quantidadeMinima: 4,  unidade: "pct", criticidade: "atencao",  preco: 22.90, criadoEm: "2025-02-01T10:00:00Z", atualizadoEm: "2025-02-22T10:00:00Z" },
]

// ─── Helpers ────────────────────────────────────────────────────────────────
function calcCriticidade(qtd: number, min: number): Criticidade {
  if (qtd === 0) return "critico"
  const ratio = qtd / min
  if (ratio <= 0.3) return "critico"
  if (ratio <= 0.6) return "urgente"
  if (ratio <= 1.0) return "atencao"
  return "normal"
}

function gerarListaAutomatica(produtos: Produto[]): ItemLista[] {
  return produtos
    .filter((p) => p.criticidade !== "normal")
    .map((p) => ({
      id: `lista-${p.id}`,
      produtoId: p.id,
      nome: p.nome,
      quantidade: p.quantidadeMinima - p.quantidade > 0 ? p.quantidadeMinima - p.quantidade : 1,
      unidade: p.unidade,
      comprado: false,
      preco: p.preco,
      categoria: p.categoria,
      criadoEm: new Date().toISOString(),
    }))
}

// ─── Default state ──────────────────────────────────────────────────────────
function getDefaultData(): StoreData {
  const lista = gerarListaAutomatica(produtosSeed)
  return {
    usuario: { nome: "Usuário Stockly", email: "usuario@stockly.com" },
    produtos: produtosSeed,
    lista,
    categorias: categoriasSeed,
    casa: casaSeed,
    despesas: despesasSeed,
  }
}

const STORAGE_KEY = "stockly_data"

function loadData(): StoreData {
  if (typeof window === "undefined") return getDefaultData()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return getDefaultData()
    const parsed = JSON.parse(raw) as StoreData
    // Migrate: ensure new fields exist for users with old data
    if (!parsed.casa) parsed.casa = casaSeed
    if (!parsed.despesas) parsed.despesas = despesasSeed
    return parsed
  } catch {
    return getDefaultData()
  }
}

function saveData(data: StoreData) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useStore() {
  const [data, setData] = useState<StoreData>(getDefaultData)

  useEffect(() => {
    setData(loadData())
  }, [])

  const persist = useCallback((next: StoreData) => {
    setData(next)
    saveData(next)
  }, [])

  // ── Produtos ──────────────────────────────────────────────────────────────
  const addProduto = useCallback(
    (produto: Omit<Produto, "id" | "criticidade" | "criadoEm" | "atualizadoEm">) => {
      const now = new Date().toISOString()
      const novo: Produto = {
        ...produto,
        id: crypto.randomUUID(),
        criticidade: calcCriticidade(produto.quantidade, produto.quantidadeMinima),
        criadoEm: now,
        atualizadoEm: now,
      }
      persist({ ...data, produtos: [...data.produtos, novo] })
    },
    [data, persist]
  )

  const updateProduto = useCallback(
    (id: string, updates: Partial<Omit<Produto, "id" | "criadoEm">>) => {
      const produtos = data.produtos.map((p) => {
        if (p.id !== id) return p
        const merged = { ...p, ...updates, atualizadoEm: new Date().toISOString() }
        merged.criticidade = calcCriticidade(merged.quantidade, merged.quantidadeMinima)
        return merged
      })
      persist({ ...data, produtos })
    },
    [data, persist]
  )

  const deleteProduto = useCallback(
    (id: string) => {
      persist({
        ...data,
        produtos: data.produtos.filter((p) => p.id !== id),
        lista: data.lista.filter((l) => l.produtoId !== id),
      })
    },
    [data, persist]
  )

  // ── Lista ─────────────────────────────────────────────────────────────────
  const addItemLista = useCallback(
    (item: Omit<ItemLista, "id" | "criadoEm">) => {
      const novo: ItemLista = {
        ...item,
        id: crypto.randomUUID(),
        criadoEm: new Date().toISOString(),
      }
      persist({ ...data, lista: [...data.lista, novo] })
    },
    [data, persist]
  )

  const toggleItemLista = useCallback(
    (id: string) => {
      const lista = data.lista.map((i) =>
        i.id === id ? { ...i, comprado: !i.comprado } : i
      )
      persist({ ...data, lista })
    },
    [data, persist]
  )

  const deleteItemLista = useCallback(
    (id: string) => {
      persist({ ...data, lista: data.lista.filter((i) => i.id !== id) })
    },
    [data, persist]
  )

  const limparComprados = useCallback(() => {
    persist({ ...data, lista: data.lista.filter((i) => !i.comprado) })
  }, [data, persist])

  const gerarLista = useCallback(() => {
    const autoItems = gerarListaAutomatica(data.produtos)
    const manuais = data.lista.filter((i) => !i.produtoId)
    persist({ ...data, lista: [...autoItems, ...manuais] })
  }, [data, persist])

  // ── Categorias ────────────────────────────────────────────────────────────
  const addCategoria = useCallback(
    (nome: string, cor: string) => {
      const nova: Categoria = { id: crypto.randomUUID(), nome, cor }
      persist({ ...data, categorias: [...data.categorias, nova] })
    },
    [data, persist]
  )

  const updateCategoria = useCallback(
    (id: string, nome: string) => {
      const categorias = data.categorias.map((c) =>
        c.id === id ? { ...c, nome } : c
      )
      persist({ ...data, categorias })
    },
    [data, persist]
  )

  const deleteCategoria = useCallback(
    (id: string) => {
      persist({ ...data, categorias: data.categorias.filter((c) => c.id !== id) })
    },
    [data, persist]
  )

  // ── Usuário ───────────────────────────────────────────────────────────────
  const updateUsuario = useCallback(
    (updates: Partial<Usuario>) => {
      persist({ ...data, usuario: { ...data.usuario, ...updates } })
    },
    [data, persist]
  )

  // ── Casa ──────────────────────────────────────────────────────────────────
  const updateCasa = useCallback(
    (updates: Partial<Pick<Casa, "nome">>) => {
      persist({ ...data, casa: { ...data.casa, ...updates } })
    },
    [data, persist]
  )

  const addMembro = useCallback(
    (nome: string, email: string, role: MembroRole = "membro") => {
      const novo: Membro = {
        id: crypto.randomUUID(),
        nome,
        email,
        role,
        entrou: new Date().toISOString(),
      }
      persist({
        ...data,
        casa: { ...data.casa, membros: [...data.casa.membros, novo] },
      })
    },
    [data, persist]
  )

  const removeMembro = useCallback(
    (id: string) => {
      persist({
        ...data,
        casa: {
          ...data.casa,
          membros: data.casa.membros.filter((m) => m.id !== id),
        },
      })
    },
    [data, persist]
  )

  const updateMembroRole = useCallback(
    (id: string, role: MembroRole) => {
      const membros = data.casa.membros.map((m) =>
        m.id === id ? { ...m, role } : m
      )
      persist({ ...data, casa: { ...data.casa, membros } })
    },
    [data, persist]
  )

  // ── Despesas ──────────────────────────────────────────────────────────────
  const addDespesa = useCallback(
    (despesa: Omit<Despesa, "id" | "criadoEm">) => {
      const nova: Despesa = {
        ...despesa,
        id: crypto.randomUUID(),
        criadoEm: new Date().toISOString(),
      }
      persist({ ...data, despesas: [nova, ...data.despesas] })
    },
    [data, persist]
  )

  const deleteDespesa = useCallback(
    (id: string) => {
      persist({ ...data, despesas: data.despesas.filter((d) => d.id !== id) })
    },
    [data, persist]
  )

  // ── Stats ─────────────────────────────────────────────────────────────────
  const stats = {
    total: data.produtos.length,
    criticos: data.produtos.filter((p) => p.criticidade === "critico").length,
    urgentes: data.produtos.filter((p) => p.criticidade === "urgente").length,
    atencao: data.produtos.filter((p) => p.criticidade === "atencao").length,
    normais: data.produtos.filter((p) => p.criticidade === "normal").length,
    itensPendentes: data.lista.filter((i) => !i.comprado).length,
    itensComprados: data.lista.filter((i) => i.comprado).length,
    valorEstimado: data.lista
      .filter((i) => !i.comprado && i.preco)
      .reduce((acc, i) => acc + (i.preco ?? 0) * i.quantidade, 0),
    totalDespesasMes: data.despesas
      .filter((d) => {
        const now = new Date()
        const dDate = new Date(d.data)
        return dDate.getMonth() === now.getMonth() && dDate.getFullYear() === now.getFullYear()
      })
      .reduce((acc, d) => acc + d.valor, 0),
    totalMembros: data.casa.membros.length,
  }

  return {
    ...data,
    stats,
    addProduto,
    updateProduto,
    deleteProduto,
    addItemLista,
    toggleItemLista,
    deleteItemLista,
    limparComprados,
    gerarLista,
    addCategoria,
    updateCategoria,
    deleteCategoria,
    updateUsuario,
    updateCasa,
    addMembro,
    removeMembro,
    updateMembroRole,
    addDespesa,
    deleteDespesa,
  }
}

export { calcCriticidade }
