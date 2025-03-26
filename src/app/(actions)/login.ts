import { createSession, decrypt } from "@/(lib)/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "prisma/prisma";

export async function checkLogin() {
    const cookieStore = await cookies()
    const session = cookieStore.get("session")?.name

    if (!session) {
        console.error("Session cookie is missing");
        return;
    }

    const payload = await decrypt(session)
    const userId = payload?.sub

    if (!userId) {
        console.error("User ID is missing in the payload");
        return;
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })
    
        if (!user) {
            console.log("error ao logar")
        }   

        await createSession(userId)
        redirect('/chat')   
    } catch (error) {
        return {
            message: `Failed to login: ${error instanceof Error ? error.message : 'Unknown error'}`,
          }
    }
}