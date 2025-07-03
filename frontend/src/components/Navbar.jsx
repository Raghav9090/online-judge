import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext"; // ✅

function Navbar() {
  const navigate = useNavigate();
  const { user, setUser, loading } = useContext(AuthContext);
  const { darkMode, toggleTheme } = useContext(ThemeContext); // ✅

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:5000/api/logout", {
        withCredentials: true,
      });
      setUser(null);
      navigate("/login");
    } catch {
      alert("Logout failed");
    }
  };

  if (loading) return null;

  return (
    <nav className="bg-base text-muted px-6 py-4 shadow flex justify-between items-center transition-all duration-300">
      <Link to="/" className="text-xl font-bold text-primary flex items-center">
        🚀 Online Judge
      </Link>

      <div className="space-x-4 flex items-center text-sm">
        {user && (
          <>
            <Link to="/problems" className="hover:text-accent transition">Problems</Link>
            <Link to="/submissions" className="hover:text-accent transition">Submissions</Link>
            {user.usertype === "admin" && (
              <Link to="/admin" className="hover:text-accent transition">Admin</Link>
            )}
          </>
        )}

        {!user ? (
          <>
            <Link to="/signup" className="hover:text-accent transition">Signup</Link>
            <Link to="/login" className="hover:text-accent transition">Login</Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition"
          >
            Logout
          </button>
        )}

        {/* 🌙 Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="border border-muted px-2 py-1 rounded hover:bg-accent hover:text-white transition"
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
