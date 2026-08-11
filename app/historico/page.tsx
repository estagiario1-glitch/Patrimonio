"use client";

import { useState, useEffect, useMemo } from "react"; 
import {
  History, 
  PlusCircle, 
  Pencil, 
  Trash2, 
  Calendar, 
} from "lucide-react";

type TipoAcao = "Criação" | "Edição" | "Exclusão";
type FilterAcao = "Todas" | TipoAcao; 

interface LogHistorico {
  _id: string; 
  acao: TipoAcao; 
  codigo: number; 
  placa: number; 
  descricao: string; 
  detalhes?: string | null; 
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
    bg: "from-teal-50/70 to-white", 
    borderIdle: "border-teal-100", 
    text: "text-teal-700", 
    pillBg: "bg-teal-100", 
    pillText: "text-teal-700", 
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
  Exclusão: {
    bg: "from-rose-50/70 to-white", 
    borderIdle: "border-rose-100", 
    text: "text-rose-700", 
    pillBg: "bg-rose-100", 
    pillText: "text-rose-700", 
    icon: Trash2, 
  },
};

const ACAO_OPTIONS: FilterAcao[] = ["Todas", "Criação", "Edição", "Exclusão"]; 

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
  const [dropdownOpen, setDropdownOpen] = useState(false); 

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

  useEffect(() => {
    if (!dropdownOpen) return; 
    const handler = () => setDropdownOpen(false); 
    window.addEventListener("click", handler); 
    return () => window.removeEventListener("click", handler); 
  }, [dropdownOpen]); 

  const filteredLogs = useMemo(() => {
    const q = search.toLowerCase().trim(); 
    return logs.filter((log) => {
      const matchAcao = activeFilter === "Todas" || log.acao === activeFilter; 
      const matchSearch =
        !q || 
        log.descricao.toLowerCase().includes(q) || 
        String(log.codigo).includes(q) || 
        String(log.placa).includes(q) || 
        (log.detalhes ?? "").toLowerCase().includes(q);
      return matchAcao && matchSearch; 
    }); 
  }, [logs, activeFilter, search]); 

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight flex items-center gap-3">
              <History className="text-cello-800" size={32} />
              Histórico de Movimentações
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Registro completo de edições, exclusões e cadastros realizados no sistema.
            </p>
          </div>
        </header>

        {/*Toolbar de Pesquisa e Filtros ocultada por brevidade*/}
        
        <div className="flex flex-col gap-3">
            {filteredLogs.map((log) => {
              const s = acaoStyles[log.acao]; 
              const IconeAcao = s.icon; 

              return (
                <article
                  key={log._id} 
                  className={`flex items-center gap-4 px-5 py-4 bg-gradient-to-r ${s.bg} border ${s.borderIdle} rounded-2xl shadow-sm hover:shadow-md transition-all duration-200`} 
                >
                  <div className="p-2.5 rounded-xl bg-cello-800 flex-shrink-0 text-cyan-300">
                    <IconeAcao size={20} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${s.pillBg} ${s.pillText}`}>
                        {log.acao}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        #{log.codigo} · Placa {log.placa}
                      </span>
                    </div>

                    <h3 className="mt-1 text-gray-800 font-bold text-sm leading-snug truncate">
                      {log.descricao}
                    </h3>

                    {log.detalhes && ( 
                      <p className="mt-0.5 text-xs text-gray-500 truncate">
                        {log.detalhes}
                      </p> 
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">                    
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium px-2">
                      <Calendar size={12} className="text-cello-800" />
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