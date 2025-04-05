import { prisma } from "prisma/prisma";
import { cookies } from "next/headers";
import { decrypt } from "@/(lib)/session";

export default async function createRoom(formData: FormData) {
  const roomName = formData.get("name") as string;
  const cookie = (await cookies()).get("session")?.value;
  const decryptedCookie = await decrypt(cookie);
  const userId = decryptedCookie?.sub;

  await prisma.rooms.create({
    data: {
      name: roomName,
    },
  });
}
