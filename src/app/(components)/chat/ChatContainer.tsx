"use client";

import Header from "./Header";
import ChatBox from "./ChatBox";
import InputText from "./InputText";
import ViewRooms from "../rooms/viewRooms";

export default function ChatContainer() {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden relative">
        <div className="z-30">
          <ViewRooms />
        </div>
        <div className="flex-1 flex flex-col w-full absolute inset-0">
          <div className="flex-1 overflow-scroll">
            <ChatBox />
          </div>
          <div className="p-2 sm:p-4 shadow-lg bg-white">
            <InputText />
          </div>
        </div>
      </div>
    </div>
  );
}
