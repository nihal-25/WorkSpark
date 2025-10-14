import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState(null); // per-row disable
  
  const navigate = useNavigate();
  
  // Read token once
  const token = useMemo(() => localStorage.getItem("token"), []);
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  // --- Helper: safely get jobId from a saved row ---
  const jobIdOf = (row) => {
    if (!row || !row.job) return null;
    return typeof row.job === "string" ? row.job : row.job._id || null;
  };

  // --- Helper: remove from state by jobId (null-safe) ---
  const dropByJobId = (jobId) => {
    setSavedJobs((prev) =>
      prev.filter((row) => {
        const id = jobIdOf(row);
        // keep rows with no jobId or different jobId
        return !id || id !== jobId;
      })
    );
  };

  // --- Apply for a job ---
  const applyJob = async (jobId) => {
    if (!token) {
      alert("❌ No token found — please log in first");
      return;
    }
    setSubmittingId(jobId);
    try {
      await axios.post(
        "http://localhost:5000/applications",
        { job: jobId },
        { headers: authHeaders }
      );

      // Best-effort: also unsave on the server (ignore failures)
      try {
        await axios.delete(`http://localhost:5000/savedJobs/${jobId}`, {
          headers: authHeaders,
        });
      } catch {}

      dropByJobId(jobId);
      alert("✅ Application submitted!");
    } catch (error) {
      if (error.response?.status === 409) {
        alert("⚠️ You’ve already applied to this job.");
        // optional: still remove from saved so user doesn’t see it again
        dropByJobId(jobId);
      } else {
        alert(
          "❌ Failed to apply: " +
            (error.response?.data?.message || error.message)
        );
      }
    } finally {
      setSubmittingId(null);
    }
  };

  // --- Remove from saved jobs ---
  const removeJob = async (jobId) => {
    if (!token) {
      alert("❌ No token found — please log in first");
      return;
    }
    setSubmittingId(jobId);
    try {
      await axios.delete(`http://localhost:5000/savedJobs/${jobId}`, {
        headers: authHeaders,
      });
      alert("🗑️ Job removed from saved jobs");
    } catch (error) {
      alert(
        "❌ Failed to remove: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      // Even if server fails, drop locally to avoid null crashes
      dropByJobId(jobId);
      setSubmittingId(null);
    }
  };

  // --- Fetch saved jobs ---
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    axios
      .get("http://localhost:5000/savedJobs", {
        headers: authHeaders,
      })
      .then((res) => {
        // Remove any rows where job is null to prevent UI crashes
        const rows = Array.isArray(res.data)
          ? res.data.filter((r) => r?.job)
          : [];
        setSavedJobs(rows);
      })
      .catch((err) => console.error("Fetch saved jobs failed:", err))
      .finally(() => setLoading(false));
  }, [token]); // token memoized

  if (loading) return <div className="p-6">Loading Saved Jobs…</div>;

  return (
    <div className="max-w-5xl p-6 mx-auto">
      <h2 className="mb-4 text-2xl font-bold">My Saved Jobs</h2>

      <div className="grid gap-4 md:grid-cols-2">
        {savedJobs.map((app) => {
          const job = app.job; // populated job object (we filtered nulls)
          const jobId = jobIdOf(app);
          if (!job) return null;

          return (
            <div
              key={app._id}
              className="flex flex-col justify-between p-4 bg-white border shadow-sm rounded-2xl"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{job.title}</h3>
                  <p className="text-sm text-gray-600">
                    {job.company} • {job.location}
                  </p>
                </div>
                <span className="text-sm font-medium">{job.salary || "—"}</span>
              </div>

              {/* Description */}
              <p className="mt-3 text-sm text-gray-700">
                {job.description?.slice(0, 140)}
                {job.description?.length > 140 ? "…" : ""}
              </p>

              {/* Requirements */}
              {!!job.requirements?.length && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {job.requirements.slice(0, 5).map((req, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-xs bg-gray-100 border rounded"
                    >
                      {req}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions (same layout you had) */}
              <div className="flex gap-3 mt-4">
                <button
              onClick={() => navigate(`/jobs/${job._id}`)}
              className="px-3 py-1 mt-3 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              View Details
            </button>
                <button
                  className="px-3 py-2 text-sm border rounded"
                  onClick={() => applyJob(jobId)}
                  disabled={submittingId === jobId}
                >
                  {submittingId === jobId ? "…" : "Apply"}
                </button>
                <button
                  className="px-3 py-2 text-sm border rounded"
                  onClick={() => removeJob(jobId)}
                  disabled={submittingId === jobId}
                >
                  Remove ❌
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {!savedJobs.length && (
        <div className="text-gray-600">You haven’t saved any jobs yet.</div>
      )}
    </div>
  );
}
