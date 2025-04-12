import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { SessionPayload } from "@/lib/definitions";
import { cookies, headers } from "next/headers";
import { prisma } from "@/(lib)/db";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function createSession(userId: string) {
  // Configurar data de expiração (7 dias)
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // Criar token JWT para o cookie
  const sessionToken = await encrypt({ userId, expiresAt });

  // Obter dados da requisição para metadados
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || null;
  const ipAddress =
    headersList.get("x-forwarded-for") ||
    headersList.get("x-real-ip") ||
    "unknown";

  // Salvar sessão no banco de dados
  try {
    await prisma.session.create({
      data: {
        userId,
        token: sessionToken,
        expiresAt,
        userAgent,
        ipAddress:
          typeof ipAddress === "string"
            ? ipAddress.split(",")[0].trim()
            : "unknown",
      },
    });
  } catch (error) {
    console.error("Erro ao criar sessão no banco:", error);
  }

  // Definir cookie
  const cookieStore = await cookies();
  cookieStore.set("session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function validateSession(sessionToken: string) {
  if (!sessionToken) return null;

  try {
    // Verificar se a sessão existe e é válida no banco de dados
    const session = await prisma.session.findFirst({
      where: {
        token: sessionToken,
        isValid: true,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            login: true,
          },
        },
      },
    });

    if (!session) return null;

    // Atualizar lastActiveAt
    await prisma.session.update({
      where: { id: session.id },
      data: { lastActiveAt: new Date() },
    });

    return {
      sessionId: session.id,
      userId: session.userId,
      username: session.user.username,
      email: session.user.login,
    };
  } catch (error) {
    console.error("Erro ao validar sessão:", error);
    return null;
  }
}

export async function updateSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return null;

  const sessionData = await validateSession(session);
  if (!sessionData) {
    await deleteSession();
    return null;
  }

  // Se a sessão é válida, atualizar a data de expiração
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  try {
    await prisma.session.update({
      where: { id: sessionData.sessionId },
      data: { expiresAt },
    });
    // Atualizar o cookie também
    const cookieStore = await cookies();
    cookieStore.set("session", session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: expiresAt,
      sameSite: "lax",
      path: "/",
    });

    return sessionData;
  } catch (error) {
    console.error("Erro ao atualizar sessão:", error);
    return null;
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (sessionToken) {
    try {
      // Marcar a sessão como inválida no banco de dados
      await prisma.session.updateMany({
        where: { token: sessionToken },
        data: { isValid: false },
      });
    } catch (error) {
      console.error("Erro ao invalidar sessão no banco:", error);
    }
  }
  
  // Remover o cookie
  cookieStore.delete("session");
}