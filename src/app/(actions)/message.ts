"use server";

import { prisma } from "@/(lib)/db";

interface SaveMessageProps {
  content: string;
  roomId: string;
  userId: string;
}

export async function saveMessage({ content, roomId, userId }: SaveMessageProps) {
  try {
    const message = await prisma.messages.create({
      data: {
        content,
        room_id: roomId,
        user_id: userId,
      },
    });
    
    return message;
  } catch (error) {
    console.error("Erro ao salvar mensagem:", error);
    throw error;
  }
}

export async function getMessagesByRoomId(roomId: string) {
  console.log("Buscando mensagens para a sala:", roomId);
  
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
        created_at: "asc", // Mensagens mais antigas primeiro
      },
      take: 100, // Limite de 100 mensagens para evitar sobrecarga
    });
    
    console.log(`Encontradas ${messages.length} mensagens na sala ${roomId}`);
    
    return messages.map(message => ({
      id: message.id,
      content: message.content,
      username: message.user.username,
      createdAt: message.created_at,
    }));
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error);
    return [];
  }
}