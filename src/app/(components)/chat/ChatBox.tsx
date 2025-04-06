"use client";

import { useState, useEffect } from "react";
import { useMessages } from "@ably/chat";
import { fetchUsername } from "@/(actions)/user";

interface ChatMessage {
  text: string;
  metadata?: {
    username?: string;
  };
}

function ChatBox() {
  const [receivedMessages, setReceivedMessages] = useState<ChatMessage[]>([]);
  const [myUsername, setMyUsername] = useState<string | null>(null);

  useEffect(() => {
    const getUsername = async () => {
      const name = await fetchUsername();
      setMyUsername(name ?? null);
    };
    getUsername();
  }, []);

  useMessages({
    listener: (event: { message: ChatMessage }) => {
      setReceivedMessages((prev) => [...prev, event.message]);
    },
  });

  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-full p-4 overflow-y-auto space-y-4">
        {receivedMessages.map((msg, index) => {
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
        })}
      </div>
    </div>
  );
}

export default ChatBox;
