import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Historico from "@/lib/models/Historico";

export async function GET() {
  try {
    await dbConnect();
    const logs = await Historico.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(logs);
  } catch (err) {
    console.error("GET /api/historico:", err);
    return NextResponse.json(
      { error: "Falha ao buscar histórico de movimentações." },
      { status: 500 }
    );
  }
}