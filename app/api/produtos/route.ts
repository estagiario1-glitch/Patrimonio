import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import { Produto } from "@/lib/models/Produto";
import { Historico } from "@/lib/models/Historico";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const role = (session.user as any).role as string;
  const userLocalizacao = (session.user as any).localizacao as string | null;

  const { searchParams } = new URL(request.url);
  const localizacaoParam = searchParams.get("localizacao");

  try {
    await dbConnect();

    const filter: Record<string, any> = {};

    if (role === "sala") {
      if (!userLocalizacao) {
        return NextResponse.json(
          { error: "Localização não configurada para este usuário." },
          { status: 403 }
        );
      }
      filter.localizacao = userLocalizacao;
    } else if (localizacaoParam) {
      filter.localizacao = localizacaoParam;
    }

    const produtos = await Produto.find(filter).sort({ createdAt: -1 }).lean();
    return NextResponse.json(produtos);
  } catch (error) {
    console.error("GET /api/produtos:", error);
    return NextResponse.json({ error: "Erro ao buscar produtos." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const role = (session.user as any).role as string;
  const userLocalizacao = (session.user as any).localizacao as string | null;

  if (role === "viewer") {
    return NextResponse.json({ error: "Sem permissão para cadastrar." }, { status: 403 });
  }

  try {
    await dbConnect();
    const body = await request.json();

    if (role === "sala") {
      if (!userLocalizacao) {
        return NextResponse.json(
          { error: "Localização não configurada para este usuário." },
          { status: 403 }
        );
      }
      body.localizacao = userLocalizacao;
    }

    const novoProduto = await Produto.create(body);

    // Extrai o identificador do usuário para gravação
    const usuario =
      (session.user as any)?.name ??
      (session.user as any)?.email ??
      "Sistema";

    await Historico.create({
      acao: "Criação",
      codigo: novoProduto.codigo,
      placa: novoProduto.placa,
      descricao: novoProduto.descricao,
      valor: novoProduto.valor,
      localizacao: novoProduto.localizacao,
      detalhes: `Produto cadastrado no sistema. | Estado: ${novoProduto.estado} | Localização: ${novoProduto.localizacao}`,
      usuario: usuario,
    });

    return NextResponse.json(novoProduto, { status: 201 });
  } catch (error) {
    console.error("POST /api/produtos:", error);
    return NextResponse.json({ error: "Erro ao criar produto." }, { status: 500 });
  }
}