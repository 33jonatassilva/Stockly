export type Criticidade = 'normal' | 'atencao' | 'urgente' | 'critico'
export type Unidade = 'un' | 'kg' | 'g' | 'l' | 'ml' | 'cx' | 'pct' | 'dz'
export type MembroRole = 'admin' | 'membro'
export type DespesaCategoria = 'mercado' | 'feira' | 'limpeza' | 'higiene' | 'outros'

export interface Produto {
  id: string
  nome: string
  categoria: string
  quantidade: number
  quantidadeMinima: number
  unidade: Unidade
  criticidade: Criticidade
  preco?: number
  local?: string
  observacao?: string
  criadoEm: string
  atualizadoEm: string
}

export interface ItemLista {
  id: string
  produtoId?: string
  nome: string
  quantidade: number
  unidade: Unidade
  comprado: boolean
  preco?: number
  categoria?: string
  criadoEm: string
}

export interface Categoria {
  id: string
  nome: string
  cor: string
}

export interface Usuario {
  nome: string
  email: string
  avatar?: string
}

export interface Membro {
  id: string
  nome: string
  email: string
  role: MembroRole
  avatar?: string
  entrou: string
}

export interface Casa {
  id: string
  nome: string
  codigo: string
  criadaEm: string
  membros: Membro[]
}

export interface Despesa {
  id: string
  descricao: string
  valor: number
  categoria: DespesaCategoria
  data: string
  membroId: string
  membroNome: string
  itemListaIds?: string[]
  criadoEm: string
}

export interface ConfigCriticidade {
  normal: { label: string; cor: string; descricao: string }
  atencao: { label: string; cor: string; descricao: string }
  urgente: { label: string; cor: string; descricao: string }
  critico: { label: string; cor: string; descricao: string }
}

export interface StoreData {
  usuario: Usuario
  produtos: Produto[]
  lista: ItemLista[]
  categorias: Categoria[]
  casa: Casa
  despesas: Despesa[]
}
