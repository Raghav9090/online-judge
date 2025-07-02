import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function AdminRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  // Not logged in? → redirect to login
  if (!user) return <Navigate to="/login" />;

  // Logged in but not admin? → redirect to dashboard
  if (user.usertype !== "admin") return <Navigate to="/dashboard" />;

  // Admin? ✅ Allow access
  return children;
}

export default AdminRoute;
