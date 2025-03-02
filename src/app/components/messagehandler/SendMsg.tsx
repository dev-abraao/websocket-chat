import { useMessages } from "@ably/chat";

export default function SendMessage() {
  const { send } = useMessages();

  const handleMessageSend = () => {
    send({ text: "Hello, World!" });
  };

  return (
    <div>
      <button onClick={handleMessageSend}>Send Message</button>
    </div>
  );
}
