"use server";

import { prisma } from "@/(lib)/db";
import { z } from "zod";

// Schema de validação para a mensagem no servidor
const MessageSchema = z.object({
  content: z.string().max(150, { message: "Mensagem não pode exceder 150 caracteres" }),
  roomId: z.string(),
  userId: z.string(),
});

interface SaveMessageProps {
  content: string;
  roomId: string;
  userId: string;
}

// Add a type for the message returned from Prisma query
interface MessageWithUser {
  id: string;
  content: string;
  user_id: string;
  room_id: string;
  created_at: Date;
  user: {
    id: string;
    username: string;
  };
}

export async function saveMessage({ content, roomId, userId }: SaveMessageProps) {
  try {
    // Validar os dados antes de salvar
    const validatedData = MessageSchema.parse({ content, roomId, userId });
    
    const message = await prisma.messages.create({
      data: {
        content: validatedData.content,
        room_id: validatedData.roomId,
        user_id: validatedData.userId,
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
      createdAt: message.created_at,
      userId: message.user_id
    }));
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error);
    return [];
  }
}