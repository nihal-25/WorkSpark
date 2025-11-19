import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export default function PublicRoute({ children }) {
  const { user } = useContext(AuthContext);

  if (user) {
    // redirect based on role
    return user.role === "jobseeker"
      ? <Navigate to="/jobseeker-dashboard" replace />
      : <Navigate to="/recruiter-dashboard" replace />;
  }

  return children;
}
