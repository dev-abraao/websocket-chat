"use server";

import { prisma } from "@/(lib)/db";

interface SaveMessageProps {
  content: string;
  roomId: string;
  userId: string;
  imageUrl?: string;
  type?:"text" | "image";
}

interface MessageWithUser {
  id: string;
  content: string;
  user_id: string;
  room_id: string;
  image_url: string | null;
  type: string;
  created_at: Date;
  user: {
    id: string;
    username: string;
  };
}

export async function saveMessage({ content, roomId, userId, imageUrl, type = "text" }: SaveMessageProps) {
  try {
    console.log("Saving message with data:", { content, roomId, userId, imageUrl, type });
    
    const message = await prisma.messages.create({
      data: {
        content,
        room_id: roomId,
        user_id: userId,
        image_url: imageUrl || null,
        type: type,
      },
    });

    console.log("Mensagem salva:", message.id);
    return message;
  } catch (error) {
    console.error("Erro ao salvar mensagem:", error);
    throw error;
  }
}

export async function getMessagesByRoomId(roomId: string) {
  console.log("Buscando mensagens para sala:", roomId);

  try {
    const messages = await prisma.messages.findMany({
      where: {
        room_id: roomId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        created_at: "asc",
      },
      take: 100,
    });

    console.log(`Encontradas ${messages.length} mensagens na sala ${roomId}`);

    return messages.map((message: MessageWithUser) => ({
      id: message.id,
      content: message.content,
      username: message.user.username,
      imageUrl: message.image_url,
      type: message.type,
      createdAt: message.created_at,
      userId: message.user_id
    }));
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error);
    return [];
  }
}