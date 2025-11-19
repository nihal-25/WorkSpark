import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export default function PublicRoute({ children }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // Public pages that should be blocked for logged-in users
  const blockedPublicPages = ["/login", "/signup", "/home"];

  if (user && blockedPublicPages.includes(location.pathname)) {
    return user.role === "jobseeker"
      ? <Navigate to="/jobseeker-dashboard" replace />
      : <Navigate to="/recruiter-dashboard" replace />;
  }

  return children;
}
