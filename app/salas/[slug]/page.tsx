// app/salas/[slug]/page.tsx
import { notFound } from "next/navigation";
import ProdutosGrid from "@/components/produtos/ProdutosGrid";
import { slugToLocalizacao } from "@/lib/Localizacoes";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props) {
  const localizacao = slugToLocalizacao(params.slug);
  if (!localizacao) return { title: "Sala não encontrada" };
  return {
    title: `Inventário — ${localizacao}`,
    description: `Itens cadastrados na localização: ${localizacao}.`,
  };
}

export default function SalaPage({ params }: Props) {
  const localizacao = slugToLocalizacao(params.slug);

  if (!localizacao) notFound();

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-1">
            Localização
          </p>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight uppercase">
            {localizacao}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Itens cadastrados nesta sala.
          </p>
        </header>

        <ProdutosGrid localizacao={localizacao} />
      </div>
    </main>
  );
}