// app/api/arquivados/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import { Arquivado } from "@/lib/models/Arquivado";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const role = (session.user as any).role as string;

  if (role !== "admin" && role !== "viewer") {
    return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
  }

  try {
    await dbConnect();
    const arquivados = await Arquivado.find().sort({ arquivadoEm: -1 }).lean();
    return NextResponse.json(arquivados);
  } catch (error) {
    console.error("GET /api/arquivados:", error);
    return NextResponse.json({ error: "Erro ao buscar arquivados." }, { status: 500 });
  }
}