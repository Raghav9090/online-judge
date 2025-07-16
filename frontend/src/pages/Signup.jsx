import { useState, useContext } from "react";
import axios from "axios";
import { ThemeContext } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";

function Signup() {
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    usertype: "user",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    const loading = toast.loading("Creating account...");
    try {
      const res = await axios.post("http://3.111.39.120:5000/api/signup", formData, {
        withCredentials: true,
      });

      toast.success(res.data.message || "Signup successful", { id: loading });
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed", { id: loading });
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        darkMode ? "bg-[#0f0f0f] text-white" : "bg-gray-100 text-black"
      }`}
    >
      <form
        onSubmit={handleSubmit}
        className={`w-full max-w-md p-8 rounded-xl shadow-md transition-colors duration-300 border ${
          darkMode
            ? "bg-[#1a1a1a] border-white/10 text-white"
            : "bg-white border-gray-200 text-black"
        }`}
      >
        <h2 className="text-2xl font-bold text-center mb-6">🚀 Sign Up</h2>

        {/* Username, Fullname, Email */}
        {["username", "fullname", "email"].map((field) => (
          <div key={field} className="mb-4">
            <label className="block mb-1 capitalize font-medium">{field}</label>
            <input
              type="text"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required
              className={`w-full p-2 rounded border outline-none transition ${
                darkMode
                  ? "bg-[#2a2a2a] border-white/10 text-white placeholder-gray-400"
                  : "bg-gray-100 border-gray-300 text-black placeholder-gray-600"
              }`}
              placeholder={`Enter ${field}`}
            />
          </div>
        ))}

        {/* Password Field */}
        <div className="mb-4 relative">
          <label className="block mb-1 font-medium">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className={`w-full p-2 pr-10 rounded border outline-none transition ${
              darkMode
                ? "bg-[#2a2a2a] border-white/10 text-white placeholder-gray-400"
                : "bg-gray-100 border-gray-300 text-black placeholder-gray-600"
            }`}
            placeholder="Enter password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute top-9 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        </div>

        {/* Confirm Password Field */}
        <div className="mb-4 relative">
          <label className="block mb-1 font-medium">Confirm Password</label>
          <input
            type={showConfirm ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className={`w-full p-2 pr-10 rounded border outline-none transition ${
              darkMode
                ? "bg-[#2a2a2a] border-white/10 text-white placeholder-gray-400"
                : "bg-gray-100 border-gray-300 text-black placeholder-gray-600"
            }`}
            placeholder="Confirm password"
          />
          <button
            type="button"
            onClick={() => setShowConfirm((prev) => !prev)}
            className="absolute top-9 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
          >
            {showConfirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        </div>

        {/* Usertype Dropdown */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">User Type</label>
          <select
            name="usertype"
            value={formData.usertype}
            onChange={handleChange}
            className={`w-full p-2 rounded border transition ${
              darkMode
                ? "bg-[#2a2a2a] border-white/10 text-white"
                : "bg-gray-100 border-gray-300 text-black"
            }`}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded transition duration-200"
        >
          Create Account
        </button>
      </form>
    </div>
  );
}

export default Signup;
