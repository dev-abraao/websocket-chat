import { logout } from "@/(actions)/auth";

export default function LogoutBtn() {
  const handleLogout = async () => {
    await logout();
  };

  return (
    <button className="btn btn-primary" onClick={handleLogout}>
      Logout
    </button>
  );
}
