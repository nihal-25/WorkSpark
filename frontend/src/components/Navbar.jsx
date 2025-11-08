import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AuthContext from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 z-50 flex items-center justify-between w-full px-10 py-4 border-b shadow-sm bg-gradient-to-r from-sky-200/90 via-white/90 to-sky-100/90 backdrop-blur-md border-sky-200"
    >
      {/* Brand Left */}
      <motion.h1
  initial={{ y: -10, opacity: 0 }}
  animate={{
    y: 0,
    opacity: 1,
    x: [0, -3, 3, -3, 3, 0], 
  }}
  transition={{
    duration: 0.6,
    ease: "easeOut",
    x: {
      repeat: 1,
      repeatType: "reverse",
      duration: 0.4,
    },
  }}
  whileHover={{ scale: 1.05 }}
  className="text-2xl font-bold cursor-pointer text-sky-600"
>
  WorkSpark ⚡
</motion.h1>

      {/* Right Section */}
      <div className="flex items-center gap-6 font-medium text-sky-700">
        {!user ? (
          <>
            <Link
              to="/"
              className="transition hover:text-sky-900 hover:underline underline-offset-4"
            >
              Home
            </Link>
            <Link
              to="/login"
              className="transition hover:text-sky-900 hover:underline underline-offset-4"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="transition hover:text-sky-900 hover:underline underline-offset-4"
            >
              Signup
            </Link>
          </>
        ) : user.role === "recruiter" ? (
          <>
            <Link
              to="/recruiter-dashboard"
              className="transition hover:text-sky-900 hover:underline underline-offset-4"
            >
              Dashboard
            </Link>
            <Link
              to="/JobForm"
              className="transition hover:text-sky-900 hover:underline underline-offset-4"
            >
              Post Job
            </Link>
            <Link to ="/saved-applicants">Saved Applicants</Link>
              <Link to ="/accepted-applicants">Accepted Applicants</Link>
            <Link
              to="/manage-jobs"
              className="transition hover:text-sky-900 hover:underline underline-offset-4"
            >
              Manage
            </Link>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLogout}
              className="px-4 py-2 text-white transition rounded-lg shadow-md bg-sky-500 hover:bg-sky-600"
            >
              Logout
            </motion.button>
          </>
        ) : (
          <>
            <span className="font-semibold text-sky-700">
              Hello, {user.name}
            </span>
             <Link
              to="/jobseeker-profile"
              className="transition hover:text-sky-900 hover:underline underline-offset-4"
            >
              My Profile
            </Link>
            <Link
              to="/jobseeker-dashboard"
              className="transition hover:text-sky-900 hover:underline underline-offset-4"
            >
              Jobs
            </Link>
            <Link
              to="/MyApplications"
              className="transition hover:text-sky-900 hover:underline underline-offset-4"
            >
              Applied
            </Link>
            <Link
              to="/SavedJobs"
              className="transition hover:text-sky-900 hover:underline underline-offset-4"
            >
              Saved
            </Link>
            <Link
              to="/my-interviews"
              className="transition hover:text-sky-900 hover:underline underline-offset-4"
            >
              My Interviews
            </Link>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLogout}
              className="px-4 py-2 text-white transition rounded-lg shadow-md bg-sky-500 hover:bg-sky-600"
            >
              Logout
            </motion.button>
          </>
        )}
      </div>
    </motion.nav>
  );
}
