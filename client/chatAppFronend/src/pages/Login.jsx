import { useState } from "react";
import { loginUser } from "../sevices/authService";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleLogin = async () => {
    try {
      setLoading(true);
      setErr("");

      const data = await loginUser({ email, password });
      localStorage.setItem("user", JSON.stringify(data.data));
      setUser(data.data);

      navigate("/chat");
    } catch (error) {
      setErr(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at center, #cfdde3 0%, #b6c9d1 35%, #9bb2bc 70%, #879ea8 100%)",
      }}
    >
      <div className="relative flex flex-col items-center w-full px-4">
        {/* Adjusted Card Size to max-w-md */}
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg z-10">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Welcome Back 👋
          </h2>

          {err && (
            <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm text-center">
              {err}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-200 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-sm text-center text-gray-600 mt-4">
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </p>
        </div>

        {/* Reflection adjusted to match max-w-md card size */}
        <div className="w-full max-w-md h-28 -mt-1 overflow-hidden opacity-100">
          <div
            className="w-full h-full bg-white rounded-2xl"
            style={{
              transform: "scaleY(-1)",
              filter: "blur(3px)",
              maskImage:
                "linear-gradient(to bottom, rgba(255,255,255,0.45), transparent)",
              WebkitMaskImage:
                "linear-gradient(to bottom, rgba(255,255,255,0.45), transparent)",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;