import { useState } from "react";
import { useMessages, Message } from "@ably/chat";
import HandleMessage from "@/(handlers)/HandleMessage";
import InputName from "./InputName";
import CreateRoomForm from "../rooms/createRoomForm";
import Header from "./Header";
import ChatBox from "./ChatBox";
import InputText from "./InputText";
import LogoutBtn from "../auth/LogoutBtn";

export default function ChatCointainer() {
  return (
    <div className="bg-[#F4F4F4] h-screen ">
      <Header />
      <LogoutBtn />
      <ChatBox />
      <InputText />
    </div>
  );
}
