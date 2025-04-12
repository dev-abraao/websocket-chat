"use client";

import { useEffect, useState } from "react";
import { joinRoom } from "@/(actions)/room";
import { AblyProvider } from "@/contexts/AblyContext";
import dynamic from "next/dynamic";

// Importar o componente de maneira dinâmica para evitar problemas de hydration
const ChatClientWrapper = dynamic(() => import("./ChatClientWrapper"), {
  ssr: false,
  loading: () => <div className="flex justify-center items-center h-screen">Carregando sala...</div>
});

interface RoomProps {
  roomId: string;
  userId: string;
}

export default function RoomPage({ roomId, userId }: RoomProps) {
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
    <AblyProvider userId={userId}>
      <ChatClientWrapper roomId={roomId} />
    </AblyProvider>
  );
}
