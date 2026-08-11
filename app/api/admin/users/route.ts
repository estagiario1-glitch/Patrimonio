import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import User from "@/lib/models/User";

// 🔍 Buscar todos os usuários (Apenas Admin)
export async function GET() {
  const session = await getServerSession(authOptions);
  const currentRole = (session?.user as any)?.role;

  if (!session || currentRole !== "admin") {
    return NextResponse.json({ error: "Acesso não autorizado." }, { status: 403 });
  }

  try {
    await dbConnect();
    const users = await User.find({}, "name email image role createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar usuários." }, { status: 500 });
  }
}

// ✏️ Alterar o cargo de um usuário (Apenas Admin)
export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  const currentRole = (session?.user as any)?.role;

  if (!session || currentRole !== "admin") {
    return NextResponse.json({ error: "Acesso não autorizado." }, { status: 403 });
  }

  try {
    const { userId, newRole } = await request.json();

    if (!["admin", "viewer"].includes(newRole)) {
      return NextResponse.json({ error: "Cargo inválido." }, { status: 400 });
    }

    await dbConnect();

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role: newRole },
      { new: true }
    ).select("name email image role");

    if (!updatedUser) {
      return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar o cargo do usuário." }, { status: 500 });
  }
}