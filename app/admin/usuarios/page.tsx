"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { User as UserIcon, ShieldCheck, Eye, Loader2, Search } from "lucide-react";

interface IUserItem {
  _id: string;
  name?: string;
  email: string;
  image?: string;
  role: "admin" | "viewer";
}

export default function AdminUsuariosPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<IUserItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error("Erro ao carregar usuários:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: "admin" | "viewer") => {
    setUpdatingId(userId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, newRole }),
      });

      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );
      } else {
        alert("Não foi possível atualizar o cargo do usuário.");
      }
    } catch (err) {
      alert("Erro na requisição.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Gerenciamento de Usuários</h1>
          <p className="text-sm text-gray-500">Altere permissões e visualize contas registradas.</p>
        </div>

        {/* Campo de Busca */}
        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cello-800/20"
          />
        </div>
      </div>

      {/* Lista / Tabela */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-500 gap-2">
          <Loader2 size={20} className="animate-spin text-cello-800" />
          <span>Carregando usuários...</span>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 border-b border-gray-200 text-xs font-bold uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4">Usuário</th>
                  <th className="px-6 py-4">E-mail</th>
                  <th className="px-6 py-4">Cargo Atual</th>
                  <th className="px-6 py-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((u) => {
                  const isCurrentLoggedUser = (session?.user as any)?.id === u._id;

                  return (
                    <tr key={u._id} className="hover:bg-gray-50/50 transition">
                      {/* Avatar e Nome */}
                      <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                        {u.image ? (
                          <img
                            src={u.image}
                            alt={u.name || "Avatar"}
                            className="w-9 h-9 rounded-full object-cover border border-gray-200"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-cello-800 flex items-center justify-center text-white">
                            <UserIcon size={18} />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold">{u.name || "Sem Nome"}</p>
                          {isCurrentLoggedUser && (
                            <span className="text-[10px] text-cello-800 font-bold bg-cello-50 px-1.5 py-0.5 rounded">
                              Você
                            </span>
                          )}
                        </div>
                      </td>

                      {/* E-mail */}
                      <td className="px-6 py-4 text-gray-500">{u.email}</td>

                      {/* Cargo (Badge) */}
                      <td className="px-6 py-4">
                        {u.role === "admin" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">
                            <ShieldCheck size={14} /> Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
                            <Eye size={14} /> Viewer
                          </span>
                        )}
                      </td>

                      {/* Botão de Troca de Cargo */}
                      <td className="px-6 py-4 text-right">
                        <select
                          value={u.role}
                          disabled={updatingId === u._id || isCurrentLoggedUser}
                          onChange={(e) =>
                            handleRoleChange(u._id, e.target.value as "admin" | "viewer")
                          }
                          className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-cello-800 disabled:opacity-50 cursor-pointer"
                        >
                          <option value="viewer">Viewer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}