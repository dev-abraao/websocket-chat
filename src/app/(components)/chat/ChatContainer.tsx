import Header from "./Header";
import ChatBox from "./ChatBox";
import InputText from "./InputText";
import LogoutBtn from "../auth/LogoutBtn";
import ViewRooms from "../rooms/viewRooms";
import NameModal from "./NameModal";

export default function ChatCointainer() {
  return (
    <div className="bg-[#F4F4F4] h-screen ">
      <Header />
      <ViewRooms />
      <LogoutBtn />
      <ChatBox />
      <NameModal />
      <InputText />
    </div>
  );
}
