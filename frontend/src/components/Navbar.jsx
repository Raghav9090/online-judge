import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, setUser, loading } = useContext(AuthContext);

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
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <div className="text-xl font-bold text-blue-600">Online Judge</div>
      <div className="space-x-4">
        <Link to="/" className="text-gray-700 hover:text-blue-500">Home</Link>
        {!user && (
          <>
            <Link to="/signup" className="text-gray-700 hover:text-blue-500">Signup</Link>
            <Link to="/login" className="text-gray-700 hover:text-blue-500">Login</Link>
          </>
        )}
        {user && (
          <button onClick={handleLogout} className="text-red-600 hover:text-red-800">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
