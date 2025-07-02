import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);      // null = not checked yet
  const [loading, setLoading] = useState(true); // true while checking

  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/dashboard", {
        withCredentials: true,
      });
      setUser(res.data); // { message: "Welcome User", user: { ... } }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
