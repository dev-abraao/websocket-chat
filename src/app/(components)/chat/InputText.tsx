"use client";
import HandleMessage from "@/(handlers)/HandleMessage";
import { useMessages } from "@ably/chat";
import { useState } from "react";
import { FiSend } from "react-icons/fi";
import CharacterCounter from "./CharacterCounter";

function InputText() {
  const [message, setMessage] = useState("");
  const { send } = useMessages();
  const MAX_LENGTH = 150;

  return (
    <form
      onSubmit={(e) => HandleMessage(e, message, setMessage, send)}
      className="flex gap-2"
    >
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Digite sua mensagem..."
        maxLength={MAX_LENGTH}
        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A80DA] focus:border-transparent"
      />
      <CharacterCounter text={message} maxLength={MAX_LENGTH} />
      <button
        type="submit"
        className="px-4 py-2 bg-[#7A80DA] text-white rounded-lg hover:bg-[#6269c5] transition-colors"
      >
        <FiSend size={20} />
      </button>
    </form>
  );
}

export default InputText;
