"use server";

import { IUser, nameModalState } from "@/(lib)/definitions";
import { decrypt } from "@/(lib)/session";
import { cookies } from "next/headers";
import { prisma } from "@/(lib)/db";
import { NameModalSchema } from "@/(lib)/definitions";

export async function getUserId() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) {
    console.log("Sessão não encontrada");
    return null;
  }

  try {
    const payload = await decrypt(session);
    const userId = payload?.userId;

    if (!userId) {
      console.error("UserID não encontrado no payload da sessão");
      return null;
    }

    return userId;
  } catch (error) {
    console.error("Erro ao decodificar a sessão:", error);
    return null;
  }
}

export async function getUser(userId: string): Promise<IUser | null> {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  console.log("User:", user);

  if (!user) {
    console.error("User not found");
    return null;
  }

  return user;
}

export async function fetchUsername(): Promise<string | undefined | null> {
  const userId = await getUserId() as string;
  if (userId) {
    if (typeof userId === "string") {
      const user = await getUser(userId);
      return user?.username;
    }
  }
  return null;
}


export async function updateUsername(
  state: nameModalState,
  formData: FormData
) {
  const result = NameModalSchema.safeParse({
    username: formData.get("username"),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { username } = result.data;
  const userId = await getUserId();

  if (!userId) {
    throw new Error("User ID is null or undefined");
  }

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      username: username,
    },
  });
  return {
    data: { success: true || false },
  };
}

export async function hasUserCreatedRoom() {
  const userId = await getUserId();
  
  if (!userId) {
    return false;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId as string },
    select: { hasCreatedRoom: true }
  });

  return user?.hasCreatedRoom ?? false;
}
