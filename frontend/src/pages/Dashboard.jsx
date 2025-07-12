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
      setUser(res.data.updatedUser);
      setPassword("");
    } catch (err) {
      setMsg("❌ Update failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-white dark:bg-[#0f0f0f]">
      <div className="w-full max-w-lg p-8 bg-gray-50 dark:bg-zinc-800 rounded-lg shadow-lg border border-gray-200 dark:border-zinc-700">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          👤 My Profile
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
              Username
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 text-sm rounded border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 text-sm rounded border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
              New Password <span className="text-xs text-gray-500">(optional)</span>
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 text-sm rounded border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded text-sm font-semibold transition duration-150"
            onClick={handleUpdate}
          >
            Save Changes
          </button>

          {msg && (
            <p className="text-center text-sm mt-4 text-gray-700 dark:text-gray-300">{msg}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
