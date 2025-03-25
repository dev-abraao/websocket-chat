import { SendMessage } from "@ably/chat";

export default function HandleMessage(
  e: React.FormEvent,
  message: string,
  setMessage: React.Dispatch<React.SetStateAction<string>>,
  send: SendMessage,
  name: string = "Anônimo"
) {
  e.preventDefault();
  
  if (message.trim() === "") return;
  
  send({
    text: message,
    metadata: {
      username: name
    }
  });
  
  setMessage("");
}
