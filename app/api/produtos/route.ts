// app/api/produtos/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Produto from "@/lib/models/Produto";
import Historico from "@/lib/models/Historico";

export async function GET() {
  try {
    await dbConnect();
    const produtos = await Produto.find({}).lean();

    const serialized = produtos.map((p) => ({
      ...p,
      valor: p.valor != null ? parseFloat(p.valor.toString()) : null,
    }));

    return NextResponse.json(serialized);
  } catch (err) {
    console.error("GET /api/produtos:", err);
    return NextResponse.json(
      { error: "Falha ao buscar produtos." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const novoProduto = await Produto.create(body);
    await Historico.create({
      acao: "Criação",
      codigo: novoProduto.codigo,
      placa: novoProduto.placa,
      descricao: novoProduto.descricao,
      detalhes: `Cadastrado na localização: ${novoProduto.localizacao} | Valor: R$ ${novoProduto.valor}`,
    });

    const plainProduto = novoProduto.toObject();
    const responseData = {
      ...plainProduto,
      valor: plainProduto.valor != null ? parseFloat(plainProduto.valor.toString()) : null,
    };

    return NextResponse.json(responseData, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/produtos:", err);

    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0] || "campo";
      return NextResponse.json(
        { error: `Já existe um item cadastrado com este(a) ${field}.` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: err.message || "Falha ao cadastrar produto." },
      { status: 500 }
    );
  }
}