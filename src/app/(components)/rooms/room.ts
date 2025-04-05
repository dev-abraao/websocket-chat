import { prisma } from "prisma/prisma";
import { cookies } from "next/headers";
import { decrypt } from "@/(lib)/session";

export default async function createRoom(formData: FormData) {
  const roomName = formData.get("name") as string;
  const cookie = (await cookies()).get("session")?.value;

  if (!cookie) {
    throw new Error("No session found");
  }

  const decryptedCookie = await decrypt(cookie);
  const userId = decryptedCookie?.sub;

  if (!userId) {
    throw new Error("User ID not found in session");
  }

  await prisma.rooms.create({
    data: {
      name: roomName,
      owner_id: userId,
    },
  });
}
