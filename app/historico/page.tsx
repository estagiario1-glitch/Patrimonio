"use client";

import { useState, useEffect, useMemo } from "react";
import {
  History,
  PlusCircle,
  Pencil,
  Archive,
  Calendar,
  User,
  FileText,
  Search,
  SlidersHorizontal,
  RotateCcw,
  MapPin,
} from "lucide-react";

type TipoAcao = "Criação" | "Edição" | "Arquivamento" | "Restauração";
type FilterAcao = "Todas" | TipoAcao;

interface LogHistorico {
  _id: string;
  acao: TipoAcao;
  codigo: number;
  placa: number;
  descricao: string;
  localizacao?: string | null;
  valor?: number | null;
  detalhes?: string | null;
  usuario?: string | null;
  createdAt: string;
}

const acaoStyles: Record<
  TipoAcao,
  {
    bg: string;
    borderIdle: string;
    text: string;
    pillBg: string;
    pillText: string;
    icon: typeof PlusCircle;
  }
> = {
  Criação: {
    bg: "from-green-50/70 to-white",
    borderIdle: "border-green-100",
    text: "text-green-700",
    pillBg: "bg-green-100",
    pillText: "text-green-700",
    icon: PlusCircle,
  },
  Edição: {
    bg: "from-amber-50/70 to-white",
    borderIdle: "border-amber-100",
    text: "text-amber-700",
    pillBg: "bg-amber-100",
    pillText: "text-amber-700",
    icon: Pencil,
  },
  Arquivamento: {
    bg: "from-red-50/70 to-white",
    borderIdle: "border-red-100",
    text: "text-red-700",
    pillBg: "bg-red-100",
    pillText: "text-red-700",
    icon: Archive,
  },
  Restauração: {
    bg: "from-indigo-50/70 to-white",
    borderIdle: "border-indigo-100",
    text: "text-indigo-700",
    pillBg: "bg-indigo-100",
    pillText: "text-indigo-700",
    icon: RotateCcw,
  },
};

const ACAO_OPTIONS: FilterAcao[] = [
  "Todas",
  "Criação",
  "Edição",
  "Arquivamento",
  "Restauração",
];

function formatData(dataISO: string): string {
  if (!dataISO) return "";
  const date = new Date(dataISO);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function HistoricoPage() {
  const [logs, setLogs] = useState<LogHistorico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterAcao>("Todas");

  useEffect(() => {
    fetch("/api/historico")
      .then((res) => {
        if (!res.ok) throw new Error(`Erro ${res.status}`);
        return res.json();
      })
      .then((data) => setLogs(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredLogs = useMemo(() => {
    const q = search.toLowerCase().trim();
    return logs.filter((log) => {
      const matchAcao = activeFilter === "Todas" || log.acao === activeFilter;
      const usuarioNome = log.usuario || "";
      const loc = log.localizacao || "";
      const matchSearch =
        !q ||
        log.descricao.toLowerCase().includes(q) ||
        String(log.codigo).includes(q) ||
        String(log.placa).includes(q) ||
        loc.toLowerCase().includes(q) ||
        (log.detalhes ?? "").toLowerCase().includes(q) ||
        usuarioNome.toLowerCase().includes(q);
      return matchAcao && matchSearch;
    });
  }, [logs, activeFilter, search]);

  function formatValor(valor?: number | null): string {
    if (valor === undefined || valor === null) return "—";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight flex items-center gap-3">
              <History className="text-cello-800" size={32} />
              Histórico de Movimentações
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Registro completo de edições, arquivamentos e cadastros.
            </p>
          </div>
        </header>

        {/* Busca e Filtros */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Buscar por descrição, código, placa, localização, detalhes ou usuário..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-cello-800/30 focus:border-cello-800"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <SlidersHorizontal size={13} className="text-gray-400 flex-shrink-0" />
            {ACAO_OPTIONS.map((op) => (
              <button
                key={op}
                onClick={() => setActiveFilter(op)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition ${
                  activeFilter === op
                    ? "bg-cello-800 text-white border-cello-800"
                    : "bg-white text-gray-600 border-gray-200 hover:border-cello-800 hover:text-cello-800"
                }`}
              >
                {op}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Cards */}
        {loading && (
          <p className="text-center text-gray-400 py-16 text-sm">Carregando histórico...</p>
        )}

        {error && (
          <p className="text-center text-rose-500 py-16 text-sm">Erro: {error}</p>
        )}

        {!loading && !error && filteredLogs.length === 0 && (
          <p className="text-center text-gray-400 py-16 text-sm">
            Nenhum registro encontrado.
          </p>
        )}

        <div className="flex flex-col gap-3">
          {filteredLogs.map((log) => {
            const s = acaoStyles[log.acao] ?? acaoStyles["Criação"];
            const IconeAcao = s.icon;

            return (
              <article
                key={log._id}
                className={`flex flex-col sm:flex-row sm:items-start gap-4 px-5 py-4 bg-gradient-to-r ${s.bg} border ${s.borderIdle} rounded-2xl shadow-sm hover:shadow-md transition-all duration-200`}
              >
                {/* Ícone da Ação */}
                <div className="p-2.5 rounded-xl bg-cello-800 flex-shrink-0 text-cyan-300 self-start">
                  <IconeAcao size={20} />
                </div>

                {/* Conteúdo Central */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {/* Badge da Ação */}
                    <span
                      className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${s.pillBg} ${s.pillText}`}
                    >
                      {log.acao}
                    </span>

                    {/* Código e Placa */}
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      #{log.codigo} · Placa {log.placa}
                    </span>

                    {/* Localização estilo ProdutosGrid */}
                    {log.localizacao && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 flex items-center gap-1">
                        <MapPin size={9} />
                        {log.localizacao}
                      </span>
                    )}

                    {/* Nome do Usuário */}
                    <span className="text-[10px] font-bold text-gray-700 bg-white/90 border border-gray-200 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                      <User size={11} className="text-cello-800" />
                      <span>{log.usuario || "Sistema"}</span>
                    </span>
                  </div>

                  {/* Descrição do Produto */}
                  <h3 className="mt-1.5 text-gray-800 font-bold text-sm leading-snug">
                    {log.descricao}
                  </h3>

                  {/* Detalhes da Alteração */}
                  {log.detalhes && (
                    <div className="mt-2.5 p-2.5 bg-white/80 border border-gray-100 rounded-xl flex items-start gap-2">
                      <FileText size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-gray-600 font-medium leading-relaxed">
                        {log.detalhes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Lado Direito: Valor + Data */}
                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between gap-2 flex-shrink-0 self-stretch sm:self-start border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-100">
                  {/* Valor do Produto */}
                  {log.valor !== undefined && log.valor !== null && (
                    <span className="text-base font-black text-green-700">
                      {formatValor(log.valor)}
                    </span>
                  )}

                  {/* Data da Ocorrência */}
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium px-2">
                    <Calendar size={13} className="text-cello-800" />
                    <span>{formatData(log.createdAt)}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}