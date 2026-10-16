"use client";

// app/cadastro/page.tsx

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { UserPlus, Mail, Lock, User, AlertTriangle, CheckCircle, Package } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

export default function CadastroPage() {
  const router = useRouter();

  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [error, setError]       = useState<string | null>(null);
  const [success, setSuccess]   = useState(false);
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Erro ao criar conta.");
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/login"), 2000);
  };

  const handleGoogle = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 rounded-xl bg-cello-800 mb-4">
            <Package size={28} className="text-cyan-300" />
          </div>
          <h1 className="text-2xl font-black text-gray-800">Criar conta</h1>
          <p className="text-sm text-gray-500 mt-1">
            Novos cadastros possuem o estado de <span className="font-semibold">Em Aprovação</span> — um Admin pode elevar seu acesso depois.
          </p>
        </div>

        {/* Feedback */}
        {error && (
          <div className="mb-5 flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm font-medium">
            <AlertTriangle size={16} className="flex-shrink-0" />
            {error}
          </div>
        )}
        {success && (
          <div className="mb-5 flex items-center gap-2 p-3 bg-teal-50 border border-teal-200 text-teal-700 rounded-xl text-sm font-medium">
            <CheckCircle size={16} className="flex-shrink-0" />
            Conta criada! Redirecionando para o login…
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">Nome</label>
            <div className="relative">
              <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome completo"
                className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cello-800/30 focus:border-cello-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">E-mail</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@exemplo.com"
                className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cello-800/30 focus:border-cello-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">Senha</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cello-800/30 focus:border-cello-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">Confirmar senha</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repita a senha"
                className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cello-800/30 focus:border-cello-800"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-cello-800 hover:bg-cello-700 text-white text-sm font-bold rounded-xl transition disabled:opacity-50"
          >
            <UserPlus size={16} />
            {loading ? "Criando conta…" : "Criar conta"}
          </button>
        </form>

        {/* Divisor */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 font-medium">ou</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Google */}
        <button
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl transition"
        >
          <FcGoogle size={18} />
          Cadastrar com Google
        </button>

        <p className="text-center text-sm text-gray-500 mt-6">
          Já tem conta?{" "}
          <a href="/login" className="text-cello-800 font-semibold hover:underline">
            Entrar
          </a>
        </p>
      </div>
    </div>
  );
}