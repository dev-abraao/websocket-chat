"use client";
import { createContext, useContext, useEffect, useState } from "react";
import * as Ably from "ably";
import { ChatClient } from "@ably/chat";
import { MdRefresh } from "react-icons/md";

interface AblyContextType {
  realtimeClient: Ably.Realtime | null;
  chatClient: ChatClient | null;
}

const AblyContext = createContext<AblyContextType | null>(null);

export function AblyProvider({
  userId,
  children,
}: {
  userId?: string;
  children: React.ReactNode;
}) {
  const [clients, setClients] = useState<AblyContextType | null>(null);

  useEffect(() => {
    const realtimeClient = new Ably.Realtime({
      key: process.env.NEXT_PUBLIC_API_KEY,
      clientId: userId || "client",
    });
    
    const chatClient = new ChatClient(realtimeClient);
    
    setClients({ realtimeClient, chatClient });
    
    return () => {
      realtimeClient?.close();
    };
  }, [userId]);

  if (!clients) {
    return (
      <div className="flex justify-center items-center h-screen">
        <MdRefresh className="animate-spin h-16 w-16 text-blue-500" />
      </div>
    );
  }
  
  return (
    <AblyContext.Provider value={clients}>
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
