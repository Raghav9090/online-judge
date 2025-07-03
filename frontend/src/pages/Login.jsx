import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/login", formData, {
        withCredentials: true,
      });

      const res = await axios.get("http://localhost:5000/api/dashboard", {
        withCredentials: true,
      });

      const currentUser = res.data?.user;

      if (!currentUser) throw new Error("Could not fetch user info");

      setUser(currentUser);

      if (currentUser.usertype === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-zinc-900 transition-colors">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-zinc-800 text-black dark:text-white p-6 rounded shadow-md w-96 transition-all"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
        {["email", "password"].map((field) => (
          <input
            key={field}
            type={field === "password" ? "password" : "text"}
            name={field}
            placeholder={field}
            value={formData[field]}
            onChange={handleChange}
            className="mb-3 p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-700 text-black dark:text-white w-full rounded outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        ))}
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white p-2 rounded mt-2 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
