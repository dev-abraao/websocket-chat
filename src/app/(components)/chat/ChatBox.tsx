import { useState } from "react";
import InputName from "./InputName";
import { useMessages } from "@ably/chat";

// Definição explícita do tipo da mensagem (caso não esteja bem definido pelo Ably)
interface ChatMessage {
  text: string;
  metadata?: {
    username?: string;
  };
}

function ChatBox() {
  // Estado tipado corretamente
  const [receivedMessages, setReceivedMessages] = useState<ChatMessage[]>([]);
  const [name, setName] = useState("Anônimo");

  useMessages({
    listener: (event: { message: ChatMessage }) => {
      setReceivedMessages((prevMessages) => [...prevMessages, event.message]);
    },
  });

  return (
    <div className="flex flex-col items-center">
      <div className="w-[60%] flex justify-end">
        <InputName name={name} setName={setName} />
      </div>

      <div className="bg-white w-[60%] shadow-lg rounded-lg p-4 h-[65vh] max-h-[70vh] overflow-auto flex flex-col">
        {Array.isArray(receivedMessages) &&
          receivedMessages.map((msg, index) => {
            const isMyMessage =
              msg.metadata?.username === localStorage.getItem("name");

            return (
              <div
                key={index}
                className={`w-max max-w-[45%] break-words  m-1 ${
                  isMyMessage
                    ? "bg-[#7A80DA] p-3 self-end text-right text-white rounded-tl-3xl rounded-b-3xl"
                    : "bg-gray-300 pb-4 self-start text-left text-black rounded-tr-3xl rounded-b-3xl"
                }`}
              >
                <div className="flex justify-between w-full">
                  {!isMyMessage && (
                    <span className="bg-[#7A80DA] text-white rounded-tr-3xl rounded-br-3xl px-2 py-1font-bold">
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
