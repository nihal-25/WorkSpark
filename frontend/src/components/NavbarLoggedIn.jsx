//we're not using this for now
import { Link, useNavigate } from "react-router-dom";

export default function NavbarLoggedIn() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user"); // clear login
    navigate("/login"); // redirect to login
  };

  return (
    <nav className="flex justify-between p-4 text-white bg-gray-800">
      <div className="text-lg font-bold">
        <Link to="/">WorkSpark</Link>
      </div>
      <div className="flex gap-4">
        <Link to="/Saved-jobseeker">Saved</Link>
        <Link to="/">Home</Link>
        <Link to="/jobseeker-dashboard">Dashboard</Link>
        <Link to="/recruiter-dashboard">Recruiter Dashboard</Link>
        <button
          onClick={handleLogout}
          className="px-3 py-1 bg-red-500 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
