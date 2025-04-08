"use client";

import { useState, useEffect, useRef } from "react";
import { useMessages } from "@ably/chat";
import { fetchUsername } from "@/(actions)/user";
import { getMessagesByRoomId } from "@/(actions)/message";
import { useParams } from "next/navigation";

interface ChatMessage {
  text: string;
  metadata?: {
    username?: string;
  };
  timestamp?: Date | number;
}

interface DbMessage {
  id: string;
  content: string;
  username: string;
  createdAt: Date;
}

function ChatBox() {
  const [receivedMessages, setReceivedMessages] = useState<ChatMessage[]>([]);
  const [dbMessages, setDbMessages] = useState<DbMessage[]>([]);
  const [myUsername, setMyUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const params = useParams() || {};
  const roomId = params.roomId as string;

  useEffect(() => {
    const getUsername = async () => {
      const name = await fetchUsername();
      setMyUsername(name ?? null);
    };
    getUsername();
  }, []);

  useEffect(() => {
    if (roomId) {
      const loadMessages = async () => {
        try {
          const messages = await getMessagesByRoomId(roomId);
          if (messages && Array.isArray(messages)) {
            setDbMessages(messages);
          }
        } catch (error) {
          console.error("Erro ao carregar mensagens:", error);
        } finally {
          setIsLoading(false);
        }
      };
      
      loadMessages();
    }
  }, [roomId]);

  useMessages({
    listener: (event: { message: ChatMessage }) => {
      setReceivedMessages((prev) => [...prev, event.message]);
    },
  });

  useEffect(() => {
    scrollToBottom();
  }, [receivedMessages, dbMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const allMessages = [
    ...dbMessages.map(msg => ({
      text: msg.content,
      metadata: { username: msg.username },
      timestamp: new Date(msg.createdAt).getTime()
    })),
    ...receivedMessages.map(msg => ({
      ...msg,
      timestamp: new Date(msg.timestamp || Date.now()).getTime()
    }))
  ].sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-full p-4 overflow-y-auto space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin h-8 w-8 border-4 border-[#7A80DA] rounded-full border-t-transparent"></div>
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
          allMessages.map((msg, index) => {
            const isMyMessage = msg.metadata?.username === myUsername;

            return (
              <div
                key={index}
                className={`flex ${
                  isMyMessage ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] break-words rounded-lg px-4 py-2 ${
                    isMyMessage ? "bg-[#7A80DA] text-white" : "bg-white shadow-md"
                  }`}
                >
                  {!isMyMessage && (
                    <div className="text-xs text-[#7A80DA] font-semibold mb-1">
                      {msg.metadata?.username || "Usuário"}
                    </div>
                  )}
                  <div className="text-sm">{msg.text}</div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

export default ChatBox;
