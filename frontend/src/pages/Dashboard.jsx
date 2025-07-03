import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

function Dashboard() {
  const { user, setUser } = useContext(AuthContext);

  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState(null);

  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        "http://localhost:5000/api/update-profile",
        { username, email, password },
        { withCredentials: true }
      );
      setMsg("✅ Profile updated!");
      setUser(res.data.updatedUser); // Update context
      setPassword(""); // Clear password field
    } catch (err) {
      setMsg("❌ Update failed");
    }
  };

  return (
    <div className="flex justify-center mt-12 px-4">
      <div className="bg-white dark:bg-zinc-800 p-8 shadow-md rounded w-full max-w-md transition-colors duration-300">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          👤 My Profile
        </h2>

        <label className="block mb-2 font-medium text-gray-800 dark:text-gray-200">Username</label>
        <input
          type="text"
          className="w-full p-2 mb-4 border rounded bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label className="block mb-2 font-medium text-gray-800 dark:text-gray-200">Email</label>
        <input
          type="email"
          className="w-full p-2 mb-4 border rounded bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="block mb-2 font-medium text-gray-800 dark:text-gray-200">
          New Password (optional)
        </label>
        <input
          type="password"
          className="w-full p-2 mb-4 border rounded bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          onClick={handleUpdate}
        >
          Save Changes
        </button>

        {msg && (
          <p className="mt-4 text-center text-sm text-gray-700 dark:text-gray-300">{msg}</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
