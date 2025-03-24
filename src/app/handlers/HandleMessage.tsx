import React, { Dispatch, SetStateAction } from "react";

export default function HandleMessage(
    e: React.FormEvent, 
    message: string,
    setMessage: Dispatch<SetStateAction<string>>,
    send: (message: { text: string; metadata: { username: string } }) => void
) {
    e.preventDefault();
    
    if (message.trim() !== "") {
      send({
        text: message,
        metadata: { username: localStorage.getItem("name") || "Anônimo" },
      });
      setMessage("");
    }
  };