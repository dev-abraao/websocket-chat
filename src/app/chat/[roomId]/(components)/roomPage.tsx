"use client";

import {
  ChatClientProvider,
  ChatRoomProvider,
  RoomOptionsDefaults,
} from "@ably/chat";
import { useAbly } from "@/contexts/AblyContext";
import ChatCointainer from "@/(components)/chat/ChatContainer";
import { useEffect } from "react";
import { joinRoom } from "@/(actions)/room";

interface RoomProps {
  roomId: string;
}

export default function RoomPage({ roomId }: RoomProps) {
  const { chatClient } = useAbly();

  useEffect(() => {
    const addUserToRoom = async () => {
      try {
        await joinRoom(roomId);
      } catch (error) {
        console.error("Failed to join room:", error);
      }
    };

    addUserToRoom();
  }, [roomId]);

  return (
    <ChatClientProvider client={chatClient}>
      <ChatRoomProvider id={roomId} options={RoomOptionsDefaults}>
        <ChatCointainer />
      </ChatRoomProvider>
    </ChatClientProvider>
  );
}
