import { useMessages } from "@ably/chat";

export default function Msg() {
  useMessages({
    listener: (event) => {
      console.log("Received message: ", event.message);
    },
  });

  return <div></div>;
}
