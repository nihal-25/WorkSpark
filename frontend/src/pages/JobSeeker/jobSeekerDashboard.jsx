import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../api";
import { useNavigate } from "react-router-dom";

const JOB_TYPES = [
  "Software Developer",
  "Web Developer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "App Developer",
  "Mobile Developer",
  "UI/UX Designer",
  "Data Scientist",
  "Machine Learning Engineer",
  "AI Engineer",
  "DevOps Engineer",
  "Cloud Architect",
  "Cybersecurity Analyst",
  "Database Administrator",
  "Network Engineer",
  "System Administrator",
  "Marketing Specialist",
  "Product Manager",
  "Business Analyst",
  "Graphic Designer",
  "Game Developer",
  "Content Writer",
  "Video Editor",
  "HR Manager",
  "Sales Executive",
  "Customer Support",
  "Finance Analyst",
  "Operations Manager",
  "QA Tester",
];

const WORK_MODES = ["In Office", "Remote", "Hybrid"];

export default function JobSeekerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [lastJob, setLastJob] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    location: "",
    workMode: "",
    jobType: "",
    minExperience: "",
    requirements: "",
  });

  const navigate = useNavigate();

  const getErrorReason = (error) => {
    if (!error.response) return "Network error — server unreachable.";
    const { status, data } = error.response;
    const serverMsg =
      typeof data === "string"
        ? data
        : data?.message || data?.error || data?.errors || "";
    if (status === 401) return "Unauthorized — please log in again.";
    if (status === 403) return "Forbidden — you don’t have access.";
    if (status === 404) return "Job not found.";
    if (status === 409) return serverMsg || "You’ve already applied to this job.";
    if (status === 422) return serverMsg || "Validation failed.";
    if (status === 500) return "Server error — please try again.";
    return serverMsg || `HTTP ${status}`;
  };

  // Fetch unseen jobs
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        console.log("hey");
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
    } catch (err) {
      console.error("Failed to fetch latest experience:", err);
      return 0;
    }
  };

  const applyJob = async (job) => {
    if (!job?._id) return false;
    setSubmitting(true);
    setErrorMsg("");
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("❌ No token found — please log in first");

      const latestExp = await fetchLatestExperience();
      if (latestExp < (job.minExperience || 0)) {
        alert(
          `❌ You are not eligible for this job.\nRequired: ${job.minExperience} years\nYour experience: ${latestExp} years`
        );
        return false;
      }

      await API.post(
        "/applications",
        { job: job._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Application submitted!");
      await markJobAsSeen(job._id);
      return true;
    } catch (err) {
      const reason = getErrorReason(err);
      if (err.response?.status === 409)
        alert("⚠️ You’ve already applied to this job.");
      else alert(`❌ Failed to apply: ${reason}`);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const saveJob = async (job) => {
    if (!job?._id) return false;
    setSubmitting(true);
    setErrorMsg("");
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("❌ No token found — please log in first");
      console.log("HI");
      const latestExp = await fetchLatestExperience();
      if (latestExp < (job.minExperience || 0)) {
        alert(
          `❌ You are not eligible to save this job.\nRequired: ${job.minExperience} years\nYour experience: ${latestExp} years`
        );
        return false;
      }

      await API.post(
        "/savedJobs",
        { job: job._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("📌 Saved job!");
      await markJobAsSeen(job._id);
      return true;
    } catch (err) {
      const reason = getErrorReason(err);
      if (err.response?.status === 409)
        alert("⚠️ You’ve already saved this job.");
      else alert(`❌ Failed to save: ${reason}`);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const markJobAsSeen = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      await API.post(`/jobs/${jobId}/seen`, {}, { headers: { Authorization: `Bearer ${token}` } });
    } catch (err) {
      console.error("Failed to mark job as seen:", err);
    }
  };

  // Filter logic
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
      const reqs = filters.requirements
        .split(",")
        .map((r) => r.trim().toLowerCase());
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

  const handleSwipe = async (direction) => {
    const job = filteredJobs[currentIndex];
    if (!job || submitting) return;

    const removeJobAndFixIndex = (jobId) => {
      setFilteredJobs((prev) => {
        const updated = prev.filter((j) => j._id !== jobId);
        if (currentIndex >= updated.length)
          setCurrentIndex(Math.max(updated.length - 1, 0));
        return updated;
      });
    };

    if (direction === "right") {
      const success = await applyJob(job);
      if (success) {
        setLastJob(job);
        removeJobAndFixIndex(job._id);
      }
    } else if (direction === "left") {
      await markJobAsSeen(job._id);
      setLastJob(job);
      setCurrentIndex((prev) => prev + 1);
    } else if (direction === "back") {
      if (lastJob) {
        setFilteredJobs((prev) => {
          const updated = [...prev];
          updated.splice(currentIndex, 0, lastJob);
          return updated;
        });
        setLastJob(null);
      }
    } else if (direction === "save") {
      const success = await saveJob(job);
      if (success) {
        setLastJob(job);
        removeJobAndFixIndex(job._id);
      }
    }
  };

  if (loading) return <div className="p-6">Loading jobs…</div>;
  if (currentIndex >= filteredJobs.length)
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h2 className="text-xl font-bold text-gray-600">No more jobs 🎉</h2>
      <button
        className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        onClick={() => window.location.reload()}
      >
        🔄 Refresh
      </button>
    </div>
  );

  const job = filteredJobs[currentIndex];

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-3xl px-6 mt-4">
        <h2 className="text-2xl font-bold">Swipe Jobs</h2>
        <button
          className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          onClick={() => setShowFilter(!showFilter)}
        >
          🔍 Filter
        </button>
      </div>

      {/* Filter Modal */}
      {showFilter && (
        <div className="absolute z-10 p-6 bg-white border shadow-lg top-20 rounded-xl w-80">
          <h3 className="mb-4 text-lg font-semibold">Filter Jobs</h3>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Location"
              value={filters.location}
              onChange={(e) =>
                setFilters((f) => ({ ...f, location: e.target.value }))
              }
              className="px-3 py-2 text-sm border rounded"
            />

            <select
              value={filters.jobType}
              onChange={(e) =>
                setFilters((f) => ({ ...f, jobType: e.target.value }))
              }
              className="px-3 py-2 text-sm border rounded"
            >
              <option value="">All Job Types</option>
              {JOB_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <select
              value={filters.workMode}
              onChange={(e) =>
                setFilters((f) => ({ ...f, workMode: e.target.value }))
              }
              className="px-3 py-2 text-sm border rounded"
            >
              <option value="">All Work Modes</option>
              {WORK_MODES.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Min Experience (years)"
              value={filters.minExperience}
              onChange={(e) =>
                setFilters((f) => ({ ...f, minExperience: e.target.value }))
              }
              className="px-3 py-2 text-sm border rounded"
              min={0}
            />

            <input
              type="text"
              placeholder="Requirements (comma-separated)"
              value={filters.requirements}
              onChange={(e) =>
                setFilters((f) => ({ ...f, requirements: e.target.value }))
              }
              className="px-3 py-2 text-sm border rounded"
            />
          </div>

          <div className="flex justify-between mt-4">
            <button
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={clearFilters}
            >
              Clear
            </button>
            <button
              className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
              onClick={applyFilters}
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="w-full max-w-lg px-4 py-3 mb-4 text-sm text-red-700 border border-red-200 rounded-lg bg-red-50">
          {errorMsg}
        </div>
      )}

      {/* Swipe Area */}
      <div className="flex items-center justify-center gap-6 mt-6">
        <button
          className="px-6 py-3 text-lg text-white bg-red-200 rounded-full disabled:opacity-60"
          onClick={() => handleSwipe("left")}
          disabled={submitting}
        >
          ❌
        </button>

        <motion.div
          key={job._id}
          className="relative w-80 h-[360px] bg-white shadow-xl rounded-2xl p-6 flex flex-col justify-between"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, info) => {
            if (submitting) return;
            if (info.offset.x > 150) handleSwipe("right");
            else if (info.offset.x < -150) handleSwipe("left");
          }}
        >
          <div>
            <h3 className="text-xl font-semibold">{job.title}</h3>
            <p className="text-gray-600">
              {job.company} • {job.location}
            </p>

            <div className="mt-2 text-sm text-gray-700">
              <p>
                <strong>Job Type:</strong> {job.jobType || "Not specified"}
              </p>
              <p>
                <strong>Work Mode:</strong> {job.workMode || "Not specified"}
              </p>
              <p>
                <strong>Min Experience:</strong>{" "}
                {job.minExperience ?? "—"} years
              </p>
            </div>

            <span className="block mt-2 text-sm font-medium text-gray-800">
              💰 {job.salary || "Not specified"}
            </span>

            <p className="mt-2 text-sm text-gray-700">
              {job.description?.slice(0, 120)}
              {job.description?.length > 120 ? "…" : ""}
            </p>

            <button
              onClick={() => navigate(`/jobs/${job._id}`)}
              className="px-3 py-1 mt-3 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              View Full Description
            </button>

            {!!job.requirements?.length && (
              <div className="flex flex-wrap gap-2 mt-3">
                {job.requirements.slice(0, 3).map((req, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 text-xs bg-gray-100 rounded"
                  >
                    {req}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        <button
          className="px-6 py-3 text-lg text-white bg-green-200 rounded-full disabled:opacity-60"
          onClick={() => handleSwipe("right")}
          disabled={submitting}
        >
          {submitting ? "…" : "✅"}
        </button>
      </div>

      <div className="flex items-center justify-center gap-4 mt-6 w-80">
        <button
          className="px-6 py-3 text-lg text-black rounded-full bg-sky-200 disabled:opacity-60"
          onClick={() => handleSwipe("back")}
          disabled={!lastJob || submitting}
        >
          🔂 Go Back
        </button>

        <button
          className="px-6 py-3 text-lg text-black bg-yellow-200 rounded-full disabled:opacity-100"
          onClick={() => handleSwipe("save")}
          disabled={submitting}
        >
          📌 Save
        </button>
      </div>
    </div>
  );
}
