import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Produto from "@/lib/models/Produto";
import Historico from "@/lib/models/Historico";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const body = await req.json();

    const produtoAtualizado = await Produto.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });

    if (!produtoAtualizado) {
      return NextResponse.json({ error: "Produto não encontrado." }, { status: 404 });
    }

    await Historico.create({
      acao: "Edição",
      codigo: produtoAtualizado.codigo,
      placa: produtoAtualizado.placa,
      descricao: produtoAtualizado.descricao,
      detalhes: `Estado alterado para: ${produtoAtualizado.estado} | Local: ${produtoAtualizado.localizacao}`,
    });

    return NextResponse.json(produtoAtualizado);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Falha ao editar produto." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const produto = await Produto.findById(params.id);

    if (!produto) {
      return NextResponse.json({ error: "Produto não encontrado." }, { status: 404 });
    }

    await Produto.findByIdAndDelete(params.id);

    await Historico.create({
      acao: "Exclusão",
      codigo: produto.codigo,
      placa: produto.placa,
      descricao: produto.descricao,
      detalhes: `Item removido do sistema (Antiga localização: ${produto.localizacao})`,
    });

    return NextResponse.json({ message: "Produto removido com sucesso." });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Falha ao excluir produto." },
      { status: 500 }
    );
  }
}