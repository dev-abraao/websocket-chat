"use server";

import { IUser, nameModalState } from "@/(lib)/definitions";
import { decrypt } from "@/(lib)/session";
import { cookies } from "next/headers";
import { prisma } from "prisma/prisma";
import { NameModalSchema } from "@/(lib)/definitions";

export async function getUserId() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) {
    console.error("Session cookie is missing");
    return;
  }

  const payload = await decrypt(session);
  const userId = payload?.userId as string | undefined;

  if (!userId) {
    console.error("User ID is missing in the payload");
    return;
  }

  console.log("User ID:", userId);

  return userId;
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
  const userId = await getUserId();
  if (userId) {
    const user = await getUser(userId);
    return user?.username;
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
