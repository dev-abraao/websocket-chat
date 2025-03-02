"use client";
import * as Ably from "ably";
import {
  ChatClient,
  ChatClientProvider,
  ChatRoomProvider,
  RoomOptionsDefaults,
  useMessages,
} from "@ably/chat";
import SendMessage from "./components/messagehandler/SendMsg";
import Msg from "./components/messagelistener/Listener";

export default function Home() {
  const realtimeClient = new Ably.Realtime({
    key: "NhJcoA.Nyx0fQ:GYtfcRdXXu-_DEno3r8dS8rJBl_ojYaSTVLSfYtaV3U",
    clientId: "jinzo",
  });
  const chatClient = new ChatClient(realtimeClient);

  return (
    <ChatClientProvider client={chatClient}>
      <ChatRoomProvider id="room-id" options={RoomOptionsDefaults}>
        <SendMessage />
        <Msg />
      </ChatRoomProvider>
    </ChatClientProvider>
  );
}
