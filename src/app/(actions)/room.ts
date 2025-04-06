"use server";
import { prisma } from "prisma/prisma";
import { FormSchema, RoomFormState } from "@/(lib)/definitions";
import { getUserId } from "@/(actions)/user";

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

  const userId = await getUserId();

  if (!userId) {
    throw new Error("User ID not found in session");
  }

  await prisma.rooms.create({
    data: {
      name: result.data.name,
      owner_id: userId,
      created_at: new Date(),
    },
  });
}

export async function getRooms() {
  const rooms = await prisma.rooms.findMany({
    orderBy: {
      created_at: "desc",
    },
  });

  return rooms;
}
