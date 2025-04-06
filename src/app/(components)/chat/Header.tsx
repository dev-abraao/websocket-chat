import LogoutBtn from "../auth/LogoutBtn";

const Header = () => {
  return (
    <div className="flex flex-row justify-between m-0 p-[7px] px-20 bg-[#7A80DA]  text-white">
      <h5 className="title text-center text-[35px] ">ChatTalk!</h5>
      <LogoutBtn />
    </div>
  );
};

export default Header;
