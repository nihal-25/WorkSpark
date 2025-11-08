import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "./Navbar";

export default function HomeSplit() {
  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden md:flex-row">
      <Navbar />

      
      <motion.div
        className="absolute inset-0 -z-10 bg-gradient-to-r from-sky-100 via-white to-pink-100"
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 15, ease: "linear", repeat: Infinity }}
        style={{ backgroundSize: "200% 200%" }}
      />

      
     <div className="absolute inset-x-0 z-20 pointer-events-none top-20">
  <div className="flex flex-col items-center justify-center text-center">
    
    <motion.h1
      initial={{ opacity: 0, y: 40 }} // starts below, comes up
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="text-5xl font-extrabold md:text-6xl bg-[linear-gradient(to_right,white_0%,white_45%,#0ea5e9_55%,#0369a1_100%)] bg-clip-text text-transparent drop-shadow-md"
    >
      WorkSpark
    </motion.h1>

    {/* One-liner gradient text */}
    <motion.p
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.05 }}
      className="mt-2 text-md md:text-lg bg-[linear-gradient(to_right,white_0%,white_40%,#0ea5e9_60%,#0369a1_100%)] bg-clip-text text-transparent"
    >
      Ignite your career — where recruiters and seekers connect instantly.
    </motion.p>
  </div>
</div>


      {/* Recruiters Section */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center justify-center flex-1 pt-24 text-center bg-gradient-to-b from-sky-400 to-white"
      >
        <h1 className="mb-4 text-5xl font-extrabold text-white drop-shadow-lg">
          For Recruiters
        </h1>
        <p className="max-w-md mb-6 text-lg text-white/90">
          Post jobs, connect with top talent, and hire faster than ever before.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 font-semibold transition bg-white rounded-lg shadow-md text-sky-600 hover:shadow-xl hover:text-pink-600"
        >
          <Link to="/recruiter_button">Post a Job</Link>
        </motion.button>
      </motion.div>

      {/* Job Seekers Section */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex flex-col items-center justify-center flex-1 pt-24 text-center bg-gradient-to-b from-sky-200 to-white"
      >
        <h1 className="mb-4 text-5xl font-extrabold text-sky-700 drop-shadow-lg">
          For Job Seekers
        </h1>
        <p className="max-w-md mb-6 text-lg text-slate-600">
          Discover jobs, swipe right to save, and match with recruiters instantly.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 font-semibold text-white transition rounded-lg shadow-md bg-sky-500 hover:bg-sky-600"
        >
          <Link to="/jobseeker_button">Find Jobs</Link>
        </motion.button>
      </motion.div>
    </div>
  );
}
