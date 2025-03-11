import { useState } from "react";
import { useMessages, Message } from "@ably/chat";

export default function ChatBox() {
  const [message, setMessage] = useState("");
  const [receivedMessages, setReceivedMessages] = useState<Message[]>([]);
  const { send } = useMessages({
    listener: (event) => {
      setReceivedMessages((prevMessages) => [...prevMessages, event.message]);
    },
  });

  const handleMessageSend = (e: React.FormEvent) => {
    e.preventDefault();
    send({ text: message });
    setMessage("");
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Chat</h1>
      </div>
      <div className="body text-white">
        {Array.isArray(receivedMessages) && receivedMessages.map((msg, index) => (
          <p key={index} className="message">
            {msg.text}
          </p>
        ))}
      </div>
      <div className="footer">
        <form onSubmit={handleMessageSend}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit">Enviar</button>
        </form>
      </div>
    </div>
  );
}