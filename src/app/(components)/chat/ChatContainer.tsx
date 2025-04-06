import Header from "./Header";
import ChatBox from "./ChatBox";
import InputText from "./InputText";
import ViewRooms from "../rooms/viewRooms";

export default function ChatContainer() {
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 bg-white shadow-lg">
          <ViewRooms />
        </div>
        <div className="flex-1 flex flex-col">
          <ChatBox />
          <div className="p-4 bg-white shadow-lg">
            <InputText />
          </div>
        </div>
      </div>
    </div>
  );
}
