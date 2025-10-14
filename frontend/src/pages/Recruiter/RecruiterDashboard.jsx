import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

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
        const res = await axios.get("http://localhost:5000/jobs/my-jobs", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Keep only applicants with status "applied"
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
  }, [token]);

  if (loading) return <div className="p-6">Loading your jobs…</div>;

  const selectedJob = jobs.find((job) => job._id === selectedJobId);
  const applicants = selectedJob?.applicants || [];

  // Ensure currentIndex is always in bounds
  const currentApplicant =
    applicants.length > 0
      ? applicants[Math.min(currentIndex, applicants.length - 1)]
      : null;

  const updateStatus = async (appId, status) => {
    try {
      await axios.patch(
        `http://localhost:5000/applications/${appId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Remove applicant from UI if status is no longer "applied"
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
    <div className="max-w-3xl p-6 mx-auto">
      <h2 className="mb-4 text-2xl font-bold">Applicants for job:</h2>

      {/* Dropdown for jobs */}
      <select
        value={selectedJobId || ""}
        onChange={(e) => {
          setSelectedJobId(e.target.value);
          setCurrentIndex(0);
        }}
        className="p-2 mb-6 border rounded"
      >
        {jobs.map((job) => (
          <option key={job._id} value={job._id}>
            {job.title} — {job.company}
          </option>
        ))}
      </select>

      {/* Swipeable applicants */}
      <div className="relative flex items-center justify-center h-80">
        <AnimatePresence>
          {currentApplicant ? (
            <motion.div
              key={currentApplicant._id}
              className="absolute p-6 text-center bg-white border shadow-lg w-80 rounded-xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{
                x: exitDirection * 300,
                opacity: 0,
                transition: { duration: 0.3 },
              }}
            >
              <h3 className="text-lg font-semibold">
                {currentApplicant.jobseeker?.name}
              </h3>
              <p className="text-gray-600">
                {currentApplicant.jobseeker?.email}
              </p>

              {/* ✅ Experience display updated */}
              <p className="mt-2">
                <strong>Experience:</strong>{" "}
                {typeof currentApplicant.jobseeker?.experience === "number"
                  ? currentApplicant.jobseeker.experience > 0
                    ? `${currentApplicant.jobseeker.experience} year${
                        currentApplicant.jobseeker.experience > 1 ? "s" : ""
                      }`
                    : "Fresher"
                  : "N/A"}
              </p>

              <p>
                <strong>Skills:</strong>{" "}
                {(currentApplicant.jobseeker?.skills || []).join(", ") ||
                  "Not provided"}
              </p>

              {/* View Resume Button */}
              {currentApplicant.jobseeker?.resume && (
                <p className="mt-2">
                  <a
                    href={`http://localhost:5000/${currentApplicant.jobseeker.resume}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 text-white bg-blue-600 rounded"
                  >
                    View Resume
                  </a>
                </p>
              )}

              <div className="flex justify-around mt-4">
                <button
                  onClick={() => handleSwipe("left", currentApplicant._id)}
                  className="px-4 py-2 text-white bg-red-500 rounded"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleSwipe("right", currentApplicant._id)}
                  className="px-4 py-2 text-white bg-green-500 rounded"
                >
                  Accept
                </button>
                <button
                  onClick={() => updateStatus(currentApplicant._id, "hold")}
                  className="px-4 py-2 text-white bg-yellow-500 rounded"
                >
                  Hold
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="text-gray-500">No more applicants</div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
