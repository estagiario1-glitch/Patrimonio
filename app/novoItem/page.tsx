"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Package, ArrowLeft, Save, AlertTriangle, CheckCircle } from "lucide-react";
import {SALAS} from "../../lib/Salas";

type Estado = "Novo" | "Excelente" | "Ruim" | "Não Informado";

interface ProdutoFormData {
  placa: string;
  codigo: string;
  descricao: string;
  notaFiscal: string;
  estado: Estado;
  valor: string;
  localizacao: string;
  obs: string;
}

export default function NovoItemPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<ProdutoFormData>({
    placa: "",
    codigo: "",
    descricao: "",
    notaFiscal: "",
    estado: "Novo",
    valor: "",
    localizacao: "",
    obs: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.localizacao) {
      setError("Por favor, selecione uma localização válida.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const payload = {
        placa: Number(formData.placa),
        codigo: Number(formData.codigo),
        descricao: formData.descricao,
        notaFiscal: Number(formData.notaFiscal),
        estado: formData.estado,
        valor: parseFloat(formData.valor.replace(",", ".")),
        localizacao: formData.localizacao,
        obs: formData.obs.trim() ? formData.obs : null,
      };

      const res = await fetch("/api/produtos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseText = await res.text();
      let data;
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        data = {};
      }

      if (!res.ok) {
        throw new Error(data.error || `Erro ${res.status}: Falha ao cadastrar produto.`);
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao salvar o produto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 sm:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Cabeçalho */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2.5 text-gray-500 bg-white border border-gray-200 hover:bg-gray-100 rounded-xl transition shadow-sm"
            title="Voltar"
            type="button"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight">
              Cadastrar Novo Item
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Preencha as informações do produto para adicioná-lo ao banco de dados do patrimônio.
            </p>
          </div>
        </div>

        {/* Notificações */}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-3 text-sm font-semibold">
            <AlertTriangle size={20} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-teal-50 border border-teal-200 text-teal-700 rounded-xl flex items-center gap-3 text-sm font-semibold">
            <CheckCircle size={20} className="flex-shrink-0" />
            <span>Produto cadastrado com sucesso! Redirecionando...</span>
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="p-2.5 rounded-xl bg-cello-800 text-cyan-300">
              <Package size={22} />
            </div>
            <h2 className="text-lg font-bold text-gray-800">Dados do Patrimônio</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">
                Código *
              </label>
              <input
                type="number"
                name="codigo"
                required
                value={formData.codigo}
                onChange={handleChange}
                placeholder="Ex: 1001"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-cello-800/30 focus:border-cello-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">
                Placa *
              </label>
              <input
                type="number"
                name="placa"
                required
                value={formData.placa}
                onChange={handleChange}
                placeholder="Ex: 50201"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-cello-800/30 focus:border-cello-800"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">
                Descrição *
              </label>
              <input
                type="text"
                name="descricao"
                required
                value={formData.descricao}
                onChange={handleChange}
                placeholder="Ex: Computador Dell OptiPlex 7090"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-cello-800/30 focus:border-cello-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">
                Nota Fiscal *
              </label>
              <input
                type="number"
                name="notaFiscal"
                required
                value={formData.notaFiscal}
                onChange={handleChange}
                placeholder="Ex: 88412"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-cello-800/30 focus:border-cello-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">
                Valor (R$) *
              </label>
              <input
                type="text"
                name="valor"
                required
                value={formData.valor}
                onChange={handleChange}
                placeholder="Ex: 3500.00"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-cello-800/30 focus:border-cello-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">
                Estado Físico *
              </label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-cello-800/30 focus:border-cello-800"
              >
                <option value="Novo">Novo</option>
                <option value="Excelente">Excelente</option>
                <option value="Ruim">Ruim</option>
                <option value="Não Informado">Não Informado</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">
                Localização *
              </label>
              <select
                name="localizacao"
                required
                value={formData.localizacao}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-cello-800/30 focus:border-cello-800"
              >
                <option value="" disabled>
                  Selecione uma localização...
                </option>
                {SALAS.map((sala) => (
                  <option key={sala} value={sala}>
                    {sala}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">
                Observações
              </label>
              <textarea
                name="obs"
                rows={3}
                value={formData.obs}
                onChange={handleChange}
                placeholder="Detalhes ou observações sobre o item..."
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-cello-800/30 focus:border-cello-800"
              />
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-5 py-2.5 text-sm font-semibold border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 text-sm font-bold bg-cello-800 text-white rounded-xl hover:bg-cello-700 transition flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={16} />
              {loading ? "Salvando..." : "Cadastrar Produto"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}