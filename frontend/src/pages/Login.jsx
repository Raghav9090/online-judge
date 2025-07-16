import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast"; // ✅ Import toast

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      toast.loading("Logging in...", { id: "login" }); // ✅

      await axios.post("http://3.111.39.120:5000/api/login", formData, {
        withCredentials: true,
      });

      const res = await axios.get("http://3.111.39.120:5000/api/dashboard", {
        withCredentials: true,
      });

      const currentUser = res.data?.user;
      if (!currentUser) throw new Error("Could not fetch user info");

      setUser(currentUser);
      localStorage.setItem("userInfo", JSON.stringify(currentUser));

      toast.success("✅ Logged in successfully!", { id: "login" }); // ✅

      if (currentUser.usertype === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed", { id: "login" }); // ✅
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-[#0f0f0f] transition-colors">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-[#1e1e1e] text-black dark:text-white p-8 rounded-lg shadow-xl w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          🔐 Login
        </h2>

        {/* Email/Username */}
        <div className="mb-4">
          <input
            type="text"
            name="email"
            placeholder="Email or Username"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-[#2a2a2a] text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        {/* Password Field with toggle */}
        <div className="mb-6 relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 pr-10 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-[#2a2a2a] text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
          >
            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded transition duration-200"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
