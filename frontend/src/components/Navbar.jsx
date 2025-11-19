import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AuthContext from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 z-50 w-full px-6 py-4 border-b shadow-sm md:px-10 bg-gradient-to-r from-sky-200/90 via-white/90 to-sky-100/90 backdrop-blur-md border-sky-200"
    >
      <div className="flex items-center justify-between">
        {/* Brand */}
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
            x: { repeat: 1, repeatType: "reverse", duration: 0.4 },
          }}
          whileHover={{ scale: 1.05 }}
          className="text-2xl font-bold cursor-pointer text-sky-600"
        >
          WorkSpark ⚡
        </motion.h1>

        {/* Hamburger (Mobile Only) */}
        <button
          onClick={() => setOpen(!open)}
          className="text-3xl md:hidden text-sky-700 focus:outline-none"
        >
          {open ? "✖" : "☰"}
        </button>

        {/* Desktop Menu */}
        <div className="items-center hidden gap-6 font-medium md:flex text-sky-700">
          {!user ? (
            <>
              <Link to="/" className="hover:text-sky-900 hover:underline underline-offset-4">Home</Link>
              <Link to="/login" className="hover:text-sky-900 hover:underline underline-offset-4">Login</Link>
              <Link to="/signup" className="hover:text-sky-900 hover:underline underline-offset-4">Signup</Link>
            </>
          ) : user.role === "recruiter" ? (
            <>
              <Link to="/recruiter-dashboard" className="hover:text-sky-900 hover:underline underline-offset-4">Dashboard</Link>
              <Link to="/JobForm" className="hover:text-sky-900 hover:underline underline-offset-4">Post Job</Link>
              <Link to="/saved-applicants">Saved Applicants</Link>
              <Link to="/accepted-applicants">Accepted Applicants</Link>
              <Link to="/manage-jobs" className="hover:text-sky-900 hover:underline underline-offset-4">Manage</Link>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleLogout}
                className="px-4 py-2 text-white rounded-lg shadow-md bg-sky-500 hover:bg-sky-600"
              >
                Logout
              </motion.button>
            </>
          ) : (
            <>
              <span className="font-semibold">Hello, {user.name}</span>
              <Link to="/jobseeker-profile" className="hover:underline underline-offset-4">My Profile</Link>
              <Link to="/jobseeker-dashboard" className="hover:underline underline-offset-4">Jobs</Link>
              <Link to="/MyApplications" className="hover:underline underline-offset-4">Applied</Link>
              <Link to="/SavedJobs" className="hover:underline underline-offset-4">Saved</Link>
              <Link to="/my-interviews" className="hover:underline underline-offset-4">My Interviews</Link>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleLogout}
                className="px-4 py-2 text-white rounded-lg shadow-md bg-sky-500 hover:bg-sky-600"
              >
                Logout
              </motion.button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 px-4 py-4 mt-4 border rounded-lg shadow md:hidden bg-white/80 border-sky-100"
        >
          {!user ? (
            <>
              <Link to="/" onClick={() => setOpen(false)} className="text-lg font-medium text-sky-700">Home</Link>
              <Link to="/login" onClick={() => setOpen(false)} className="text-lg font-medium text-sky-700">Login</Link>
              <Link to="/signup" onClick={() => setOpen(false)} className="text-lg font-medium text-sky-700">Signup</Link>
            </>
          ) : user.role === "recruiter" ? (
            <>
              <Link to="/recruiter-dashboard" onClick={() => setOpen(false)}>Dashboard</Link>
              <Link to="/JobForm" onClick={() => setOpen(false)}>Post Job</Link>
              <Link to="/saved-applicants" onClick={() => setOpen(false)}>Saved Applicants</Link>
              <Link to="/accepted-applicants" onClick={() => setOpen(false)}>Accepted Applicants</Link>
              <Link to="/manage-jobs" onClick={() => setOpen(false)}>Manage</Link>

              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-white rounded-lg shadow bg-sky-500 hover:bg-sky-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <span>Hello, {user.name}</span>
              <Link to="/jobseeker-profile" onClick={() => setOpen(false)}>My Profile</Link>
              <Link to="/jobseeker-dashboard" onClick={() => setOpen(false)}>Jobs</Link>
              <Link to="/MyApplications" onClick={() => setOpen(false)}>Applied</Link>
              <Link to="/SavedJobs" onClick={() => setOpen(false)}>Saved</Link>
              <Link to="/my-interviews" onClick={() => setOpen(false)}>My Interviews</Link>

              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-white rounded-lg shadow bg-sky-500 hover:bg-sky-600"
              >
                Logout
              </button>
            </>
          )}
        </motion.div>
      )}
    </motion.nav>
  );
}
