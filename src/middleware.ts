import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Função para decodificar o JWT sem acessar o banco de dados
async function decodeJWT(token: string) {
  try {
    const secretKey = process.env.SESSION_SECRET;
    if (!secretKey) throw new Error("SESSION_SECRET não está definido");
    
    const encodedKey = new TextEncoder().encode(secretKey);
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    });
    
    // Verificar se o token expirou
    const expiresAt = payload.expiresAt as string;
    if (expiresAt && new Date(expiresAt) < new Date()) {
      return null;
    }
    
    return payload;
  } catch (error) {
    console.error("Erro ao decodificar JWT:", error);
    return null;
  }
}

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
    const sessionData = await decodeJWT(sessionToken);
    
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
