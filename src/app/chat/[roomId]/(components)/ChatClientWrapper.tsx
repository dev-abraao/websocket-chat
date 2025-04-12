"use client";

import {
  ChatClientProvider,
  ChatRoomProvider,
  RoomOptionsDefaults,
} from "@ably/chat";
import { useAbly } from "@/contexts/AblyContext";
import ChatCointainer from "@/(components)/chat/ChatContainer";

interface ChatClientWrapperProps {
  roomId: string;
}

export default function ChatClientWrapper({ roomId }: ChatClientWrapperProps) {
  const { chatClient } = useAbly();

  if (!chatClient) {
    return <div className="flex justify-center items-center h-screen">Conectando ao chat...</div>;
  }

  return (
    <ChatClientProvider client={chatClient}>
      <ChatRoomProvider id={roomId} options={RoomOptionsDefaults}>
        <ChatCointainer />
      </ChatRoomProvider>
    </ChatClientProvider>
  );
}