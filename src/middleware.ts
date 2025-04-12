import { NextResponse, NextRequest } from "next/server";
import { validateSession } from "@/(lib)/session";

export default async function middleware(request: NextRequest) {
  const sessionlessPaths = ["/login", "/"];
  const protectedPaths = ["/chat"];
  const path = request.nextUrl.pathname;
  const sessionToken = request.cookies.get("session")?.value;

  // Verifica se o caminho começa com "/chat/" (rotas dinâmicas de sala)
  const isRoomPath = path.startsWith("/chat/");
  
  // Se for uma rota protegida ou uma sala específica
  if ((protectedPaths.includes(path) || isRoomPath) && !sessionToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  
  // Se o usuário está tentando acessar uma sala específica, validar a sessão
  if (isRoomPath && sessionToken) {
    const sessionData = await validateSession(sessionToken);
    
    if (!sessionData) {
      // Sessão inválida ou expirada
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Se o usuário está logado e tenta acessar rotas que não precisam de login
  if (sessionlessPaths.includes(path) && sessionToken) {
    return NextResponse.redirect(new URL("/chat", request.url));
  }
}
