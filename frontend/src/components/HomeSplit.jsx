export default function HomeSplit() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Recruiters Section */}
      <div className="flex-1 bg-gradient-to-b from-sky-500 to-white flex flex-col items-center justify-center text-white p-8">
        <h1 className="text-4xl font-bold mb-4">For Recruiters</h1>
        <p className="mb-6 max-w-md text-center">
          Post jobs, connect with top talent, and hire faster than ever before.
        </p>
        <Link
          to="/recruiter"
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Go to Recruiter Portal
        </Link>
        <button className="bg-white text-sky-600 px-6 py-3 rounded-lg font-semibold hover:text-pink-700 transition">
          Post a Job
        </button>
      </div>

      {/* Job Seekers Section */}
      <div className="flex-1 bg-gradient-to-b from-sky-300 to-white flex flex-col items-center justify-center text-white p-8">
        <h1 className="text-4xl font-bold mb-4 text-slate-500">For Job Seekers</h1>
        <p className="mb-6 max-w-md text-slate-500 text-center">
          Discover jobs, swipe right to save, and match with recruiters instantly.
        </p>
         <Link
          to="/jobseeker"
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Go to Job Seeker Portal
        </Link>
        <button className="bg-sky-600 px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition">
          Find Jobs
        </button>
      </div>
    </div>
  );
}
