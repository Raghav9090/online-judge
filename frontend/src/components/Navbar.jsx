import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, setUser, loading } = useContext(AuthContext);
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  const [open, setOpen] = useState(false);
  const [problemMenuOpen, setProblemMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const problemMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (!menuRef.current?.contains(e.target)) setOpen(false);
      if (!problemMenuRef.current?.contains(e.target)) setProblemMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:5000/api/logout", { withCredentials: true });
      localStorage.removeItem("userInfo");
      setUser(null);
      navigate("/login");
    } catch {
      alert("Logout failed");
    }
  };

  if (loading) return null;

  const navBg = darkMode ? "bg-zinc-900 text-white" : "bg-white text-black";
  const linkHover = "hover:text-purple-500 transition";

  return (
    <nav className={`${navBg} px-6 py-4 shadow flex justify-between items-center`}>
      {/* Logo / Brand */}
      <Link to="/" className="text-xl font-bold flex items-center gap-1">
        🚀 <span className="hidden sm:inline">Online&nbsp;Judge</span>
      </Link>

      {/* Right‑side controls */}
      <div className="flex items-center gap-4 text-sm relative">
        {user && (
          <>
            {/* Problems dropdown */}
            <div className="relative" ref={problemMenuRef}>
              <button
                onClick={() => setProblemMenuOpen((prev) => !prev)}
                className={`hover:text-purple-500 transition`}
              >
                Problems ▾
              </button>
              {problemMenuOpen && (
                <div
                  className={`absolute top-8 left-0 w-44 rounded-md shadow-lg z-20 ${
                    darkMode ? "bg-zinc-800 text-white" : "bg-white text-black"
                  } py-2`}
                >
                  <Link
                    to="/problems"
                    onClick={() => setProblemMenuOpen(false)}
                    className="block px-4 py-2 hover:bg-purple-100 dark:hover:bg-zinc-700 transition"
                  >
                    View Problems
                  </Link>
                  {user.usertype === "admin" && (
                    <Link
                      to="/admin/add-problem"
                      onClick={() => setProblemMenuOpen(false)}
                      className="block px-4 py-2 hover:bg-purple-100 dark:hover:bg-zinc-700 transition"
                    >
                      ➕ Add Problem
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Other links */}
            <Link to="/submissions" className={linkHover}>Submissions</Link>
            {user.usertype === "admin" && (
              <Link to="/admin" className={linkHover}>Admin</Link>
            )}
          </>
        )}

        {!user && (
          <>
            <Link to="/signup" className={linkHover}>Signup</Link>
            <Link to="/login" className={linkHover}>Login</Link>
          </>
        )}

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="border px-2 py-1 rounded hover:bg-purple-600 hover:text-white transition"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        {/* User avatar dropdown */}
        {user && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold uppercase select-none"
            >
              {user.username?.charAt(0) || "U"}
            </button>
            {open && (
              <div
                className={`absolute right-0 mt-2 w-44 rounded-lg shadow-lg z-20 ${
                  darkMode ? "bg-zinc-800 text-white" : "bg-white text-black"
                } py-2`}
              >
                <Link
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2 hover:bg-purple-100 dark:hover:bg-zinc-700 transition"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-purple-100 dark:hover:bg-zinc-700 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
