import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  // Wait for AuthProvider to finish restoring user from localStorage
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Loading...
      </div>
    );
  }

  // If still no user after loading → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user exists → render the page
  return children;
}
