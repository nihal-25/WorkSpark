import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api";
import { useNavigate } from "react-router-dom";

const JOB_TYPES = [
  "Software Developer", "Web Developer", "Frontend Developer", "Backend Developer",
  "Full Stack Developer", "App Developer", "Mobile Developer", "UI/UX Designer",
  "Data Scientist", "Machine Learning Engineer", "AI Engineer", "DevOps Engineer",
  "Cloud Architect", "Cybersecurity Analyst", "Database Administrator", "Network Engineer",
  "System Administrator", "Marketing Specialist", "Product Manager", "Business Analyst",
  "Graphic Designer", "Game Developer", "Content Writer", "Video Editor", "HR Manager",
  "Sales Executive", "Customer Support", "Finance Analyst", "Operations Manager", "QA Tester",
];

const WORK_MODES = ["In Office", "Remote", "Hybrid"];

export default function JobSeekerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    location: "",
    workMode: "",
    jobType: "",
    minExperience: "",
    requirements: "",
  });
  const [lastJob, setLastJob] = useState(null);
  const [direction, setDirection] = useState(0);
  const navigate = useNavigate();

  // Fetch unseen jobs
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/jobs/unseen", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(res.data);
        setFilteredJobs(res.data);
        setCurrentIndex(0);
      } catch (err) {
        console.error(err);
        setErrorMsg("Could not load jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const fetchLatestExperience = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data?.experience ?? 0;
    } catch {
      return 0;
    }
  };

  const markJobAsSeen = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      await API.post(`/jobs/${jobId}/seen`, {}, { headers: { Authorization: `Bearer ${token}` } });
    } catch {}
  };

  const applyJob = async (job) => {
    if (!job?._id) return false;
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return false;

      const latestExp = await fetchLatestExperience();
      if (latestExp < (job.minExperience || 0)) {
        setFeedbackMsg(`❌ Not eligible. Required: ${job.minExperience} years, Yours: ${latestExp}`);
        setTimeout(() => setFeedbackMsg(""), 2000);
        return false;
      }

      await API.post("/applications", { job: job._id }, { headers: { Authorization: `Bearer ${token}` } });
      setFeedbackMsg("✅ Applied!");
      setTimeout(() => setFeedbackMsg(""), 1500);
      await markJobAsSeen(job._id);
      return true;
    } catch {
      setFeedbackMsg("❌ Failed to apply");
      setTimeout(() => setFeedbackMsg(""), 1500);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const saveJob = async (job) => {
    if (!job?._id) return false;
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return false;

      const latestExp = await fetchLatestExperience();
      if (latestExp < (job.minExperience || 0)) {
        setFeedbackMsg(`❌ Not eligible to save. Required: ${job.minExperience} years, Yours: ${latestExp}`);
        setTimeout(() => setFeedbackMsg(""), 2000);
        return false;
      }

      await API.post("/savedJobs", { job: job._id }, { headers: { Authorization: `Bearer ${token}` } });
      setFeedbackMsg("📌 Saved!");
      setTimeout(() => setFeedbackMsg(""), 1500);
      await markJobAsSeen(job._id);
      return true;
    } catch {
      setFeedbackMsg("❌ Failed to save");
      setTimeout(() => setFeedbackMsg(""), 1500);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...jobs];
    if (filters.location)
      filtered = filtered.filter((job) =>
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    if (filters.workMode)
      filtered = filtered.filter((job) => job.workMode === filters.workMode);
    if (filters.jobType)
      filtered = filtered.filter((job) => job.jobType === filters.jobType);
    if (filters.minExperience)
      filtered = filtered.filter(
        (job) => job.minExperience <= Number(filters.minExperience)
      );
    if (filters.requirements) {
      const reqs = filters.requirements.split(",").map((r) => r.trim().toLowerCase());
      filtered = filtered.filter((job) =>
        reqs.every((r) =>
          job.requirements?.some((jReq) => jReq.toLowerCase().includes(r))
        )
      );
    }
    setFilteredJobs(filtered);
    setCurrentIndex(0);
    setShowFilter(false);
  };

  const clearFilters = () => {
    setFilters({
      location: "",
      workMode: "",
      jobType: "",
      minExperience: "",
      requirements: "",
    });
    setFilteredJobs(jobs);
    setShowFilter(false);
  };

  const handleSwipe = async (dir) => {
    if (submitting || currentIndex >= filteredJobs.length) return;
    const job = filteredJobs[currentIndex];
    setDirection(dir);

    if (dir === 1) {
      const success = await applyJob(job);
      if (success) {
        setLastJob(job);
        setTimeout(() => setCurrentIndex((i) => i + 1), 300);
      }
    } else if (dir === -1) {
      await markJobAsSeen(job._id);
      setLastJob(job);
      setTimeout(() => setCurrentIndex((i) => i + 1), 300);
    }
  };

  const handleSave = async () => {
    const job = filteredJobs[currentIndex];
    if (!job) return;
    const success = await saveJob(job);
    if (success) {
      setLastJob(job);
      setTimeout(() => setCurrentIndex((i) => i + 1), 300);
    }
  };

  const handleGoBack = () => {
    if (!lastJob) return;
    setFilteredJobs((prev) => {
      const updated = [...prev];
      updated.splice(currentIndex, 0, lastJob);
      return updated;
    });
    setLastJob(null);
    setCurrentIndex((i) => Math.max(i - 1, 0));
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.9,
    }),
    center: { x: 0, opacity: 1, scale: 1, zIndex: 1 },
    exit: (direction) => ({
      x: direction > 0 ? 400 : -400,
      rotate: direction > 0 ? 20 : -20,
      opacity: 0,
      zIndex: 0,
      transition: { duration: 0.4 },
    }),
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen font-semibold bg-gradient-to-b from-sky-300 via-white to-sky-100 text-sky-700">
        Loading jobs…
      </div>
    );

  if (currentIndex >= filteredJobs.length)
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 bg-gradient-to-b from-sky-200 via-white to-sky-100 text-sky-700">
        <h2 className="text-xl font-bold">No more jobs 🎉</h2>
        <button
          className="px-6 py-2 text-white transition rounded-lg shadow-md bg-sky-500 hover:bg-sky-600"
          onClick={() => window.location.reload()}
        >
          🔄 Refresh
        </button>
      </div>
    );

  const job = filteredJobs[currentIndex];

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen pt-24 overflow-hidden bg-gradient-to-b from-sky-200 via-white to-sky-100">
      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-3xl px-6 mb-6">
        <h2 className="text-3xl font-extrabold text-sky-700">Swipe Jobs</h2>
        <button
          className="px-5 py-2 font-medium text-white rounded-lg shadow-md bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700"
          onClick={() => setShowFilter(!showFilter)}
        >
          🔍 Filter
        </button>
      </div>

      {/* Filter Modal */}
      {showFilter && (
        <div className="absolute z-10 p-6 border shadow-xl bg-white/90 backdrop-blur-md border-sky-100 top-28 rounded-2xl w-80">
          <h3 className="mb-4 text-lg font-semibold text-sky-700">Filter Jobs</h3>
          <div className="flex flex-col gap-3 text-sm">
            <input
              type="text"
              placeholder="Location"
              value={filters.location}
              onChange={(e) => setFilters((f) => ({ ...f, location: e.target.value }))}
              className="px-3 py-2 border rounded outline-none border-sky-200 focus:ring-2 focus:ring-sky-400"
            />
            <select
              value={filters.jobType}
              onChange={(e) => setFilters((f) => ({ ...f, jobType: e.target.value }))}
              className="px-3 py-2 border rounded outline-none border-sky-200 focus:ring-2 focus:ring-sky-400"
            >
              <option value="">All Job Types</option>
              {JOB_TYPES.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
            <select
              value={filters.workMode}
              onChange={(e) => setFilters((f) => ({ ...f, workMode: e.target.value }))}
              className="px-3 py-2 border rounded outline-none border-sky-200 focus:ring-2 focus:ring-sky-400"
            >
              <option value="">All Work Modes</option>
              {WORK_MODES.map((mode) => (
                <option key={mode}>{mode}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Min Experience (years)"
              value={filters.minExperience}
              onChange={(e) => setFilters((f) => ({ ...f, minExperience: e.target.value }))}
              className="px-3 py-2 border rounded outline-none border-sky-200 focus:ring-2 focus:ring-sky-400"
              min={0}
            />
            <input
              type="text"
              placeholder="Requirements (comma-separated)"
              value={filters.requirements}
              onChange={(e) => setFilters((f) => ({ ...f, requirements: e.target.value }))}
              className="px-3 py-2 border rounded outline-none border-sky-200 focus:ring-2 focus:ring-sky-400"
            />
          </div>
          <div className="flex justify-between mt-4">
            <button
              className="px-4 py-2 rounded-lg text-sky-700 bg-sky-100 hover:bg-sky-200"
              onClick={clearFilters}
            >
              Clear
            </button>
            <button
              className="px-4 py-2 text-white rounded-lg bg-sky-500 hover:bg-sky-600"
              onClick={applyFilters}
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* Feedback */}
      {feedbackMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute px-4 py-2 text-sm font-medium text-white rounded-lg shadow-lg top-16 bg-sky-600"
        >
          {feedbackMsg}
        </motion.div>
      )}

      {/* Swipe row (❌ card ✅) */}
      <div className="flex items-center justify-center gap-6 mt-4">
        <button
          onClick={() => handleSwipe(-1)}
          disabled={submitting}
          className="px-6 py-3 text-lg text-white bg-red-400 rounded-full shadow hover:bg-red-500 disabled:opacity-60"
        >
          ❌
        </button>

        {/* Card */}
        <div className="relative w-80 h-[380px]">
          <AnimatePresence custom={direction}>
            <motion.div
              key={job._id}
              custom={direction}
              initial="enter"
              animate="center"
              exit="exit"
              variants={{
                enter: (direction) => ({
                  x: direction > 0 ? 100 : -100,
                  opacity: 0,
                  scale: 0.9,
                }),
                center: { x: 0, opacity: 1, scale: 1 },
                exit: (direction) => ({
                  x: direction > 0 ? 400 : -400,
                  rotate: direction > 0 ? 20 : -20,
                  opacity: 0,
                  transition: { duration: 0.4 },
                }),
              }}
              transition={{
                x: { type: "spring", stiffness: 300, damping: 25 },
                opacity: { duration: 0.2 },
              }}
              className="absolute top-0 left-0 flex flex-col justify-between w-full h-full p-6 bg-white border shadow-xl border-sky-100 rounded-2xl"
            >
              <div>
                <h3 className="text-xl font-semibold text-sky-700">{job.title}</h3>
                <p className="text-slate-600">
                  {job.company} • {job.location}
                </p>
                <div className="mt-2 text-sm text-slate-700">
                  <p>
                    <strong>Job Type:</strong> {job.jobType || "Not specified"}
                  </p>
                  <p>
                    <strong>Work Mode:</strong> {job.workMode || "Not specified"}
                  </p>
                  <p>
                    <strong>Experience:</strong> {job.minExperience ?? "—"} years
                  </p>
                </div>
                <span className="block mt-2 text-sm font-medium text-sky-700">
                  💰 {job.salary || "Not specified"}
                </span>
                <p className="mt-2 text-sm text-slate-700">
                  {job.description?.slice(0, 120)}
                  {job.description?.length > 120 ? "…" : ""}
                </p>
                <button
                  onClick={() => navigate(`/jobs/${job._id}`)}
                  className="px-3 py-1 mt-3 text-sm text-white transition rounded bg-sky-500 hover:bg-sky-600"
                >
                  View Full Description
                </button>
                {!!job.requirements?.length && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {job.requirements.slice(0, 3).map((req, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs rounded bg-sky-100 text-sky-700"
                      >
                        {req}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          onClick={() => handleSwipe(1)}
          disabled={submitting}
          className="px-6 py-3 text-lg text-white bg-green-400 rounded-full shadow hover:bg-green-500 disabled:opacity-60"
        >
          ✅
        </button>
      </div>

      {/* Bottom Buttons */}
      <div className="flex items-center justify-center gap-4 mt-8 w-80">
        <button
          className="px-6 py-3 text-black transition rounded-full bg-sky-200 hover:bg-sky-300 disabled:opacity-60"
          onClick={handleGoBack}
          disabled={!lastJob || submitting}
        >
          🔂 Go Back
        </button>
        <button
          className="px-6 py-3 text-black transition bg-yellow-200 rounded-full hover:bg-yellow-300 disabled:opacity-100"
          onClick={handleSave}
          disabled={submitting}
        >
          📌 Save
        </button>
      </div>
    </div>
  );
}
