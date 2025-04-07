"use server";
import { prisma } from "@/(lib)/db";
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

/**
 * Adds the current user to a room
 * @param roomId The ID of the room to join
 * @returns void
 */
export async function joinRoom(roomId: string) {
  const userId = await getUserId();
  
  if (!userId) {
    throw new Error("User ID not found in session");
  }

  // Check if the room exists
  const room = await prisma.rooms.findUnique({
    where: { id: roomId },
  });

  if (!room) {
    throw new Error("Room not found");
  }

  // Add the user to the room if they're not already a member
  await prisma.userInRoom.upsert({
    where: {
      userId_roomId: {
        userId,
        roomId,
      },
    },
    update: {}, // No updates needed, just ensure the relationship exists
    create: {
      userId,
      roomId,
    },
  });
}

/**
 * Gets all users in a specific room
 * @param roomId The ID of the room
 * @returns List of users in the room
 */
export async function getRoomMembers(roomId: string) {
  const members = await prisma.userInRoom.findMany({
    where: { roomId },
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });

  return members.map(member => ({
    id: member.user.id,
    username: member.user.username,
    joinedAt: member.joinedAt
  }));
}
