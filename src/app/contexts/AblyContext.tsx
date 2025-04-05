"use client";
import { createContext, useContext } from "react";
import * as Ably from "ably";
import { ChatClient } from "@ably/chat";

interface AblyContextType {
  realtimeClient: Ably.Realtime;
  chatClient: ChatClient;
}

const AblyContext = createContext<AblyContextType | null>(null);

export function AblyProvider({ children }: { children: React.ReactNode }) {
  const realtimeClient = new Ably.Realtime({
    key: process.env.NEXT_PUBLIC_API_KEY,
    clientId: "jinzo",
  });
  const chatClient = new ChatClient(realtimeClient);

  return (
    <AblyContext.Provider value={{ realtimeClient, chatClient }}>
      {children}
    </AblyContext.Provider>
  );
}

export function useAbly() {
  const context = useContext(AblyContext);
  if (!context) {
    throw new Error("useAbly must be used within an AblyProvider");
  }
  return context;
}
