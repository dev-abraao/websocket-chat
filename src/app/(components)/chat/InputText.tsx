"use client";
import HandleMessage from "@/(handlers)/HandleMessage";
import { useState } from "react";
import { FiSend } from "react-icons/fi";
import CharacterCounter from "./CharacterCounter";

interface InputTextProps {
  roomId: string;
  send: (message: { text: string; metadata: { username: string } }) => void;
}

function InputText({ roomId, send }: InputTextProps) {
  const [message, setMessage] = useState("");
  const MAX_LENGTH = 150;

  return (
    <div className="w-full">
      <form
        onSubmit={(e) => HandleMessage(e, message, setMessage, send, roomId)}
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
          disabled={message.trim().length === 0}
          className={`px-4 py-2 rounded-lg transition-colors ${
            message.trim().length === 0
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-[#7A80DA] text-white hover:bg-[#6269c5]'
          }`}
        >
          <FiSend size={20} />
        </button>
      </form>
    </div>
  );
}

export default InputText;
