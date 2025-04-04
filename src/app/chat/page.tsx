"use client";
import * as Ably from "ably";
import {
  ChatClient,
  ChatClientProvider,
  ChatRoomProvider,
  RoomOptionsDefaults,
} from "@ably/chat";
import ChatContainer from "@/(components)/chat/ChatContainer";

export default function Home() {
  const realtimeClient = new Ably.Realtime({
    key: process.env.NEXT_PUBLIC_API_KEY,
    clientId: "jinzo",
  });
  const chatClient = new ChatClient(realtimeClient);

  return (
    <ChatClientProvider client={chatClient}>
      <ChatRoomProvider id="room-id" options={RoomOptionsDefaults}>
      <ChatContainer/>
      </ChatRoomProvider>
    </ChatClientProvider>
  );
}
