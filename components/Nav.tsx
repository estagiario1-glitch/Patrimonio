"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import navItems from "@/public/data/navItems.json";
import { AiOutlineMenu } from "react-icons/ai";
import { LogOut, User, ShieldCheck, Eye } from "lucide-react";

const Nav = () => {
  const { data: session } = useSession();
  const user = session?.user as any;
  const isAdmin = user?.role === "admin"; // 👈 Identifica se o usuário é Admin

  const [isVisible, setIsVisible]       = useState(true);
  const [lastScrollY, setLastScrollY]   = useState(0);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [imgError, setImgError]         = useState(false);

  // 🔒 Filtra os itens do menu: oculta adminOnly se o usuário NÃO for admin
  const filteredNavItems = Object.values(navItems).filter((item: any) => {
    if (item.adminOnly && !isAdmin) {
      return false;
    }
    return true;
  });

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== "undefined") {
        if (window.scrollY > lastScrollY && window.scrollY > 100) setIsVisible(false);
        else setIsVisible(true);
        setLastScrollY(window.scrollY);
      }
    };
    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  useEffect(() => {
    if (!userMenuOpen) return;
    const close = () => setUserMenuOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [userMenuOpen]);

  const handleDropdown = () => {
    document.getElementById("dropdownMenu")?.classList.toggle("hidden");
  };

  const roleLabel = isAdmin
    ? { label: "Admin", icon: <ShieldCheck size={12} />, color: "text-cyan-300" }
    : { label: "Viewer", icon: <Eye size={12} />, color: "text-zircon-200" };

  return (
    <nav
      className={`w-full bg-cello-800 sticky top-0 z-[100] transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex flex-row justify-between max-w-6xl mx-auto my-0 h-16 py-2 px-4 sm:px-8 items-center">

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex w-full justify-left gap-8">
          {/* ✅ Usando a lista filtrada */}
          {filteredNavItems.map((item: any, index) => (
            <li key={index} className="h-fit text-white transition-transform duration-200 hover:scale-105 hover:text-cello-100">
              <a href={item.path} className="hover:underline">{item.name}</a>
            </li>
          ))}
        </ul>

        {/* Mobile burger */}
        <div className="flex gap-4 items-center lg:hidden">
          <AiOutlineMenu
            className="burguer-menu text-white text-2xl hover:cursor-pointer"
            onClick={handleDropdown}
          />
        </div>

        {/* Mobile Dropdown */}
        <div
          className="absolute top-16 left-0 right-0 hidden z-40 bg-white shadow-2xl p-4 border-t border-gray-100"
          id="dropdownMenu"
        >
          <ul className="flex flex-col gap-4 items-end">
            {/* ✅ Usando a lista filtrada */}
            {filteredNavItems.map((item: any, index) => (
              <li key={index} className="w-full text-right h-fit text-gray-700 hover:text-gray-600">
                <a href={item.path} className="block py-2">{item.name}</a>
              </li>
            ))}
            
            {/* User Info no Mobile */}
            {session ? (
              <li className="w-full border-t border-gray-100 pt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {user?.image && !imgError ? (
                    <img
                      src={user.image}
                      alt="avatar"
                      className="w-8 h-8 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-cello-800 flex items-center justify-center text-white">
                      <User size={16} />
                    </div>
                  )}
                  <div className="text-left">
                    <p className="text-xs font-bold text-gray-800">{user?.name}</p>
                    <p className="text-[10px] text-gray-500">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="flex items-center gap-1 text-xs text-rose-600 font-semibold"
                >
                  <LogOut size={14} /> Sair
                </button>
              </li>
            ) : (
              <li className="w-full text-right pt-2 border-t border-gray-100">
                <a href="/login" className="block py-2 font-bold text-cello-800">Entrar</a>
              </li>
            )}
          </ul>
        </div>

        {/* User Menu (Desktop) */}
        {session ? (
          <div className="hidden lg:flex items-center flex-shrink-0 relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setUserMenuOpen((o) => !o)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-cello-700 transition text-white"
            >
              {user?.image && !imgError ? (
                <img
                  src={user.image}
                  alt="Avatar"
                  className="w-7 h-7 rounded-full object-cover border border-white/20"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-cello-600 flex items-center justify-center">
                  <User size={14} className="text-white" />
                </div>
              )}

              <div className="text-left">
                <p className="text-xs font-semibold leading-none">{user?.name || user?.email?.split("@")[0]}</p>
                <p className={`text-[10px] flex items-center gap-1 mt-0.5 ${roleLabel.color}`}>
                  {roleLabel.icon}
                  {roleLabel.label}
                </p>
              </div>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-12 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-50 py-1 overflow-hidden">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-xs font-semibold text-gray-700 truncate">{user?.email}</p>
                  <p className="text-[10px] text-gray-400">{roleLabel.label}</p>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition"
                >
                  <LogOut size={14} />
                  Sair
                </button>
              </div>
            )}
          </div>
        ) : (
          <a
            href="/login"
            className="hidden lg:flex items-center gap-2 px-4 py-1.5 text-sm font-semibold bg-white/10 hover:bg-white/20 text-white rounded-xl transition flex-shrink-0"
          >
            Entrar
          </a>
        )}
      </div>
    </nav>
  );
};

export default Nav;