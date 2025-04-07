import LogoutBtn from "../auth/LogoutBtn";
import NameModal from "./NameModal";

const Header = () => {
  return (
    <div className="flex flex-row justify-between m-0 p-[7px] px-20 bg-[#7A80DA]  text-white">
      <h5 className="title text-center text-[35px] ">ChatTalk!</h5>
      <div className="flex flex-row gap-2 items-center">
        <NameModal />
        <LogoutBtn />
      </div>
    </div>
  );
};

export default Header;
