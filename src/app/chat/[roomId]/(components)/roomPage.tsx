"use client";

import {
  ChatClientProvider,
  ChatRoomProvider,
  RoomOptionsDefaults,
} from "@ably/chat";
import { useAbly } from "@/contexts/AblyContext";
import ChatCointainer from "@/(components)/chat/ChatContainer";
import { useEffect, useState } from "react";
import { joinRoom } from "@/(actions)/room";

interface RoomProps {
  roomId: string;
}

export default function RoomPage({ roomId }: RoomProps) {
  const { chatClient } = useAbly();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const addUserToRoom = async () => {
      setLoading(true);
      try {
        await joinRoom(roomId);
      } catch (error) {
        console.error("Failed to join room:", error);
      } finally {
        setLoading(false);
      }
    };

    addUserToRoom();
  }, [roomId]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Entrando na sala...</div>;
  }

  return (
    <ChatClientProvider client={chatClient}>
      <ChatRoomProvider id={roomId} options={RoomOptionsDefaults}>
        <ChatCointainer />
      </ChatRoomProvider>
    </ChatClientProvider>
  );
}
