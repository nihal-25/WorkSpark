import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, requiredRole }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    // not logged in → go to login
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    // logged in but wrong role → go to login
    return <Navigate to="/login" replace />;
  }

  // ✅ allowed
  return children;
}
