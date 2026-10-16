"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Clock, LogOut, ShieldCheck } from "lucide-react";

export default function AguardandoAprovacaoPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const role = (session?.user as any)?.role;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated" && role && role !== "aprovacao") {
      router.push("/");
    }
  }, [status, role, router]);

  if (status === "loading") return null;

  const user = session?.user as any;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">

        {/* Ícone animado */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center">
              <Clock size={44} className="text-amber-500 animate-pulse" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-cello-800 flex items-center justify-center border-2 border-white">
              <ShieldCheck size={16} className="text-cyan-300" />
            </div>
          </div>
        </div>

        {/* Título */}
        <h1 className="text-2xl font-black text-gray-800 mb-2">
          Conta em análise
        </h1>

        {/* Mensagem */}
        <p className="text-gray-500 text-sm leading-relaxed mb-2">
          Sua conta está aguardando aprovação de um administrador do sistema.
          Assim que for aprovada, você terá acesso completo ao inventário.
        </p>

        {user?.email && (
          <p className="text-xs text-gray-400 mb-8">
            Conta registrada com{" "}
            <span className="font-semibold text-gray-600">{user.email}</span>
          </p>
        )}

        {/* Card informativo */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-8 text-left">
          <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-2">
            O que acontece agora?
          </p>
          <ul className="space-y-1.5 text-xs text-amber-700">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 flex-shrink-0">1.</span>
              Um administrador irá revisar o seu cadastro.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 flex-shrink-0">2.</span>
              Você receberá acesso ao sistema após a aprovação.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 flex-shrink-0">3.</span>
              Caso o processo demore, entre em contato com o administrador diretamente pelo email contato@patobranco.tec.br.
            </li>
          </ul>
        </div>

        {/* Botão sair */}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-2 mx-auto px-5 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition text-sm font-semibold"
        >
          <LogOut size={15} />
          Sair da conta
        </button>
      </div>
    </div>
  );
}