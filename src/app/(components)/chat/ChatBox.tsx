"use client";

import { useState, useEffect } from "react";
import { useMessages } from "@ably/chat";
import { fetchUsername } from "@/(actions)/user"; // ajuste o caminho se necessário

interface ChatMessage {
    text: string;
    metadata?: {
        username?: string;
    };
}

function ChatBox() {
    const [receivedMessages, setReceivedMessages] = useState<ChatMessage[]>([]);
    const [myUsername, setMyUsername] = useState<string | null>(null);

    useEffect(() => {
        const getUsername = async () => {
            const name = await fetchUsername();
            setMyUsername(name ?? null);
        };
        getUsername();
    }, []);

    useMessages({
        listener: (event: { message: ChatMessage }) => {
            setReceivedMessages((prev) => [...prev, event.message]);
        },
    });

    return (
        <div className="flex flex-col items-center">
            <div className="bg-white w-[60%] shadow-lg rounded-lg p-4 h-[65vh] max-h-[70vh] overflow-auto flex flex-col">
                {receivedMessages.map((msg, index) => {
                    const isMyMessage = msg.metadata?.username === myUsername;

                    return (
                        <div
                            key={index}
                            className={`w-max max-w-[45%] break-words  m-1 ${isMyMessage
                                    ? "bg-[#7A80DA] p-3 self-end text-right text-white rounded-tl-3xl rounded-b-3xl"
                                    : "bg-gray-300 pb-4 self-start text-left text-black rounded-tr-3xl rounded-b-3xl"
                                }`}
                        >
                            <div className="flex justify-between w-full">
                                {!isMyMessage && (
                                    <span className="bg-[#7A80DA] text-white rounded-tr-3xl  px-2 py-1 font-bold">
                                        {msg.metadata?.username || "Usuário"}
                                    </span>
                                )}
                            </div>
                            <div
                                className={`text-center ${!isMyMessage ? "mt-2 px-3" : ""}`}
                            >
                                {msg.text}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ChatBox;
