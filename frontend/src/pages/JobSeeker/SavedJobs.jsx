import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState(null);

  const navigate = useNavigate();

  const token = useMemo(() => localStorage.getItem("token"), []);
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const jobIdOf = (row) => {
    if (!row || !row.job) return null;
    return typeof row.job === "string" ? row.job : row.job._id || null;
  };

  const dropByJobId = (jobId) => {
    setSavedJobs((prev) =>
      prev.filter((row) => jobIdOf(row) !== jobId)
    );
  };

  const applyJob = async (jobId) => {
    if (!token) return alert("❌ Please log in first");
    setSubmittingId(jobId);
    try {
      await axios.post(
        "http://localhost:5000/applications",
        { job: jobId },
        { headers: authHeaders }
      );

      try {
        await axios.delete(`http://localhost:5000/savedJobs/${jobId}`, {
          headers: authHeaders,
        });
      } catch {}

      dropByJobId(jobId);
      alert("✅ Application submitted!");
    } catch (error) {
      if (error.response?.status === 409) {
        alert("⚠️ Already applied");
        dropByJobId(jobId);
      } else {
        alert("❌ Failed: " + (error.response?.data?.message || error.message));
      }
    } finally {
      setSubmittingId(null);
    }
  };

  const removeJob = async (jobId) => {
    if (!token) return alert("❌ Please log in first");
    setSubmittingId(jobId);
    try {
      await axios.delete(`http://localhost:5000/savedJobs/${jobId}`, {
        headers: authHeaders,
      });
      alert("🗑️ Removed");
    } catch {}
    finally {
      dropByJobId(jobId);
      setSubmittingId(null);
    }
  };

  useEffect(() => {
    if (!token) return setLoading(false);
    axios
      .get("http://localhost:5000/savedJobs", { headers: authHeaders })
      .then((res) => {
        const rows = Array.isArray(res.data)
          ? res.data.filter((r) => r?.job)
          : [];
        setSavedJobs(rows);
      })
      .finally(() => setLoading(false));
  }, [token]);

  if (loading)
    return (
      <div className="flex justify-center pt-24 text-sky-600">
        Loading saved jobs…
      </div>
    );

  return (
    <div className="min-h-screen px-6 pt-24 bg-gradient-to-b from-sky-200 via-white to-sky-100">
      <div className="max-w-5xl mx-auto">
        <h2 className="mb-6 text-3xl font-extrabold text-center text-sky-700">
          Saved Jobs 📌
        </h2>

        {savedJobs.length === 0 && (
          <div className="text-lg text-center text-slate-600">
            You haven’t saved any jobs yet.
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {savedJobs.map((app) => {
            const job = app.job;
            const jobId = jobIdOf(app);
            if (!job) return null;

            return (
              <div
                key={app._id}
                className="p-5 transition-all border shadow-md bg-white/90 border-sky-100 rounded-2xl backdrop-blur-md hover:shadow-xl"
              >
                {/* Header */}
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-sky-700">
                      {job.title}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {job.company} • {job.location}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-sky-700">
                    {job.salary || "—"}
                  </span>
                </div>

                {/* Description */}
                <p className="mt-3 text-sm text-slate-700">
                  {job.description?.slice(0, 140)}
                  {job.description?.length > 140 ? "…" : ""}
                </p>

                {/* Requirements */}
                {!!job.requirements?.length && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {job.requirements.slice(0, 5).map((req, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 text-xs rounded-full bg-sky-100 text-sky-700"
                      >
                        {req}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3 mt-5">
                  <button
                    onClick={() => navigate(`/jobs/${job._id}`)}
                    className="px-4 py-2 text-sm text-white transition rounded-lg bg-sky-500 hover:bg-sky-600"
                  >
                    View
                  </button>

                  <button
                    onClick={() => applyJob(jobId)}
                    disabled={submittingId === jobId}
                    className="px-4 py-2 text-sm text-white transition bg-green-500 rounded-lg hover:bg-green-600 disabled:opacity-60"
                  >
                    {submittingId === jobId ? "…" : "Apply ✅"}
                  </button>

                  <button
                    onClick={() => removeJob(jobId)}
                    disabled={submittingId === jobId}
                    className="px-4 py-2 text-sm text-red-600 transition bg-red-100 rounded-lg hover:bg-red-200 disabled:opacity-60"
                  >
                    Remove ❌
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
