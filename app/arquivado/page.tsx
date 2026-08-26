"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  Archive,
  FileText,
  Tag,
  MapPin,
  X,
  UserCheck,
  SlidersHorizontal,
  Clock,
  Banknote,
  Search,
  ChevronDown,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Calendar,
  User,
  RotateCcw,
  Loader2,
} from "lucide-react";

type Estado = "Novo" | "Excelente" | "Ruim" | "Não Informado" 
type FilterEstado = "Todos" | Estado;
type SortBy = "placa" | "codigo" | "valor";
type SortDir = "asc" | "desc";

interface Arquivado {
  _id: string;
  placa: number;
  codigo: number;
  descricao: string;
  notaFiscal: number;
  estado: Estado;
  valor: number;
  localizacao: string;
  obs?: string | null;
  motivo: string;
  usuario?: string;
  arquivadoPor?: string;
  createdAt?: string;
  arquivadoEm?: string;
}

const estadoStyles: Record<
  string,
  {
    bg: string;
    borderIdle: string;
    borderHover: string;
    text: string;
    pillBg: string;
    pillText: string;
    shadowHover: string;
  }
> = {
  Novo: {
    bg: "from-indigo-50/70 to-white",
    borderIdle: "border-blue-100",
    borderHover: "hover:border-blue-400",
    text: "text-teal-700",
    pillBg: "bg-blue-100",
    pillText: "text-blue-700",
    shadowHover: "hover:shadow-blue-100/60",
  },
  Excelente: {
    bg: "from-teal-50/70 to-white",
    borderIdle: "border-teal-100",
    borderHover: "hover:border-teal-400",
    text: "text-teal-700",
    pillBg: "bg-teal-100",
    pillText: "text-teal-700",
    shadowHover: "hover:shadow-teal-100/60",
  },
  Ruim: {
    bg: "from-rose-50/70 to-white",
    borderIdle: "border-rose-100",
    borderHover: "hover:border-rose-400",
    text: "text-rose-700",
    pillBg: "bg-rose-100",
    pillText: "text-rose-700",
    shadowHover: "hover:shadow-rose-100/60",
  },
  "Não Informado": {
    bg: "from-gray-50/70 to-white",
    borderIdle: "border-gray-200",
    borderHover: "hover:border-gray-300",
    text: "text-gray-700",
    pillBg: "bg-gray-100",
    pillText: "text-gray-700",
    shadowHover: "hover:shadow-gray-100/60",
  },
};

function getEstadoStyle(estado: string) {
  return estadoStyles[estado] ?? estadoStyles.default;
}

function formatValor(valor: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor || 0);
}

function formatData(dataISO?: string): string {
  if (!dataISO) return "—";
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dataISO));
  } catch {
    return dataISO;
  }
}

const ESTADO_OPTIONS: FilterEstado[] = ["Todos", "Novo", "Excelente", "Ruim", "Não Informado"];
const SORT_LABELS: Record<SortBy, string> = {
  placa: "Placa",
  codigo: "Código",
  valor: "Preço",
};

export default function ArquivadosPage() {
  const [arquivados, setArquivados] = useState<Arquivado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeFilter, setActiveFilter] = useState<FilterEstado>("Todos");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Arquivado | null>(null);

  const [sortBy, setSortBy] = useState<SortBy>("codigo");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const [restoringId, setRestoringId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/arquivados")
      .then((res) => {
        if (!res.ok) throw new Error(`Erro ${res.status}`);
        return res.json();
      })
      .then((data: Arquivado[]) => setArquivados(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleRestaurar = async (item: Arquivado, e: React.MouseEvent) => {
    e.stopPropagation();
    if (restoringId) return;

    setRestoringId(item._id);
    try {
      const res = await fetch(`/api/arquivados/${item._id}/restaurar`, {
        method: "POST",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao restaurar o produto.");
      }

      setArquivados((prev) => prev.filter((a) => a._id !== item._id));
    } catch (err: any) {
      alert(err.message || "Ocorreu um erro ao restaurar.");
    } finally {
      setRestoringId(null);
    }
  };

  useEffect(() => {
    if (!selected) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelected(null);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selected]);

  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selected]);

  useEffect(() => {
    if (!sortDropdownOpen) return;
    const handler = () => setSortDropdownOpen(false);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [sortDropdownOpen]);

  const handleSortByChange = (key: SortBy) => {
    setSortBy(key);
    setSortDropdownOpen(false);
  };

  const toggleSortDir = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSortDir((d) => (d === "asc" ? "desc" : "asc"));
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    const result = arquivados.filter((a) => {
      const matchEstado = activeFilter === "Todos" || a.estado === activeFilter;
      const usuarioNome = a.usuario || a.arquivadoPor || "";
      const matchSearch =
        !q ||
        a.descricao.toLowerCase().includes(q) ||
        String(a.codigo).includes(q) ||
        String(a.placa).includes(q) ||
        a.localizacao.toLowerCase().includes(q) ||
        a.motivo.toLowerCase().includes(q) ||
        usuarioNome.toLowerCase().includes(q);
      return matchEstado && matchSearch;
    });

    return [...result].sort((a, b) => {
      const valA = a[sortBy] ?? 0;
      const valB = b[sortBy] ?? 0;
      const cmp = valA > valB ? 1 : valA < valB ? -1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [arquivados, activeFilter, search, sortBy, sortDir]);

  const SortDirIcon = sortDir === "asc" ? ArrowUp : ArrowDown;

  const { data: session } = useSession(); 
  const role = (session?.user as any)?.role as string | undefined;
  const isAdmin = role === "admin"; 

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight flex items-center gap-3">
              <Archive className="text-cello-800" size={32} />
              Produtos Arquivados
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Itens removidos do inventário ativo e seus respectivos motivos de arquivamento.
            </p>
          </div>
        </header>

        {/* Busca e Filtros */}
        <div className="flex items-center gap-3 mb-3">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Buscar por descrição, código, placa, motivo ou usuário..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-cello-800/30 focus:border-cello-800 placeholder:text-gray-400 transition"
            />
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setSortDropdownOpen((o) => !o)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border border-gray-200 bg-white shadow-sm hover:border-cello-800 transition text-gray-700 min-w-[148px] justify-between"
              >
                <span className="flex items-center gap-2">
                  <ArrowUpDown size={14} className="text-gray-400" />
                  {SORT_LABELS[sortBy]}
                </span>
                <ChevronDown
                  size={14}
                  className={`text-gray-400 transition-transform ${
                    sortDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {sortDropdownOpen && (
                <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-100 rounded-xl shadow-lg z-20 py-1 overflow-hidden">
                  {(Object.entries(SORT_LABELS) as [SortBy, string][]).map(
                    ([key, label]) => (
                      <button
                        key={key}
                        onClick={() => handleSortByChange(key)}
                        className={`w-full text-left px-4 py-2 text-sm transition ${
                          sortBy === key
                            ? "bg-cello-800 text-white font-semibold"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {label}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>

            <button
              onClick={toggleSortDir}
              title={sortDir === "asc" ? "Ordem crescente" : "Ordem decrescente"}
              className={`p-2 rounded-xl border shadow-sm transition text-sm font-semibold flex items-center gap-1.5 ${
                sortDir === "asc"
                  ? "border-gray-200 bg-white text-gray-600 hover:border-cello-800 hover:text-cello-800"
                  : "border-cello-800 bg-cello-800 text-white hover:bg-cello-900"
              }`}
            >
              <SortDirIcon size={15} />
              <span className="text-xs hidden sm:inline">
                {sortDir === "asc" ? "Crescente" : "Decrescente"}
              </span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-6">
          <SlidersHorizontal size={13} className="text-gray-400 flex-shrink-0" />
          {ESTADO_OPTIONS.map((op) => (
            <button
              key={op}
              onClick={() => setActiveFilter(op)}
              className={`text-xs font-semibold px-3 py-1 rounded-full border transition ${
                activeFilter === op
                  ? "bg-cello-800 text-white border-cello-800"
                  : "bg-white text-gray-600 border-gray-200 hover:border-cello-800 hover:text-cello-800"
              }`}
            >
              {op}
            </button>
          ))}
        </div>

        {!loading && !error && (
          <p className="text-xs text-gray-400 mb-4 font-medium">
            {filtered.length} {filtered.length !== 1 ? 'itens' : 'item'} encontrado{filtered.length !== 1 ? 's' : ''}
          </p>
        )}

        {loading && (
          <div className="flex items-center justify-center py-24 text-gray-400 gap-3">
            <Clock size={20} className="animate-spin" />
            <span className="text-sm font-medium">Carregando arquivados…</span>
          </div>
        )}

        {error && (
          <p className="text-center text-rose-500 py-16 text-sm">
            Erro ao carregar arquivados: {error}
          </p>
        )}

        {/* Lista de Arquivados */}
        {!loading && !error && filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-16 text-sm">
            Nenhum produto arquivado encontrado.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((item) => {
              const s = getEstadoStyle(item.estado);
              const arquivadoPor = item.usuario || item.arquivadoPor || "Desconhecido";
              const dataArquivamento = item.arquivadoEm || item.createdAt;

              return (
                <article
                  key={item._id}
                  onClick={() => setSelected(item)}
                  className={`
                    flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4
                    bg-gradient-to-r ${s.bg}
                    border ${s.borderIdle} ${s.borderHover}
                    rounded-2xl shadow-sm hover:shadow-md ${s.shadowHover}
                    transition-all duration-200 hover:-translate-y-0.5
                    cursor-pointer
                  `}
                >
                  <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                    <div className="p-2.5 rounded-xl bg-cello-800 flex-shrink-0">
                      <Archive size={20} className="text-cyan-300" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <span
                        className={`block text-[10px] font-bold uppercase tracking-widest ${s.text}`}
                      >
                        #{item.codigo} · Placa {item.placa}
                      </span>

                      <h3 className="mt-0.5 text-gray-800 font-bold text-sm leading-snug truncate">
                        {item.descricao}
                      </h3>

                      <p className="mt-1 text-xs text-gray-500 line-clamp-1 italic">
                        <span className="font-semibold not-italic text-gray-600">Motivo:</span>{" "}
                        {item.motivo}
                      </p>

                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.pillBg} ${s.pillText}`}
                        >
                          {item.estado}
                        </span>

                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 flex items-center gap-1">
                          <MapPin size={9} />
                          {item.localizacao}
                        </span>

                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 flex items-center gap-1">
                          <User size={9} />
                          {arquivadoPor}
                        </span>

                        {dataArquivamento && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 flex items-center gap-1">
                            <Calendar size={9} />
                            {formatData(dataArquivamento)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Lado Direito: Valor e Ações */}
                  <div className="flex items-center gap-4 flex-shrink-0 self-end sm:self-center border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                    <span className="text-base font-black text-green-700 mr-2">
                      {formatValor(item.valor)}
                    </span>

                    {/* Botão de Restauração */}
                    {isAdmin && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleRestaurar(item, e)}
                          disabled={restoringId === item._id}
                          title="Restaurar produto para o inventário ativo"
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-xl bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-600 hover:text-white transition disabled:opacity-50"
                        >
                          {restoringId === item._id ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <RotateCcw size={13} />
                          )}
                          <span className="hidden md:inline">Restaurar</span>
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Detalhes do Produto */}
        {selected &&
          createPortal(
            (() => {
              const p = selected;
              const s = getEstadoStyle(p.estado);
              const usuarioNome = p.usuario || p.arquivadoPor || "Desconhecido";
              const dataIso = p.arquivadoEm || p.createdAt;

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
                    <div
                      className={`sticky top-0 z-10 flex items-start gap-4 p-6 pb-4 bg-gradient-to-br ${s.bg} border-b ${s.borderIdle} rounded-t-2xl`}
                    >
                      <div className="p-3 rounded-xl bg-cello-800 flex-shrink-0">
                        <Archive size={24} className="text-cyan-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span
                          className={`block text-[10px] font-bold uppercase tracking-widest ${s.text}`}
                        >
                          Código #{p.codigo} · Placa {p.placa}
                        </span>
                        <h2 className="mt-0.5 text-gray-800 font-black text-xl leading-snug">
                          {p.descricao}
                        </h2>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          <span
                            className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${s.pillBg} ${s.pillText}`}
                          >
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
                            <span className={`text-[10px] font-bold uppercase tracking-wide ${s.pillText}`}>
                              Nota Fiscal
                            </span>
                            <p className={`mt-0.5 text-sm font-semibold ${s.pillText}`}>
                              #{p.notaFiscal ?? "—"}
                            </p>
                          </div>
                        </div>

                        <div className={`flex items-start gap-3 p-3.5 rounded-xl ${s.pillBg}`}>
                          <Banknote size={16} className={`mt-0.5 flex-shrink-0 ${s.pillText}`} />
                          <div>
                            <span className={`text-[10px] font-bold uppercase tracking-wide ${s.pillText}`}>
                              Valor
                            </span>
                            <p className={`mt-0.5 text-sm font-semibold ${s.pillText}`}>
                              {formatValor(p.valor)}
                            </p>
                          </div>
                        </div>

                        <div className={`flex items-start gap-3 p-3.5 rounded-xl ${s.pillBg}`}>
                          <Tag size={16} className={`mt-0.5 flex-shrink-0 ${s.pillText}`} />
                          <div>
                            <span className={`text-[10px] font-bold uppercase tracking-wide ${s.pillText}`}>
                              Código
                            </span>
                            <p className={`mt-0.5 text-sm font-semibold ${s.pillText}`}>
                              {p.codigo}
                            </p>
                          </div>
                        </div>

                        <div className={`flex items-start gap-3 p-3.5 rounded-xl ${s.pillBg}`}>
                          <MapPin size={16} className={`mt-0.5 flex-shrink-0 ${s.pillText}`} />
                          <div>
                            <span className={`text-[10px] font-bold uppercase tracking-wide ${s.pillText}`}>
                              Localização Antiga
                            </span>
                            <p className={`mt-0.5 text-sm font-semibold ${s.pillText}`}>
                              {p.localizacao}
                            </p>
                          </div>
                        </div>

                        <div className={`flex items-start gap-3 p-3.5 rounded-xl ${s.pillBg}`}>
                          <User size={16} className={`mt-0.5 flex-shrink-0 ${s.pillText}`} />
                          <div>
                            <span className={`text-[10px] font-bold uppercase tracking-wide ${s.pillText}`}>
                              Arquivado Por
                            </span>
                            <p className={`mt-0.5 text-sm font-semibold ${s.pillText}`}>
                              {usuarioNome}
                            </p>
                          </div>
                        </div>

                        <div className={`flex items-start gap-3 p-3.5 rounded-xl ${s.pillBg}`}>
                          <Calendar size={16} className={`mt-0.5 flex-shrink-0 ${s.pillText}`} />
                          <div>
                            <span className={`text-[10px] font-bold uppercase tracking-wide ${s.pillText}`}>
                              Data de Arquivamento
                            </span>
                            <p className={`mt-0.5 text-sm font-semibold ${s.pillText}`}>
                              {formatData(dataIso)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 border border-amber-100">
                        <FileText size={16} className="mt-0.5 flex-shrink-0 text-amber-700" />
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wide text-amber-800">
                            Motivo do Arquivamento
                          </span>
                          <p className="mt-0.5 text-sm text-amber-900 font-medium">{p.motivo}</p>
                        </div>
                      </div>

                      <div className={`flex items-start gap-3 p-3.5 rounded-xl ${s.pillBg}`}>
                        <UserCheck size={16} className={`mt-0.5 flex-shrink-0 ${s.pillText}`} />
                        <div>
                          <span className={`text-[10px] font-bold uppercase tracking-wide ${s.pillText}`}>
                            Observação do Produto
                          </span>
                          <p className={`mt-0.5 text-sm ${s.pillText}`}>
                            {p.obs ?? "Nenhuma observação registrada."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })(),
            document.body
          )}
      </div>
    </main>
  );
}