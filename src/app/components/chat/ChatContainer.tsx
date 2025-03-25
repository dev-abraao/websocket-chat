import { useState, useRef, useEffect } from "react";
import { useMessages, Message } from "@ably/chat";
import HandleMessage from "@/app/handlers/HandleMessage";
import InputName from "./InputName";
import { FiSend, FiMessageCircle } from "react-icons/fi";

export default function ChatBox() {
  const [message, setMessage] = useState("");
  const [receivedMessages, setReceivedMessages] = useState<Message[]>([]);
  const [name, setName] = useState("Anônimo");
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [receivedMessages]);

  const { send } = useMessages({
    listener: (event) => {
      setReceivedMessages((prevMessages) => [...prevMessages, event.message]);
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center">
          <FiMessageCircle className="text-green-600 text-2xl mr-2" />
          <h1 className="text-xl font-semibold text-gray-800 tracking-tight">WeChat</h1>
        </div>
      </div>

      <InputName name={name} setName={setName} />

      <div className="flex-1 max-w-4xl mx-auto w-full px-5 py-6 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto bg-white rounded-xl border border-gray-200 p-6 mb-5 shadow-sm">
          {receivedMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-10">
              <div className="bg-gray-50 p-5 rounded-full mb-4">
                <FiMessageCircle className="text-gray-300 text-5xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-500 mb-1">Nenhuma mensagem ainda</h3>
              <p className="text-gray-400 text-sm">Seja o primeiro a enviar uma mensagem!</p>
            </div>
          ) : (
            Array.isArray(receivedMessages) &&
            receivedMessages.map((msg, index) => {
              const isCurrentUser = 
                typeof msg.metadata === "object" && 
                msg.metadata && 
                "username" in msg.metadata && 
                String(msg.metadata.username) === name;
              
              return (
                <div 
                  key={index} 
                  className={`mb-4 flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      isCurrentUser 
                        ? 'bg-green-50 border border-green-100 text-gray-800' 
                        : 'bg-white border border-gray-200 shadow-sm'
                    }`}
                  >
                    <div className="flex items-baseline mb-1">
                      <span className={`font-medium ${isCurrentUser ? 'text-green-700' : 'text-gray-800'}`}>
                        {typeof msg.metadata === "object" &&
                        msg.metadata &&
                        "username" in msg.metadata
                          ? String(msg.metadata.username)
                          : "Usuário"}
                      </span>
                      <span className="text-gray-400 text-xs ml-2">
                        {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <p className={`${isCurrentUser ? 'text-gray-700' : 'text-gray-700'} leading-relaxed`}>
                      {msg.text}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <form 
            onSubmit={(e) => HandleMessage(e, message, setMessage, send, name)}
            className="flex items-center p-3"
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="flex-1 border-none px-4 py-3 focus:outline-none text-gray-700"
              autoFocus
            />
            <button
              type="submit"
              disabled={!message.trim()}
              className={`flex items-center justify-center rounded-full h-10 w-10 transition-colors ${
                message.trim() 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <FiSend className="text-lg" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
