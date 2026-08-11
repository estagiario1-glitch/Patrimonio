import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Rotas que exigem role "admin"
const ADMIN_ONLY_ROUTES = ["/novoItem", "/admin/usuarios"];

// Rotas protegidas (combina rotas normais + rotas de admin)
const PROTECTED_ROUTES = ["/historico", ...ADMIN_ONLY_ROUTES];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(r + "/")
  );

  if (!isProtected) return NextResponse.next();

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  const isAdminOnly = ADMIN_ONLY_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(r + "/")
  );

  if (isAdminOnly && token.role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/novoItem/:path*", "/historico/:path*", "/admin/usuarios/:path*"], // 👈 Adicionado aqui
};