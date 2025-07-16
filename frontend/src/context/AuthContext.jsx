import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await axios.get("http://3.111.39.120:5000/api/dashboard", {
        withCredentials: true,
      });
      const currentUser = res.data?.user; // ✅ Extract just the user
      setUser(currentUser);

      // Store in localStorage too (for Home.jsx and refresh persistence)
      localStorage.setItem("userInfo", JSON.stringify(currentUser));
    } catch {
      setUser(null);
      localStorage.removeItem("userInfo");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 🧠 First try to load from localStorage if available
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setLoading(false);
    } else {
      // 🔄 Else fetch from backend
      fetchUser();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
