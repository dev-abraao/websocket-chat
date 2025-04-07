import Header from "./Header";
import ChatBox from "./ChatBox";
import InputText from "./InputText";
import ViewRooms from "../rooms/viewRooms";

export default function ChatContainer() {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <div className="">
          <ViewRooms />
        </div>
        <div className="flex-1 flex flex-col">
          <ChatBox />
          <div className="p-4 shadow-lg">
            <InputText />
          </div>
        </div>
      </div>
    </div>
  );
}
