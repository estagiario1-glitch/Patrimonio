import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongoose";
import { Produto } from "@/lib/models/Produto";
import { Arquivado } from "@/lib/models/Arquivado";
import { Historico } from "@/lib/models/Historico";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await req.json();

    const session = await getServerSession(authOptions);
    const usuario =
      (session?.user as any)?.name ??
      (session?.user as any)?.email ??
      "Sistema";

    const produtoAtualizado = await Produto.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!produtoAtualizado) {
      return NextResponse.json(
        { error: "Produto não encontrado." },
        { status: 404 }
      );
    }

    await Historico.create({
      acao: "Edição",
      codigo: produtoAtualizado.codigo,
      placa: produtoAtualizado.placa,
      descricao: produtoAtualizado.descricao,
      valor: produtoAtualizado.valor,
      localizacao: produtoAtualizado.localizacao,
      detalhes: `Produto Editado | Estado: ${produtoAtualizado.estado} | Local: ${produtoAtualizado.localizacao}`,
      usuario: usuario,
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
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Formato de ID inválido." },
        { status: 400 }
      );
    }

    let body: any = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "O corpo da requisição deve ser um JSON válido." },
        { status: 400 }
      );
    }

    const { motivo } = body;

    if (!motivo || !motivo.trim()) {
      return NextResponse.json(
        { error: "O motivo do arquivamento é obrigatório." },
        { status: 400 }
      );
    }

    const produto = await Produto.findById(id);

    if (!produto) {
      return NextResponse.json(
        { error: "Produto não encontrado no banco de dados." },
        { status: 404 }
      );
    }

    const session = await getServerSession(authOptions);
    const usuario =
      (session?.user as any)?.name ??
      (session?.user as any)?.email ??
      "Sistema";

    await Arquivado.create({
      placa: produto.placa,
      codigo: produto.codigo,
      descricao: produto.descricao,
      notaFiscal: produto.notaFiscal,
      estado: produto.estado,
      valor: produto.valor,
      localizacao: produto.localizacao,
      obs: produto.obs,
      motivo: motivo.trim(),
      usuario: usuario,
    });

    await Produto.findByIdAndDelete(id);

    await Historico.create({
      acao: "Arquivamento",
      codigo: produto.codigo,
      placa: produto.placa,
      descricao: produto.descricao,
      valor: produto.valor,
      localizacao: produto.localizacao,
      detalhes: `Item arquivado (Antiga localização: ${produto.localizacao}) | Motivo: ${motivo.trim()}`,
      usuario: usuario,
    });

    return NextResponse.json({ message: "Produto arquivado com sucesso." });
  } catch (err: any) {
    console.error("DELETE /api/produtos/[id]:", err);
    return NextResponse.json(
      { error: err.message || "Falha ao arquivar produto." },
      { status: 500 }
    );
  }
}