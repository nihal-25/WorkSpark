import { Link } from "react-router-dom";

export default function HomeSplit() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Recruiters Section */}
      <div className="flex-1 bg-gradient-to-b from-sky-500 to-white flex flex-col items-center justify-center text-white p-8">
        <h1 className="text-4xl font-bold mb-4">For Recruiters</h1>
        <p className="mb-6 max-w-md text-center">
          Post jobs, connect with top talent, and hire faster than ever before.
        </p>

        <button className="bg-white text-sky-600 px-6 py-3 rounded-lg font-semibold hover:text-pink-700 transition">
        <Link to="/recruiter_button" >Post a Job</Link>  
        </button>
      </div>

      {/* Job Seekers Section */}
      <div className="flex-1 bg-gradient-to-b from-sky-300 to-white flex flex-col items-center justify-center text-white p-8">
        <h1 className="text-4xl font-bold mb-4 text-slate-500">For Job Seekers</h1>
        <p className="mb-6 max-w-md text-slate-500 text-center">
          Discover jobs, swipe right to save, and match with recruiters instantly.
        </p>
         <button className="px-4 py-2 bg-sky-500 text-white border border-sky-500 rounded-lg hover:bg-white hover:text-sky-500 transition">
         <Link to="/jobseeker_button">Find Jobs</Link>
        </button>
      </div>
    </div>
  );
}
