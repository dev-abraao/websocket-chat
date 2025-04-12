import { NextRequest, NextResponse } from "next/server";
import { validateSession } from "@/(lib)/session";
import { saveMessage } from "@/(actions)/message";
import { z } from "zod";

// Schema de validação para a mensagem
const MessageSchema = z.object({
  content: z.string().max(150, { message: "Mensagem não pode exceder 150 caracteres" }),
  roomId: z.string().uuid({ message: "ID da sala inválido" }),
});

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const sessionToken = request.cookies.get("session")?.value;
    if (!sessionToken) {
      return NextResponse.json(
        { error: "Não autorizado. Faça login para enviar mensagens." },
        { status: 401 }
      );
    }

    // Validar sessão usando a nova função
    const sessionData = await validateSession(sessionToken);
    if (!sessionData) {
      return NextResponse.json(
        { error: "Sessão inválida ou expirada. Faça login novamente." },
        { status: 401 }
      );
    }

    // Obter e validar os dados da requisição
    const data = await request.json();
    const result = MessageSchema.safeParse(data);
    
    if (!result.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: result.error.format() },
        { status: 400 }
      );
    }
    
    // Salvar a mensagem
    const { content, roomId } = result.data;
    const message = await saveMessage({ 
      content, 
      roomId, 
      userId: sessionData.userId 
    });
    
    return NextResponse.json({ 
      success: true, 
      message,
      user: {
        id: sessionData.userId,
        username: sessionData.username
      } 
    }, { status: 201 });
  } catch (error) {
    console.error("Erro ao processar mensagem:", error);
    return NextResponse.json(
      { error: "Falha ao processar a mensagem" },
      { status: 500 }
    );
  }
}