import CreateRoomForm from "../rooms/createRoomForm";
import Header from "./Header";
import ChatBox from "./ChatBox";
import InputText from "./InputText";
import LogoutBtn from "../auth/LogoutBtn";

export default function ChatCointainer() {
  return (
    <div className="bg-[#F4F4F4] h-screen ">
      <Header />
      <CreateRoomForm />
      <LogoutBtn />
      <ChatBox />
      <InputText />
    </div>
  );
}
