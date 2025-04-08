"use client";

import { useState, useEffect, useRef } from "react";
import { useMessages, useRoom, Message } from "@ably/chat";
import InputText from "./InputText";
import { getMessagesByRoomId } from "@/(actions)/message";
import { fetchUsername } from "@/(actions)/user";

interface DbMessage {
  id: string;
  content: string;
  username: string;
  createdAt: Date;
}

export default function ChatContainer() {
  const [dbMessages, setDbMessages] = useState<DbMessage[]>([]);
  const [realtimeMessages, setRealtimeMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Obter a sala atual
  const room = useRoom();
  const [roomId, setRoomId] = useState<string | null>(null);
  
  // Debug para verificar a estrutura do objeto room
  useEffect(() => {
    if (room) {
      console.log("Room object:", room);
      console.log("Room properties:", Object.keys(room));
      
      // Vamos tentar encontrar a propriedade que contém o ID da sala
      let foundRoomId = null;
      
      // Verificar se é um objeto com propriedade id
      if (typeof room === 'object' && room !== null) {
        if ('id' in room) {
          foundRoomId = (room as any).id;
        } else if ('channelId' in room) {
          foundRoomId = (room as any).channelId;
        } else if ('name' in room) {
          foundRoomId = (room as any).name;
        }
        
        // Se nada foi encontrado, vamos tentar acessar todas as propriedades
        if (!foundRoomId) {
          Object.entries(room).forEach(([key, value]) => {
            if (typeof value === 'string' && !foundRoomId) {
              console.log(`Possível candidato a roomId: ${key} = ${value}`);
              if (!foundRoomId) foundRoomId = value;
            }
          });
        }
      }
      
      console.log("Found roomId:", foundRoomId);
      if (foundRoomId) {
        setRoomId(foundRoomId);
      }
    }
  }, [room]);
  
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  
  // Configurar o listener de mensagens do Ably
  const { send } = useMessages({
    listener: (msg) => {
      console.log("Mensagem recebida via Ably:", msg.message);
      setRealtimeMessages((prevMessages) => [...prevMessages, msg.message]);
    },
  });

  // Carregar mensagens do banco de dados quando entrar na sala
  useEffect(() => {
    async function loadMessages() {
      if (!roomId) {
        console.log("RoomID não disponível ainda");
        return;
      }

      console.log("Carregando mensagens para sala:", roomId);
      
      try {
        setIsLoading(true);
        setError(null);
        
        const username = await fetchUsername();
        console.log("Username atual:", username);
        setCurrentUsername(username || null);
        
        console.log("Buscando mensagens do banco de dados...");
        const messages = await getMessagesByRoomId(roomId);
        console.log("Mensagens carregadas:", messages);
        
        if (messages && Array.isArray(messages)) {
          setDbMessages(messages);
          console.log("Estado de mensagens atualizado");
        } else {
          console.log("Nenhuma mensagem encontrada ou formato inválido");
          setDbMessages([]);
        }
      } catch (error) {
        console.error("Erro ao carregar mensagens:", error);
        setError("Falha ao carregar mensagens. Tente novamente.");
      } finally {
        setIsLoading(false);
      }
    }
    
    loadMessages();
  }, [roomId]);

  // Rolar para o final quando novas mensagens chegarem
  useEffect(() => {
    scrollToBottom();
  }, [dbMessages, realtimeMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Combinar mensagens do banco com mensagens em tempo real
  const allMessages = [
    ...dbMessages,
    ...realtimeMessages.map(msg => ({
      id: msg.timestamp || String(Date.now()), // Usar timestamp como ID para mensagens Ably
      content: msg.text,
      username: typeof msg.metadata === 'object' && msg.metadata && 'username' in msg.metadata 
        ? String(msg.metadata.username) 
        : "Anônimo",
      createdAt: new Date(msg.timestamp),
    }))
  ].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()); // Ordenar por tempo

  console.log("Total de mensagens combinadas:", allMessages.length);

  return (
    <div className="flex flex-col h-full">
      {/* Debug info */}
      {!roomId && (
        <div className="p-2 bg-yellow-100 text-yellow-800 text-xs">
          Aguardando ID da sala...
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin h-8 w-8 border-4 border-[#7A80DA] rounded-full border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-red-500">{error}</p>
            <button 
              className="mt-2 px-4 py-2 bg-[#7A80DA] text-white rounded-md"
              onClick={() => window.location.reload()}
            >
              Tentar novamente
            </button>
          </div>
        ) : allMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="bg-gray-50 p-5 rounded-full mb-4">
              <span className="text-gray-300 text-5xl">💬</span>
            </div>
            <h3 className="text-lg font-medium text-gray-500 mb-1">Nenhuma mensagem ainda</h3>
            <p className="text-gray-400 text-sm">Seja o primeiro a enviar uma mensagem!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {allMessages.map((msg, index) => {
              const isCurrentUser = msg.username === currentUsername;
              const timestamp = typeof msg.createdAt === 'string' 
                ? new Date(msg.createdAt) 
                : msg.createdAt;
              
              return (
                <div 
                  key={index} // Usando index como key é seguro aqui pois a lista é imutável
                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      isCurrentUser 
                        ? 'bg-[#7A80DA] text-white' 
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="flex items-baseline mb-1">
                      <span className={`font-medium ${isCurrentUser ? 'text-white' : 'text-gray-900'}`}>
                        {msg.username}
                      </span>
                      <span className={`text-xs ml-2 ${isCurrentUser ? 'text-white/80' : 'text-gray-500'}`}>
                        {timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <p className={`${isCurrentUser ? 'text-white' : 'text-gray-700'} break-words`}>
                      {msg.content}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-gray-200 bg-white">
        {roomId && <InputText roomId={roomId} send={send} />}
      </div>
    </div>
  );
}