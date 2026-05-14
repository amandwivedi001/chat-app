import { logOut } from "../sevices/authService";
import { useAuth } from "../context/AuthContext";
const Header = () => {
    const { user, setUser } = useAuth();

  const handleLogout = async() => {
    try {
        await logOut();
    } catch (error) {
        console.error("Logout failed:", error);
    }

    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <div className="h-15 bg-white border-b flex items-center justify-between px-6 shadow-sm">

      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
        <h1 className="font-bold text-lg">ChatApp</h1>
      </div>

      <div className="flex items-center gap-3">
        <img
          src={user?.avatar || "https://cdn-icons-png.flaticon.com/512/1946/1946429.png"}
          className="w-8 h-8 rounded-full"
        />
        <span className="text-sm font-medium">{user?.Username}</span>

        <button
          onClick={handleLogout}
          className="text-sm bg-red-500 text-white px-3 py-1 rounded-lg"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Header;