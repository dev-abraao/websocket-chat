"use client";
import {
  ChatClientProvider,
  ChatRoomProvider,
  RoomOptionsDefaults,
} from "@ably/chat";
import ChatBox from "@/(components)/chat/ChatContainer";
import { useAbly } from "@/contexts/AblyContext";

export default function Home() {
  // const realtimeClient = new Ably.Realtime({
  //   key: process.env.NEXT_PUBLIC_API_KEY,
  //   clientId: "jinzo",
  // });
  // const chatClient = new ChatClient(realtimeClient);

  const { chatClient } = useAbly();

  return (
    <ChatClientProvider client={chatClient}>
      <ChatRoomProvider id="room-id" options={RoomOptionsDefaults}>
        <ChatBox />
      </ChatRoomProvider>
    </ChatClientProvider>
  );
}
