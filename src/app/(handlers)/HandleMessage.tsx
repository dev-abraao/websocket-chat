import React, { Dispatch, SetStateAction } from "react";
import { fetchUsername } from "@/(actions)/user";

export default async function HandleMessage(
  e: React.FormEvent,
  message: string,
  setMessage: Dispatch<SetStateAction<string>>,
  send: (message: { text: string; metadata: { username: string } }) => void
) {
  e.preventDefault();

  const username = await fetchUsername();
  console.log("Username:", username);

  if (!username) {
    console.error("Username not found");
    return;
  }

  if (message.trim() !== "") {
    send({
      text: message,
      metadata: { username },
    });
    console.log(message);
    setMessage("");
  }
}
