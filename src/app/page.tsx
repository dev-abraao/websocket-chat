"use client";
import * as Ably from "ably";
import {
  ChatClient,
  ChatClientProvider,
  ChatRoomProvider,
  RoomOptionsDefaults,
} from "@ably/chat";
import Msg from "./components/messagelistener/Listener";
import ChatContainer from "./components/chat/ChatContainer";

export default function Home() {
  const realtimeClient = new Ably.Realtime({
    key: "NhJcoA.Nyx0fQ:GYtfcRdXXu-_DEno3r8dS8rJBl_ojYaSTVLSfYtaV3U",
    clientId: "jinzo",
  });
  const chatClient = new ChatClient(realtimeClient);

  return (
    <ChatClientProvider client={chatClient}>
      <ChatRoomProvider id="room-id" options={RoomOptionsDefaults}>
        <Msg />
        <ChatContainer />
      </ChatRoomProvider>
    </ChatClientProvider>
  );
}
