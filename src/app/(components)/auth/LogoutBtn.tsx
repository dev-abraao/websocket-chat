import { logout } from "@/(actions)/auth";
import { FiLogOut } from "react-icons/fi";

export default function LogoutBtn() {
  const handleLogout = async () => {
    await logout();
  };

  return (
    <button
      className="btn btn-primary hover:bg-[#5a62ce] py-2 px-2 rounded-lg"
      onClick={handleLogout}
    >
      <FiLogOut size={20} />
    </button>
  );
}
