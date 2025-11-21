import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export default function PublicRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  const blockedPublicPages = ["/login", "/signup", "/home"];

  // 🚨 IMPORTANT: while loading, do NOTHING yet
  if (loading) return null;

  // If NOT logged in → allow public pages
  if (!user) return children;

  // ⭐ FIRST LOGIN SHOULD ALWAYS PROCEED (NO REDIRECT)
  if (user.isFirstLogin === true) return children;

  // If logged in AFTER first login → block access to public pages
  if (blockedPublicPages.includes(location.pathname)) {
    return user.role === "jobseeker"
      ? <Navigate to="/jobseeker-dashboard" replace />
      : <Navigate to="/recruiter-dashboard" replace />;
  }

  return children;
}
