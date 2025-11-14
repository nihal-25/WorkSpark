import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api"; // ✅ Use shared API instance

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exitDirection, setExitDirection] = useState(0);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await API.get("/jobs/my-jobs");

        const jobsWithFilteredApplicants = res.data.map((job) => ({
          ...job,
          applicants: job.applicants.filter((a) => a.status === "applied"),
        }));

        setJobs(jobsWithFilteredApplicants);

        if (res.data.length > 0) setSelectedJobId(res.data[0]._id);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) return <div className="p-6">Loading your jobs…</div>;

  const selectedJob = jobs.find((job) => job._id === selectedJobId);
  const applicants = selectedJob?.applicants || [];

  const currentApplicant =
    applicants.length > 0
      ? applicants[Math.min(currentIndex, applicants.length - 1)]
      : null;

  const updateStatus = async (appId, status) => {
    try {
      await API.patch(`/applications/${appId}/status`, { status });

      setJobs((prev) =>
        prev.map((job) =>
          job._id === selectedJobId
            ? {
                ...job,
                applicants: job.applicants.filter((a) => a._id !== appId),
              }
            : job
        )
      );

      setCurrentIndex((prev) => prev);
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status");
    }
  };

  const handleSwipe = (dir, appId) => {
    setExitDirection(dir === "right" ? 1 : -1);

    setTimeout(() => {
      if (dir === "left") updateStatus(appId, "rejected");
      if (dir === "right") updateStatus(appId, "accepted");
      setExitDirection(0);
      setCurrentIndex((prev) => prev + 1);
    }, 300);
  };

  return (
    <div className="min-h-screen px-6 pt-24 bg-gradient-to-b from-sky-200 via-white to-sky-100">
      <div className="max-w-3xl mx-auto">
        <h2 className="mb-6 text-3xl font-extrabold text-center text-sky-700">
          Applicants Review Panel 👥
        </h2>

        {/* Job Dropdown */}
        <select
          value={selectedJobId || ""}
          onChange={(e) => {
            setSelectedJobId(e.target.value);
            setCurrentIndex(0);
          }}
          className="w-full p-3 mb-6 border rounded-lg shadow-sm bg-white/90 backdrop-blur-md border-sky-200 focus:ring-2 focus:ring-sky-400"
        >
          {jobs.map((job) => (
            <option key={job._id} value={job._id}>
              {job.title} — {job.company}
            </option>
          ))}
        </select>

        {/* Swipe Card */}
        <div className="relative flex items-center justify-center h-[380px]">
          <AnimatePresence>
            {currentApplicant ? (
              <motion.div
                key={currentApplicant._id}
                className="absolute p-6 text-center border shadow-xl w-80 bg-white/95 rounded-2xl backdrop-blur-md border-sky-100"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{
                  x: exitDirection * 300,
                  opacity: 0,
                  transition: { duration: 0.3 },
                }}
              >
                <h3 className="text-xl font-semibold text-sky-700">
                  {currentApplicant.jobseeker?.name}
                </h3>
                <p className="text-slate-600">{currentApplicant.jobseeker?.email}</p>

                <p className="mt-2 text-sm text-slate-700">
                  <strong className="text-sky-600">Experience:</strong>{" "}
                  {typeof currentApplicant.jobseeker?.experience === "number"
                    ? currentApplicant.jobseeker.experience > 0
                      ? `${currentApplicant.jobseeker.experience} year${
                          currentApplicant.jobseeker.experience > 1 ? "s" : ""
                        }`
                      : "Fresher"
                    : "N/A"}
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  <strong className="text-sky-600">Skills:</strong>{" "}
                  {(currentApplicant.jobseeker?.skills || []).join(", ") ||
                    "Not provided"}
                </p>

                {currentApplicant.jobseeker?.resume && (
                  <a
                    href={`https://workspark.onrender.com/${currentApplicant.jobseeker.resume}`} // ✅ Fix resume link
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 mt-3 text-white rounded-lg bg-sky-500 hover:bg-sky-600"
                  >
                    View Resume 📄
                  </a>
                )}

                {/* Action Buttons */}
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => handleSwipe("left", currentApplicant._id)}
                    className="px-3 py-1.5 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
                  >
                    Reject ❌
                  </button>
                  <button
                    onClick={() => handleSwipe("right", currentApplicant._id)}
                    className="px-3 py-1.5 bg-green-500 text-white rounded-md text-sm hover:bg-green-600"
                  >
                    Accept ✅
                  </button>
                  <button
                    onClick={() => updateStatus(currentApplicant._id, "hold")}
                    className="px-3 py-1.5 bg-yellow-400 text-black rounded-md text-sm hover:bg-yellow-500"
                  >
                    Hold ⏸
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="text-lg font-medium text-slate-600">
                🎉 No more applicants to review
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
