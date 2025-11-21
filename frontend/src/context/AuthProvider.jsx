import { useState, useEffect } from "react";
import AuthContext from "./AuthContext";
import API from "../pages/api";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    // 1️⃣ Restore instantly from localStorage
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // 2️⃣ Skip backend fetch right after login
    const justLoggedIn = sessionStorage.getItem("justLoggedIn") === "true";
    if (justLoggedIn) {
      sessionStorage.removeItem("justLoggedIn");
      setLoading(false);
      return;
    }

    // 3️⃣ If no token → done
    if (!token) {
      setLoading(false);
      return;
    }

    // 4️⃣ Fetch updated user (but DO NOT overwrite first-login state)
    API.get("/users/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        const fresh = res.data;
        const local = savedUser ? JSON.parse(savedUser) : {};

        const mergedUser = {
          ...fresh,
          // ⛔ Preserve first login value
          isFirstLogin: local.isFirstLogin ?? fresh.isFirstLogin,
        };

        setUser(mergedUser);
        localStorage.setItem("user", JSON.stringify(mergedUser));
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = (userData, token) => {
    sessionStorage.setItem("justLoggedIn", "true");
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
