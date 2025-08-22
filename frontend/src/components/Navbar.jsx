//the white space on screen is not from navbar

import { useContext } from "react";
import { Link,useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login"); // 👈 redirect after logout
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 text-sky-400 bg-white">
      <h1 className="text-xl font-bold">WorkSpark</h1>
      <div className="flex items-center gap-4">
        {!user ? (
          <>
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        ) : (
          <>
          <Link to="/">Home</Link>
          <Link to ="/SavedJobs">Saved</Link>
          <Link to="/MyApplications">Applied Jobs</Link>
            {user.role === "recruiter" ? (
              <Link to="/recruiter-dashboard">Your Dashboard</Link>
            ) : (
              <Link to="/jobseeker-dashboard">JobCards</Link>
            )}
            
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-500 rounded hover:bg-red-600 text-white"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
