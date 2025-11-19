import { useState, useEffect } from "react";
import AuthContext from "./AuthContext";
import API from "../pages/api";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      const parsedUser = JSON.parse(storedUser);

      API.get("/users/me", { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
          // 🔥 MERGE server user + localStorage user
          // ensures isFirstLogin is never lost
          const updatedUser = {
            ...parsedUser,   // keeps isFirstLogin and role
            ...res.data,     // overwrites fields returned by backend
          };

          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        })
        .catch(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (userData, token) => {
    // Always store server version which contains correct isFirstLogin
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
