"use client";

import { useState } from "react";
import { useMessages } from "@ably/chat";
import { FiSend } from "react-icons/fi";
import { fetchUsername, getUserId } from "@/(actions)/user";
import { saveMessage } from "@/(actions)/message";
import { useParams } from "next/navigation";
import CharacterCounter from "./CharacterCounter";

function InputText() {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { send } = useMessages();
  const MAX_LENGTH = 150;
  const COOLDOWN_TIME = 500;
  const params = useParams();
  const roomId = params?.roomId as string;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (message.trim() === "" || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const username = await fetchUsername();
      const userId = await getUserId();

      if (!username || !userId) {
        console.error("Username ou userId não encontrado");
        return;
      }

      send({
        text: message,
        metadata: { username },
      });

      if (roomId) {
        await saveMessage({
          content: message,
          roomId,
          userId: userId as string,
        });
        console.log("Mensagem salva no banco de dados");
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }

    setMessage("");
    
    setTimeout(() => {
      setIsSubmitting(false);
    }, COOLDOWN_TIME);
  };

  return (
    <form
      onSubmit={handleSendMessage}
      className="flex gap-2"
    >
      <div className="flex-1 relative">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Digite sua mensagem..."
          maxLength={MAX_LENGTH}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A80DA] focus:border-transparent"
        />
        <CharacterCounter text={message} maxLength={MAX_LENGTH} />
      </div>
      <button
        type="submit"
        disabled={message.trim().length === 0 || isSubmitting}
        className={`px-4 py-2 rounded-lg transition-colors flex items-center justify-center ${
          message.trim().length === 0 || isSubmitting
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-[#7A80DA] text-white hover:bg-[#6269c5]'
        }`}
      >
        <FiSend size={20} />
      </button>
    </form>
  );
}

export default InputText;
