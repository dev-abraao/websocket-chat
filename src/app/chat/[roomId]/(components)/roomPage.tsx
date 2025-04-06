"use client";

import {
  ChatClientProvider,
  ChatRoomProvider,
  RoomOptionsDefaults,
} from "@ably/chat";
import { useAbly } from "@/contexts/AblyContext";
import ChatCointainer from "@/(components)/chat/ChatContainer";

interface RoomProps {
  roomId: string;
}

export default function RoomPage({ roomId }: RoomProps) {
  const { chatClient } = useAbly();

  return (
    <ChatClientProvider client={chatClient}>
      <ChatRoomProvider id={roomId} options={RoomOptionsDefaults}>
        <ChatCointainer />
      </ChatRoomProvider>
    </ChatClientProvider>
  );
}
