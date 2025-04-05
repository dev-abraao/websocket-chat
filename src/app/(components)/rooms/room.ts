import { prisma } from "prisma/prisma";
import { FormSchema, RoomFormState } from "@/(lib)/definitions";
import { cookies } from "next/headers";
import { decrypt } from "@/(lib)/session";

export default async function createRoom(
  state: RoomFormState,
  formData: FormData
) {
  const result = FormSchema.safeParse({
    name: formData.get("name"),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }
  const cookie = (await cookies()).get("session")?.value;

  if (!cookie) {
    throw new Error("No session found");
  }

  const decryptedCookie = await decrypt(cookie);
  const userId = decryptedCookie?.UserId as string | undefined;

  if (!userId) {
    throw new Error("User ID not found in session");
  }

  await prisma.rooms.create({
    data: {
      name: result.data.name,
      owner_id: userId, // Now TypeScript knows userId is not undefined
    },
  });
}
