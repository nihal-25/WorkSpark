import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../api";

export default function JobSeekerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // helper to extract a human-friendly reason
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

  const applyJob = async (jobId) => {
    setSubmitting(true);
    setErrorMsg("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("❌ No token found — please log in first");
        return false;
      }
      await API.post(
        "http://localhost:5000/applications",
        { job: jobId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Application submitted!");
      return true;
    } catch (error) {
      const reason = getErrorReason(error);
      if (error.response?.status === 409) {
        alert("⚠️ You’ve already applied to this job.");
        return false;
      }
      alert(`❌ Failed to apply: ${reason}`);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const saveJob = async (jobId) => {
    setSubmitting(true);
    setErrorMsg("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("❌ No token found — please log in first");
        return false;
      }
      await API.post(
        "http://localhost:5000/savedJobs",
        { job: jobId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("📌 Saved job!");
      return true;
    } catch (error) {
      const reason = getErrorReason(error);
      if (error.response?.status === 409) {
        alert("⚠️ You’ve already saved this job.");
        return false;
      }
      alert(`❌ Failed to save: ${reason}`);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  // Fetch jobs and restore last seen job
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        const [allRes, appliedRes, savedRes] = await Promise.all([
          API.get("/jobs", { headers: { Authorization: `Bearer ${token}` } }),
          API.get("/applications", { headers: { Authorization: `Bearer ${token}` } }),
          API.get("/savedJobs", { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const appliedIds = new Set(appliedRes.data.map((app) => app.job?._id || app.job));
        const savedIds = new Set(savedRes.data.map((s) => s.job?._id || s.job));

        const filtered = allRes.data.filter(
          (job) => !appliedIds.has(job._id) && !savedIds.has(job._id)
        );

        setJobs(filtered);

        // Restore last seen job by ID
        const savedJobId = sessionStorage.getItem("currentJobId");
        if (savedJobId) {
          const restoredIndex = filtered.findIndex((j) => j._id === savedJobId);
          if (restoredIndex !== -1) {
            setCurrentIndex(restoredIndex);
          } else {
            setCurrentIndex(0);
          }
        } else {
          setCurrentIndex(0);
        }
      } catch (err) {
        console.error(err);
        setErrorMsg("Could not load jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Save current jobId instead of index
  useEffect(() => {
    if (jobs[currentIndex]) {
      sessionStorage.setItem("currentJobId", jobs[currentIndex]._id);
    }
  }, [currentIndex, jobs]);

  const handleSwipe = async (direction) => {
    const job = jobs[currentIndex];
    if (!job || submitting) return;

    const removeJobAndFixIndex = (jobId) => {
      setJobs((prev) => {
        const updated = prev.filter((j) => j._id !== jobId);
        if (currentIndex >= updated.length) {
          setCurrentIndex(Math.max(updated.length - 1, 0));
        }
        return updated;
      });
    };

    if (direction === "right") {
      const success = await applyJob(job._id);
      if (success) removeJobAndFixIndex(job._id);
      else setCurrentIndex((prev) => prev + 1);
    } else if (direction === "left") {
      setCurrentIndex((prev) => prev + 1);
    } else if (direction === "back") {
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    } else if (direction === "save") {
      const success = await saveJob(job._id);
      if (success) removeJobAndFixIndex(job._id);
      else setCurrentIndex((prev) => prev + 1);
    }
  };

  if (loading) return <div className="p-6">Loading jobs…</div>;

  if (currentIndex >= jobs.length) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h2 className="text-xl font-bold text-gray-600">No more jobs 🎉</h2>
      </div>
    );
  }

  const job = jobs[currentIndex];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h2 className="mb-4 text-2xl font-bold">Swipe Jobs</h2>

      {errorMsg && (
        <div className="w-full max-w-lg px-4 py-3 mb-4 text-sm text-red-700 border border-red-200 rounded-lg bg-red-50">
          {errorMsg}
        </div>
      )}

      <div className="flex items-center justify-center gap-6">
        <button
          className="px-6 py-3 text-lg text-white bg-red-200 rounded-full disabled:opacity-60"
          onClick={() => handleSwipe("left")}
          disabled={submitting}
        >
          ❌
        </button>

        <motion.div
          key={job._id}
          className="relative w-80 h-[300px] bg-white shadow-xl rounded-2xl p-6 flex flex-col justify-between"
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
            <span className="text-sm font-medium text-gray-800">
              💰 {job.salary || "Not specified"}
            </span>
            <p className="mt-2 text-sm text-gray-700">
              {job.description?.slice(0, 120)}
              {job.description?.length > 120 ? "…" : ""}
            </p>
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
          disabled={submitting}
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
