"use client";
import {
  ChatClientProvider,
  ChatRoomProvider,
  RoomOptionsDefaults,
} from "@ably/chat";
import ChatBox from "@/(components)/chat/ChatContainer";
import { useAbly } from "@/contexts/AblyContext";
import { useEffect, useState } from "react";
import { getDefaultRoomId } from "@/(actions)/room";

export default function Home() {
  const [Room, setRoom] = useState<string | null>(null);

  useEffect(() => {
    getDefaultRoomId()
      .then((room) => {
        return setRoom(room);
      })
      .catch((error) => {
        console.error("Error fetching default room:", error);
      });
  }, []);

  const { chatClient } = useAbly();

  return (
    <ChatClientProvider client={chatClient}>
      <ChatRoomProvider id={Room} options={RoomOptionsDefaults}>
        <ChatBox />
      </ChatRoomProvider>
    </ChatClientProvider>
  );
}
