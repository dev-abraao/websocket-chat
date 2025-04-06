'use server'

import { IUser } from "@/(lib)/definitions";
import { decrypt } from "@/(lib)/session";
import { cookies } from "next/headers";
import { prisma } from "prisma/prisma";

export async function getUserId() {
    const cookieStore = await cookies()
    const session = cookieStore.get("session")?.value

    if (!session) {
        console.error("Session cookie is missing");
        return;
    }

    const payload = await decrypt(session)
    const userId = payload?.userId as string | undefined

    if (!userId) {
        console.error("User ID is missing in the payload");
        return;
    }

    console.log("User ID:", userId)
    

    return userId
}

export async function getUser(userId: string): Promise<IUser | null> {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })

    console.log("User:", user)

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