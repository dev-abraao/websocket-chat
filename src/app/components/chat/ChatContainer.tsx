import { useState } from "react";
import { useMessages, Message } from "@ably/chat";

export default function ChatBox() {
  const [message, setMessage] = useState("");
  const [receivedMessages, setReceivedMessages] = useState<Message[]>([]);
  const [name, setName] = useState(localStorage.getItem("name") || "Anonimo");
  const { send } = useMessages({
    listener: (event) => {
      setReceivedMessages((prevMessages) => [...prevMessages, event.message]);
    },
  });

  const handleName = (event: React.FormEvent) => {
    event.preventDefault();
    localStorage.setItem("name", name);
  };

  const handleMessageSend = (e: React.FormEvent) => {
    e.preventDefault();
    // Ver a questão do nome (quando se tira o input de nome você não consegue enviar mensagens)
    if (message && name) {
      send({
        text: message,
        metadata: { username: name },
      });
      setMessage("");
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex-col justify-items-center">
      <div className="bg-white shadow-md rounded-lg p-4 mb-4">
        <h1>Chat</h1>
      </div>

      <div>
        <form onSubmit={handleName} className="flex">
          <p className="text-gray-700 mb-2 p-2">Nome</p>
          <input
            type="text"
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Confirmar
          </button>
        </form>
      </div>

      <div className="bg-white max-w-3xl mx-auto shadow-md rounded-lg p-4 mb-4 h-[60vh] overflow-y-auto">
        {Array.isArray(receivedMessages) &&
          receivedMessages.map((msg, index) => (
            <p key={index} className="message break-words">
              {typeof msg.metadata === "object" &&
              msg.metadata &&
              "username" in msg.metadata
                ? String(msg.metadata.username)
                : "Usuário"}{" "}
              : {msg.text}
            </p>
          ))}
      </div>

      <div className="bg-white shadow-md rounded-lg">
        <form onSubmit={handleMessageSend}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-grow border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}
