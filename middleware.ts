import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const ADMIN_ONLY_ROUTES = ["/novoItem", "/admin/usuarios"];

const VIEWER_ADMIN_ROUTES = ["/", "/historico"];

const PROTECTED_ROUTES = [...ADMIN_ONLY_ROUTES, ...VIEWER_ADMIN_ROUTES, "/sala"];

const APROVACAO_ROUTE = "/aguardandoAprovacao";

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

  const role = token.role as string;
  const localizacao = token.localizacao as string | null;

  if (role === "aprovacao" && pathname !== APROVACAO_ROUTE) {
    return NextResponse.redirect(new URL(APROVACAO_ROUTE, request.url));
  }

  if (pathname.startsWith("/salas/")) {
    if (role === "admin" || role === "viewer") return NextResponse.next();

    if (role === "sala" && localizacao) {
      const slugEsperado = localizacao
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") 
        .replace(/\s+/g, "-");       

      const slugAtual = pathname.split("/salas/")[1]?.split("/")[0];

      if (slugAtual === slugEsperado) return NextResponse.next();

      return NextResponse.redirect(
        new URL(`/salas/${slugEsperado}`, request.url)
      );
    }

    return NextResponse.redirect(new URL("/login", request.url));
  }

  const isAdminOnly = ADMIN_ONLY_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(r + "/")
  );

  if (isAdminOnly && role !== "admin") {
    return roleDefaultRedirect(role, localizacao, request);
  }

  const isViewerAdminRoute = VIEWER_ADMIN_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(r + "/")
  );

  if (isViewerAdminRoute && role === "sala") {
    return roleDefaultRedirect(role, localizacao, request);
  }

  return NextResponse.next();
}


function roleDefaultRedirect(
  role: string,
  localizacao: string | null,
  request: NextRequest
) {
  if (role === "sala" && localizacao) {
    const slug = localizacao
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-");
    return NextResponse.redirect(new URL(`/salas/${slug}`, request.url));
  }
  if (role === "aprovacao") {
    return NextResponse.redirect(new URL("/aguardandoAprovacao", request.url));
  }
  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: [
    "/novoItem/:path*",
    "/historico/:path*",
    "/admin/usuarios/:path*",
    "/salas/:path*",
    "/:path*",
  ],
};