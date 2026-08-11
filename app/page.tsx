import ProdutosGrid from "@components/produtos/ProdutosGrid";

export const metadata = {
  title: "Inventário de Produtos",
  description: "Lista de itens cadastrados no sistema de controle de inventário.",
};

export default function ListaPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">
            Inventário de Produtos
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Itens cadastrados no banco de dados — filtre por estado para localizar ativos.
          </p>
        </header>

        <ProdutosGrid />
      </div>
    </main>
  );
}