import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import User from "@/lib/models/User";

export async function GET() {
  const session = await getServerSession(authOptions);
  const currentRole = (session?.user as any)?.role;

  if (!session || currentRole !== "admin") {
    return NextResponse.json({ error: "Acesso não autorizado." }, { status: 403 });
  }

  try {
    await dbConnect();
    const users = await User.find({}, "name email image role localizacao createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar usuários." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  const currentRole = (session?.user as any)?.role;

  if (!session || currentRole !== "admin") {
    return NextResponse.json({ error: "Acesso não autorizado." }, { status: 403 });
  }

  try {
    const { userId, newRole, localizacao } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "ID do usuário é obrigatório." }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
    }

    const targetRole = newRole !== undefined ? newRole : user.role;
    const targetLocation = localizacao !== undefined ? localizacao.trim() : (user.localizacao || "");

    if (!["admin", "viewer", "sala", "aprovacao"].includes(targetRole)) {
      return NextResponse.json({ error: "Cargo inválido." }, { status: 400 });
    }

    if (targetRole === "sala" && !targetLocation) {
      return NextResponse.json(
        { error: "Localização é obrigatória para o cargo Sala." },
        { status: 400 }
      );
    }

    user.role = targetRole;
    if (targetRole === "sala") {
      user.localizacao = targetLocation;
    } else {
      user.localizacao = undefined; 
    }

    await user.save();

    return NextResponse.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
      localizacao: user.localizacao,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao atualizar o usuário." },
      { status: 500 }
    );
  }
}