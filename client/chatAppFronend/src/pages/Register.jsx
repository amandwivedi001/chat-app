import { registerUser } from "../sevices/authService";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import uploadFiles from "../sevices/upload";

const Register = () => {
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [avatar, setAvatar] = useState(null);

    const navigate = useNavigate();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setErr("");

        if (!form.name || !form.email || !form.password) {
            return setErr("All fields are required");
        }

        if (!emailRegex.test(form.email)) {
            return setErr("Invalid email format");
        }

        setLoading(true);

        try {
            let avatarUrl = "";

            if(avatar){
                avatarUrl = await uploadFiles(avatar);
            }
            await registerUser({
                name: form.name,
                email: form.email,
                password: form.password,
                avatar: avatarUrl || null
            });

            navigate("/");
        } catch (error) {
            console.log("FULL ERROR:", error);
            console.log("RESPONSE:", error?.response);
            setErr(error?.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    const uploadAvatar = async (e) => {
        try {
            const file = e.target.files[0];
            if (!file) return;
            setAvatar(file); 
        } catch (error) {
            setErr(error?.response?.data?.message || "Avatar uploading failed");
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
                <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg z-10">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                        Create Account 🚀
                    </h2>

                    {err && (
                        <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm text-center">
                            {err}
                        </div>
                    )}

                    <form onSubmit={handleRegister}>
                        <div className="mb-4">
                            <label className="block text-sm text-gray-600 mb-1">Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter your name"
                                className="w-full px-4 py-2 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm text-gray-600 mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                className="w-full px-4 py-2 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm text-gray-600 mb-1">Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter password"
                                className="w-full px-4 py-2 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm text-gray-600 mb-1">Avatar</label>
                            <input
                                type="file"
                                accept="image/*"
                                className="w-full mb-4 focus:outline-none"
                                onChange={uploadAvatar}
                            />

                            {avatar instanceof File && (
                                <img
                                    src={URL.createObjectURL(avatar)}
                                    alt="preview"
                                    className="w-20 h-20 rounded-full object-cover"
                                />
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50"
                        >
                            {loading ? "Creating account..." : "Register"}
                        </button>
                    </form>

                    <p className="text-sm text-center text-gray-600 mt-4">
                        Already have an account?{" "}
                        <Link to="/" className="text-blue-600 hover:underline">
                            Login
                        </Link>
                    </p>
                </div>

                {/* Reflection matching the max-w-md card size */}
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

export default Register;