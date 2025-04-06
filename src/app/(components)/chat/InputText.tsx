import HandleMessage from "@/(handlers)/HandleMessage";
import { Message, useMessages } from "@ably/chat";
import { useState } from "react";
import NameModal from "./NameModal";

function InputText() {
  const [message, setMessage] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [receivedMessages, setReceivedMessages] = useState<Message[]>([]);
  const { send } = useMessages({
    listener: (event) => {
      setReceivedMessages((prevMessages) => [...prevMessages, event.message]);
    },
  });

  return (
    <>
      <div className="flex flex-wrap justify-center items-center w-full mt-4">
        <div className="px-4">
          <NameModal />
        </div>
        <form
          onSubmit={(e) => HandleMessage(e, message, setMessage, send)}
          className="flex w-full max-w-[600px] gap-4"
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-grow border border-gray-300 rounded-lg w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-[#7A80DA] hover:bg-[#5a62ce] text-white font-bold py-2 px-4 rounded-lg"
          >
            Enviar
          </button>
        </form>
      </div>
    </>
  );
}

export default InputText;
