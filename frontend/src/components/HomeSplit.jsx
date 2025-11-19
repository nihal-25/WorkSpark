import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "./Navbar";

export default function HomeSplit() {
  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden md:flex-row">
      <Navbar />

      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 -z-10 bg-gradient-to-r from-sky-100 via-white to-pink-100"
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 15, ease: "linear", repeat: Infinity }}
        style={{ backgroundSize: "200% 200%" }}
      />

      {/* HERO (improved mobile spacing) */}
      <div className="absolute inset-x-0 z-20 px-4 text-center top-24 md:top-20">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-3xl md:text-6xl font-extrabold 
          bg-[linear-gradient(to_right,white_0%,white_45%,#0ea5e9_55%,#0369a1_100%)] 
          bg-clip-text text-transparent drop-shadow-md"
        >
          WorkSpark
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.05 }}
          className="mt-1 text-sm md:text-lg leading-tight 
          bg-[linear-gradient(to_right,white_0%,white_40%,#0ea5e9_60%,#0369a1_100%)] 
          bg-clip-text text-transparent"
        >
          Ignite your career — connect instantly.
        </motion.p>
      </div>

      {/* Recruiters Section */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center justify-center flex-1 px-6 pt-40 pb-10 text-center  md:pt-24 bg-gradient-to-b from-sky-300 to-white"
      >
        <h1 className="mb-2 text-3xl font-bold text-white md:text-5xl drop-shadow-lg">
          For Recruiters
        </h1>

        <p className="max-w-sm mb-5 text-sm leading-tight md:text-lg text-white/90">
          Post jobs and connect with top talent instantly.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full max-w-[260px] px-6 py-3 
          font-medium md:font-semibold text-sky-600
          bg-white rounded-xl shadow-md 
          hover:shadow-lg hover:text-pink-600 transition"
        >
          <Link to="/recruiter_button">Post a Job</Link>
        </motion.button>
      </motion.div>

      {/* Job Seekers Section */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex flex-col items-center justify-center flex-1 px-6 pt-10 pb-20 text-center  md:pt-24 bg-gradient-to-b from-sky-200 to-white"
      >
        <h1 className="mb-2 text-3xl font-bold md:text-5xl text-sky-700 drop-shadow-md">
          For Job Seekers
        </h1>

        <p className="max-w-sm mb-5 text-sm leading-tight md:text-lg text-slate-600">
          Discover jobs, save matches, and connect instantly.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full max-w-[260px] px-6 py-3 
          font-medium md:font-semibold text-white 
          rounded-xl shadow-md bg-sky-500 hover:bg-sky-600 transition"
        >
          <Link to="/jobseeker_button">Find Jobs</Link>
        </motion.button>
      </motion.div>
    </div>
  );
}
