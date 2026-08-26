import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongoose";
import { Arquivado } from "@/lib/models/Arquivado";
import { Produto } from "@/lib/models/Produto";
import { Historico } from "@/lib/models/Historico";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
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

    const itemArquivado = await Arquivado.findById(id);

    if (!itemArquivado) {
      return NextResponse.json(
        { error: "Item arquivado não encontrado." },
        { status: 404 }
      );
    }

    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;

    if (!session || role !== "admin") {
      return NextResponse.json(
        { error: "Acesso não autorizado. Apenas administradores podem restaurar produtos." },
        { status: 403 }
      );
    }

    const usuario =
      (session?.user as any)?.name ??
      (session?.user as any)?.email ??
      "Sistema";

    const produtoRestaurado = await Produto.create({
      placa: itemArquivado.placa,
      codigo: itemArquivado.codigo,
      descricao: itemArquivado.descricao,
      notaFiscal: itemArquivado.notaFiscal,
      estado: itemArquivado.estado,
      valor: itemArquivado.valor,
      localizacao: itemArquivado.localizacao,
      obs: itemArquivado.obs,
    });

    await Arquivado.findByIdAndDelete(id);

    await Historico.create({
      acao: "Restauração",
      codigo: produtoRestaurado.codigo,
      placa: produtoRestaurado.placa,
      descricao: produtoRestaurado.descricao,
      valor: produtoRestaurado.valor,
      detalhes: `Produto restaurado para o inventário.`,
      usuario: usuario,
    });

    return NextResponse.json(produtoRestaurado, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/arquivados/[id]/restaurar:", err);
    return NextResponse.json(
      { error: err.message || "Falha ao restaurar produto." },
      { status: 500 }
    );
  }
}