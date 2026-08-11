'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSession } from 'next-auth/react'
import { createPortal } from 'react-dom'
import {
  Package, FileText, Tag, MapPin, X, UserCheck,
  SlidersHorizontal, AlertTriangle, CheckCircle,
  XCircle, Clock, Banknote, Search, ChevronDown,
  Pencil, Trash2, ArrowUpDown, ArrowUp, ArrowDown,
  Plus,
  type LucideIcon,
} from 'lucide-react'

type Estado = 'Novo' | 'Excelente' | 'Ruim' 
type FilterEstado = 'Todos' | Estado
type SortBy = 'placa' | 'codigo' | 'valor'
type SortDir = 'asc' | 'desc'

interface Produto {
  _id: string
  placa: number
  codigo: number
  descricao: string
  notaFiscal: number
  estado: Estado
  valor: number
  localizacao: string
  obs?: string | null
}

const estadoStyles: Record<
  Estado,
  { bg: string; borderIdle: string; borderHover: string; text: string; pillBg: string; pillText: string; shadowHover: string }
> = {
  Novo: {
    bg: 'from-indigo-50/70 to-white',
    borderIdle: 'border-blue-100',
    borderHover: 'hover:border-blue-400',
    text: 'text-teal-700',
    pillBg: 'bg-blue-100',
    pillText: 'text-blue-700',
    shadowHover: 'hover:shadow-blue-100/60',
  },
  Excelente: {
    bg: 'from-teal-50/70 to-white',
    borderIdle: 'border-teal-100',
    borderHover: 'hover:border-teal-400',
    text: 'text-teal-700',
    pillBg: 'bg-teal-100',
    pillText: 'text-teal-700',
    shadowHover: 'hover:shadow-teal-100/60',
  },
  Ruim: {
    bg: 'from-rose-50/70 to-white',
    borderIdle: 'border-rose-100',
    borderHover: 'hover:border-rose-400',
    text: 'text-rose-700',
    pillBg: 'bg-rose-100',
    pillText: 'text-rose-700',
    shadowHover: 'hover:shadow-rose-100/60',
  }
}

function formatValor(valor: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
}

const ESTADO_OPTIONS: FilterEstado[] = [
  'Todos', 'Novo', 'Excelente', 'Ruim'
]

export default function ProdutosGrid() {
  const { data: session } = useSession()
  const isAdmin = (session?.user as any)?.role === 'admin'

  const [produtos, setProdutos]           = useState<Produto[]>([])
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState<string | null>(null)
  const [activeFilter, setActiveFilter]   = useState<FilterEstado>('Todos')
  const [dropdownOpen, setDropdownOpen]   = useState(false)
  const [search, setSearch]               = useState('')
  const [selected, setSelected]           = useState<Produto | null>(null)
  const [editingProduto, setEditingProduto] = useState<Produto | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [sortBy, setSortBy]               = useState<SortBy>('placa')
  const [sortDir, setSortDir]             = useState<SortDir>('asc')
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false)

  useEffect(() => {
    fetch('/api/produtos')
      .then((res) => { if (!res.ok) throw new Error(`Erro ${res.status}`); return res.json() })
      .then((data: Produto[]) => setProdutos([...data].sort((a, b) => a.codigo - b.codigo)))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!selected && !editingProduto) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setSelected(null); setEditingProduto(null) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [selected, editingProduto])

  useEffect(() => {
    document.body.style.overflow = selected || editingProduto ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [selected, editingProduto])

  useEffect(() => {
    if (!dropdownOpen) return
    const handler = () => setDropdownOpen(false)
    window.addEventListener('click', handler)
    return () => window.removeEventListener('click', handler)
  }, [dropdownOpen])

  useEffect(() => {
    if (!sortDropdownOpen) return
    const handler = () => setSortDropdownOpen(false)
    window.addEventListener('click', handler)
    return () => window.removeEventListener('click', handler)
  }, [sortDropdownOpen])

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (!confirm('Tem certeza que deseja excluir este produto do banco de dados?')) return
    try {
      setActionLoading(true)
      const res = await fetch(`/api/produtos/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Falha ao excluir o item.')
      setProdutos((prev) => prev.filter((p) => p._id !== id))
      if (selected?._id === id) setSelected(null)
    } catch (err: any) {
      alert(err.message || 'Erro ao excluir produto.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleEditOpen = (e: React.MouseEvent, produto: Produto) => {
    e.stopPropagation()
    setEditingProduto({ ...produto })
  }

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduto) return
    try {
      setActionLoading(true)
      const res = await fetch(`/api/produtos/${editingProduto._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduto),
      })
      if (!res.ok) throw new Error('Falha ao atualizar o produto.')
      const updated = await res.json()
      setProdutos((prev) => prev.map((p) => (p._id === updated._id ? updated : p)))
      setEditingProduto(null)
      if (selected?._id === updated._id) setSelected(updated)
    } catch (err: any) {
      alert(err.message || 'Erro ao atualizar produto.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleSortByChange = (key: SortBy) => {
    setSortBy(key)
    setSortDropdownOpen(false)
  }

  const toggleSortDir = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
  }

  const SORT_LABELS: Record<SortBy, string> = { placa: 'Placa', codigo: 'Código', valor: 'Preço' }

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    const result = produtos.filter((p) => {
      const matchEstado = activeFilter === 'Todos' || p.estado === activeFilter
      const matchSearch =
        !q ||
        p.descricao.toLowerCase().includes(q) ||
        String(p.codigo).includes(q) ||
        String(p.placa).includes(q) ||
        p.localizacao.toLowerCase().includes(q) ||
        (p.obs ?? '').toLowerCase().includes(q)
      return matchEstado && matchSearch
    })
    return [...result].sort((a, b) => {
      const valA = a[sortBy] ?? 0
      const valB = b[sortBy] ?? 0
      const cmp = valA > valB ? 1 : valA < valB ? -1 : 0
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [produtos, activeFilter, search, sortBy, sortDir])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400 gap-3">
        <Clock size={20} className="animate-spin" />
        <span className="text-sm font-medium">Carregando produtos…</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-24 text-rose-500 gap-3">
        <AlertTriangle size={20} />
        <span className="text-sm font-medium">Erro ao carregar produtos: {error}</span>
      </div>
    )
  }

  const SortDirIcon = sortDir === 'asc' ? ArrowUp : ArrowDown

  return (
    <>
      {/* Linha 1: busca + ordenação + botão novo item (só admin) */}
      <div className="flex items-center gap-3 mb-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por descrição, código, placa ou localização…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-cello-800/30 focus:border-cello-800 placeholder:text-gray-400 transition"
          />
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Dropdown: critério de ordenação */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSortDropdownOpen((o) => !o)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border border-gray-200 bg-white shadow-sm hover:border-cello-800 transition text-gray-700 min-w-[148px] justify-between"
            >
              <span className="flex items-center gap-2">
                <ArrowUpDown size={14} className="text-gray-400" />
                {SORT_LABELS[sortBy]}
              </span>
              <ChevronDown size={14} className={`text-gray-400 transition-transform ${sortDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {sortDropdownOpen && (
              <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-100 rounded-xl shadow-lg z-20 py-1 overflow-hidden">
                {(Object.entries(SORT_LABELS) as [SortBy, string][]).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => handleSortByChange(key)}
                    className={`w-full text-left px-4 py-2 text-sm transition ${
                      sortBy === key ? 'bg-cello-800 text-white font-semibold' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Botão de direção */}
          <button
            onClick={toggleSortDir}
            title={sortDir === 'asc' ? 'Ordem crescente' : 'Ordem decrescente'}
            className={`p-2 rounded-xl border shadow-sm transition text-sm font-semibold flex items-center gap-1.5 ${
              sortDir === 'asc'
                ? 'border-gray-200 bg-white text-gray-600 hover:border-cello-800 hover:text-cello-800'
                : 'border-cello-800 bg-cello-800 text-white hover:bg-cello-900'
            }`}
          >
            <SortDirIcon size={15} />
            <span className="text-xs hidden sm:inline">
              {sortDir === 'asc' ? 'Crescente' : 'Decrescente'}
            </span>
          </button>

          {/* Botão "Novo Item" — visível apenas para admin */}
          {isAdmin && (
            <a
              href="/novoItem"
              className="flex items-center gap-1.5 px-4 py-2 bg-cello-800 hover:bg-cello-700 text-white text-sm font-bold rounded-xl transition shadow-sm"
            >
              <Plus size={15} />
              <span className="hidden sm:inline">Novo Item</span>
            </a>
          )}
        </div>
      </div>

      {/* Linha 2: filtros de estado */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <SlidersHorizontal size={13} className="text-gray-400 flex-shrink-0" />
        {ESTADO_OPTIONS.map((op) => (
          <button
            key={op}
            onClick={() => setActiveFilter(op)}
            className={`text-xs font-semibold px-3 py-1 rounded-full border transition ${
              activeFilter === op
                ? 'bg-cello-800 text-white border-cello-800'
                : 'bg-white text-gray-600 border-gray-200 hover:border-cello-800 hover:text-cello-800'
            }`}
          >
            {op}
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-400 mb-4">
        {filtered.length} item{filtered.length !== 1 ? 'ns' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
      </p>

      {filtered.length === 0 ? (
        <p className="text-center text-gray-400 py-16 text-sm">Nenhum produto encontrado.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((produto) => {
            const s = estadoStyles[produto.estado]
            return (
              <div key={produto._id}>
                <article
                  onClick={() => setSelected(produto)}
                  className={`
                    flex items-center gap-4 px-5 py-4
                    bg-gradient-to-r ${s.bg}
                    border ${s.borderIdle} ${s.borderHover}
                    rounded-2xl shadow-sm hover:shadow-md ${s.shadowHover}
                    transition-all duration-200 hover:-translate-y-0.5
                    cursor-pointer
                  `}
                >
                  <div className="p-2.5 rounded-xl bg-cello-800 flex-shrink-0">
                    <Package size={20} className="text-cyan-300" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className={`block text-[10px] font-bold uppercase tracking-widest ${s.text}`}>
                      #{produto.codigo} · Placa {produto.placa}
                    </span>
                    <h3 className="mt-0.5 text-gray-800 font-bold text-sm leading-snug truncate">
                      {produto.descricao}
                    </h3>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.pillBg} ${s.pillText}`}>
                        {produto.estado}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 flex items-center gap-1">
                        <MapPin size={9} />
                        {produto.localizacao}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span className="text-base font-black text-green-700">
                      {formatValor(produto.valor)}
                    </span>

                    {/* Botões de edição/exclusão — visíveis apenas para admin */}
                    {isAdmin && (
                      <div className="flex items-center gap-1.5 border-l pl-3 border-gray-200">
                        <button
                          onClick={(e) => handleEditOpen(e, produto)}
                          disabled={actionLoading}
                          title="Editar produto"
                          className="p-1.5 rounded-lg text-gray-500 hover:text-amber-600 hover:bg-amber-50 transition"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={(e) => handleDelete(e, produto._id)}
                          disabled={actionLoading}
                          title="Excluir produto"
                          className="p-1.5 rounded-lg text-gray-500 hover:text-rose-600 hover:bg-rose-50 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal Detalhes */}
      {selected &&
        createPortal(
          (() => {
            const p = selected
            const s = estadoStyles[p.estado]
            return (
              <div
                className="fixed inset-0 z-[45] flex items-center justify-center p-4 backdrop-blur-md bg-white/10"
                onClick={() => setSelected(null)}
              >
                <div
                  role="dialog"
                  aria-modal="true"
                  aria-label={p.descricao}
                  className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className={`sticky top-0 z-10 flex items-start gap-4 p-6 pb-4 bg-gradient-to-br ${s.bg} border-b ${s.borderIdle} rounded-t-2xl`}>
                    <div className="p-3 rounded-xl bg-cello-800 flex-shrink-0">
                      <Package size={24} className="text-cyan-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`block text-[10px] font-bold uppercase tracking-widest ${s.text}`}>
                        Código #{p.codigo} · Placa {p.placa}
                      </span>
                      <h2 className="mt-0.5 text-gray-800 font-black text-xl leading-snug">{p.descricao}</h2>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${s.pillBg} ${s.pillText}`}>
                          {p.estado}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelected(null)}
                      aria-label="Fechar"
                      className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-white/70 hover:bg-gray-100 text-gray-500 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="p-6 flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className={`flex items-start gap-3 p-3.5 rounded-xl ${s.pillBg}`}>
                        <FileText size={16} className={`mt-0.5 flex-shrink-0 ${s.pillText}`} />
                        <div>
                          <span className={`text-[10px] font-bold uppercase tracking-wide ${s.pillText}`}>Nota Fiscal</span>
                          <p className={`mt-0.5 text-sm font-semibold ${s.pillText}`}>#{p.notaFiscal}</p>
                        </div>
                      </div>
                      <div className={`flex items-start gap-3 p-3.5 rounded-xl ${s.pillBg}`}>
                        <Banknote size={16} className={`mt-0.5 flex-shrink-0 ${s.pillText}`} />
                        <div>
                          <span className={`text-[10px] font-bold uppercase tracking-wide ${s.pillText}`}>Valor</span>
                          <p className={`mt-0.5 text-sm font-semibold ${s.pillText}`}>{formatValor(p.valor)}</p>
                        </div>
                      </div>
                      <div className={`flex items-start gap-3 p-3.5 rounded-xl ${s.pillBg}`}>
                        <Tag size={16} className={`mt-0.5 flex-shrink-0 ${s.pillText}`} />
                        <div>
                          <span className={`text-[10px] font-bold uppercase tracking-wide ${s.pillText}`}>Código</span>
                          <p className={`mt-0.5 text-sm font-semibold ${s.pillText}`}>{p.codigo}</p>
                        </div>
                      </div>
                      <div className={`flex items-start gap-3 p-3.5 rounded-xl ${s.pillBg}`}>
                        <MapPin size={16} className={`mt-0.5 flex-shrink-0 ${s.pillText}`} />
                        <div>
                          <span className={`text-[10px] font-bold uppercase tracking-wide ${s.pillText}`}>Localização</span>
                          <p className={`mt-0.5 text-sm font-semibold ${s.pillText}`}>{p.localizacao}</p>
                        </div>
                      </div>
                    </div>
                    <div className={`flex items-start gap-3 p-3.5 rounded-xl ${s.pillBg}`}>
                      <UserCheck size={16} className={`mt-0.5 flex-shrink-0 ${s.pillText}`} />
                      <div>
                        <span className={`text-[10px] font-bold uppercase tracking-wide ${s.pillText}`}>Observação</span>
                        <p className={`mt-0.5 text-sm ${s.pillText}`}>{p.obs ?? 'Nenhuma observação registrada.'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })(),
          document.body
        )}

      {/* Modal Edição — apenas admin consegue abrir (botão está oculto para viewer) */}
      {editingProduto && isAdmin &&
        createPortal(
          <div
            className="fixed inset-0 z-[50] flex items-center justify-center p-4 backdrop-blur-md bg-black/40"
            onClick={() => setEditingProduto(null)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4 pb-2 border-b">
                <h3 className="text-lg font-bold text-gray-800">Editar Produto</h3>
                <button onClick={() => setEditingProduto(null)} className="text-gray-400 hover:text-gray-600 p-1">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Descrição</label>
                  <input
                    type="text"
                    value={editingProduto.descricao}
                    onChange={(e) => setEditingProduto({ ...editingProduto, descricao: e.target.value })}
                    className="w-full border rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-cello-800/30 focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Placa</label>
                    <input
                      type="number"
                      value={editingProduto.placa}
                      onChange={(e) => setEditingProduto({ ...editingProduto, placa: Number(e.target.value) })}
                      className="w-full border rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-cello-800/30 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Código</label>
                    <input
                      type="number"
                      value={editingProduto.codigo}
                      onChange={(e) => setEditingProduto({ ...editingProduto, codigo: Number(e.target.value) })}
                      className="w-full border rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-cello-800/30 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Valor (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingProduto.valor}
                      onChange={(e) => setEditingProduto({ ...editingProduto, valor: parseFloat(e.target.value) || 0 })}
                      className="w-full border rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-cello-800/30 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Nota Fiscal</label>
                    <input
                      type="number"
                      value={editingProduto.notaFiscal}
                      onChange={(e) => setEditingProduto({ ...editingProduto, notaFiscal: Number(e.target.value) })}
                      className="w-full border rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-cello-800/30 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Estado</label>
                  <select
                    value={editingProduto.estado}
                    onChange={(e) => setEditingProduto({ ...editingProduto, estado: e.target.value as Estado })}
                    className="w-full border rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-cello-800/30 focus:outline-none"
                  >
                    <option value="Novo">Novo</option>
                    <option value="Excelente">Excelente</option>
                    <option value="Ruim">Ruim</option>
                    <option value="Quebrado com Concerto">Quebrado com Concerto</option>
                    <option value="Quebrado sem Concerto">Quebrado sem Concerto</option>
                    <option value="Não Informado">Não Informado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Localização</label>
                  <input
                    type="text"
                    value={editingProduto.localizacao}
                    onChange={(e) => setEditingProduto({ ...editingProduto, localizacao: e.target.value })}
                    className="w-full border rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-cello-800/30 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Observação</label>
                  <textarea
                    value={editingProduto.obs ?? ''}
                    onChange={(e) => setEditingProduto({ ...editingProduto, obs: e.target.value || null })}
                    className="w-full border rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-cello-800/30 focus:outline-none"
                    rows={2}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t">
                  <button
                    type="button"
                    onClick={() => setEditingProduto(null)}
                    className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-4 py-2 bg-cello-800 hover:bg-cello-900 text-white font-semibold rounded-xl transition disabled:opacity-50"
                  >
                    Salvar Alterações
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}