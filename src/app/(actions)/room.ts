"use server";
import { prisma } from "prisma/prisma";
import { RoomFormSchema, RoomFormState } from "@/(lib)/definitions";
import { getUserId } from "@/(actions)/user";

export default async function createRoom(
  state: RoomFormState,
  formData: FormData
) {
  const result = RoomFormSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
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
      description: result.data.description,
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

export async function getDefaultRoomId() {
  const room = await prisma.rooms.findFirst({
    where: {
      is_default_room: true,
    },
  });
  if (!room) {
    throw new Error("No default room found");
  }
  return room.id;
}
