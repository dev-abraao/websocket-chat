"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useMessages } from "@ably/chat";
import { fetchUsername } from "@/(actions)/user";
import { getMessagesByRoomId } from "@/(actions)/message";
import { useParams } from "next/navigation";
import Image from "next/image";
import ImageModal from "./ImageModal";

interface ChatMessage {
  id?: string;
  text: string;
  metadata?: {
    username?: string;
    imageUrl?: string;
  };
  timestamp?: Date | number;
}

interface DbMessage {
  id: string;
  content: string;
  username: string;
  createdAt: Date;
  imageUrl?: string | null;
  type?: string;
}

function ChatBox() {
  const [receivedMessages, setReceivedMessages] = useState<ChatMessage[]>([]);
  const [dbMessages, setDbMessages] = useState<DbMessage[]>([]);
  const [myUsername, setMyUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
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

  const allMessages = useMemo(() => {
    const combined = [
      ...dbMessages.map(msg => ({
        id: msg.id,
        text: msg.content,
        metadata: { 
          username: msg.username,
          imageUrl: msg.imageUrl
        },
        timestamp: new Date(msg.createdAt).getTime(),
        type: msg.type || "text"
      })),
      ...receivedMessages.map(msg => ({
        ...msg,
        id: msg.id || `${Date.now()}-${Math.random()}`,
        timestamp: msg.timestamp ? new Date(msg.timestamp).getTime() : Date.now(),
        type: msg.metadata?.imageUrl ? "image" : "text"
      }))
    ];
    
    const uniqueMessages = combined.filter((v, i, a) => 
      a.findIndex(t => t.id === v.id) === i
    );
    
    return uniqueMessages.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
  }, [dbMessages, receivedMessages]);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      setIsAutoScroll(scrollHeight - (scrollTop + clientHeight) < 50);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isAutoScroll) {
      const isNewMessage = allMessages.length > dbMessages.length;
      scrollToBottom(isNewMessage ? 'smooth' : 'auto');
    }
  }, [allMessages, isAutoScroll, scrollToBottom, dbMessages.length]);

  return (
    <div className="flex-1 overflow-hidden">
      <div 
        ref={scrollContainerRef}
        className="h-full p-4 overflow-y-auto space-y-4"
      >
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
          allMessages.map((msg) => {
            const isMyMessage = msg.metadata?.username === myUsername;
            const hasImage = msg.metadata?.imageUrl || msg.type === "image";
            const imageUrl = msg.metadata?.imageUrl;

            return (
              <div
                key={msg.id}
                className={`flex ${isMyMessage ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[90%] md:max-w-[70%] break-words rounded-lg px-4 py-2 ${
                    isMyMessage && !imageUrl ? "bg-[#7A80DA] text-white" : "bg-white shadow-md"
                  }`}
                >
                  {!isMyMessage && (
                    <div className="text-xs text-[#7A80DA] font-semibold mb-1">
                      {msg.metadata?.username || "Usuário"}
                    </div>
                  )}
                  
                  {imageUrl && (
                    <div className="mb-2 mt-1">
                      <div 
                        onClick={() => setSelectedImage(imageUrl)}
                        className="cursor-pointer"
                      >
                        <Image
                          src={imageUrl}
                          width={300}
                          height={300}
                          priority
                          quality={100}
                          placeholder="blur"
                          blurDataURL={imageUrl}
                          alt="Imagem compartilhada"
                          className="max-w-full rounded-md hover:opacity-90 transition-opacity"
                        />
                      </div>
                    </div>
                  )}
                  
                  {(msg.text && (!hasImage || msg.text !== "📷 Imagem")) && (
                    <div className="text-sm">{msg.text}</div>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Image Modal */}
      <ImageModal 
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage || ''}
      />
    </div>
  );
}

export default ChatBox;