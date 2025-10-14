//the white space on screen is not from navbar

import { useContext } from "react";
import { Link,useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/") // 👈 redirect after logout
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white text-sky-400">
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
          
          
          
           {user.role === "recruiter" ? (
            <div className="flex gap-4">
              <Link to="/recruiter-dashboard">Your Dashboard</Link>
              <Link to ="/JobForm">Post Job</Link>
              <Link to ="/saved-applicants">Saved Applicants</Link>
              <Link to ="/accepted-applicants">Accepted Applicants</Link>
              <Link to ="/manage-jobs">Manage Jobs</Link>
             
            </div>  
            ) : (
              <div className="flex gap-4">
                hello, {user.name} |
                <Link to="/jobseeker-profile">My Profile</Link>
                <Link to="/jobseeker-dashboard">JobCards</Link>
                <Link to ="/SavedJobs">Saved</Link>
                <Link to="/MyApplications">Applied Jobs</Link>
                <Link to="/my-interviews">My Interviews</Link>
              </div>
            )}

            
            <button
              onClick={handleLogout}
              className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
