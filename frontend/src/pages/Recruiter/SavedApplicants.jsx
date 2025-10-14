import { useEffect, useState } from "react";
import axios from "axios";

export default function SavedApplicants() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState("all");
  const token = localStorage.getItem("token");

  // ✅ Fetch held applicants
  useEffect(() => {
    const fetchHeldApplicants = async () => {
      try {
        const res = await axios.get("http://localhost:5000/jobs/held-applicants", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplicants(res.data);
      } catch (err) {
        console.error("Failed to fetch held applicants:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHeldApplicants();
  }, [token]);

  const updateStatus = async (appId, status) => {
    try {
      await axios.patch(
        `http://localhost:5000/applications/${appId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update UI after accept/reject
      setApplicants((prev) => prev.filter((a) => a._id !== appId));
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status");
    }
  };

  if (loading) return <div className="p-6">Loading held applicants…</div>;

  // Filter by selected job
  const filteredApplicants =
    selectedJob === "all"
      ? applicants
      : applicants.filter((a) => a.job._id === selectedJob);

  // Extract unique jobs for dropdown
  const jobsList = Array.from(
    new Map(applicants.map((a) => [a.job._id, a.job])).values()
  );

  return (
    <div className="max-w-4xl p-6 mx-auto">
      <h2 className="mb-4 text-2xl font-bold">Saved (Hold) Applicants</h2>

      {jobsList.length > 0 && (
        <select
          value={selectedJob}
          onChange={(e) => setSelectedJob(e.target.value)}
          className="p-2 mb-6 border rounded"
        >
          <option value="all">All Jobs</option>
          {jobsList.map((job) => (
            <option key={job._id} value={job._id}>
              {job.title} — {job.company}
            </option>
          ))}
        </select>
      )}

      {filteredApplicants.length === 0 ? (
        <p className="text-gray-500">No applicants on hold.</p>
      ) : (
        <div className="grid gap-4">
          {filteredApplicants.map((app) => (
            <div
              key={app._id}
              className="p-4 bg-white border rounded-lg shadow-sm"
            >
              <h3 className="text-lg font-semibold">
                {app.jobseeker?.name || "Unknown"}
              </h3>
              <p className="text-gray-600">{app.jobseeker?.email}</p>
              <p className="mt-2">
                <strong>Job:</strong> {app.job.title} — {app.job.company}
              </p>

              {/* ✅ Updated Experience Display */}
              <p>
                <strong>Experience:</strong>{" "}
                {typeof app.jobseeker?.experience === "number"
                  ? app.jobseeker.experience > 0
                    ? `${app.jobseeker.experience} year${
                        app.jobseeker.experience > 1 ? "s" : ""
                      }`
                    : "Fresher"
                  : "N/A"}
              </p>

              <p>
                <strong>Skills:</strong>{" "}
                {(app.jobseeker?.skills || []).join(", ") || "Not provided"}
              </p>

              {/* View Resume Button */}
              {app.jobseeker?.resume && (
                <a
                  href={`http://localhost:5000/${app.jobseeker.resume}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-3 py-1 mt-3 text-white bg-blue-600 rounded"
                >
                  View Resume
                </a>
              )}

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => updateStatus(app._id, "accepted")}
                  className="px-4 py-2 text-white bg-green-600 rounded"
                >
                  Accept
                </button>
                <button
                  onClick={() => updateStatus(app._id, "rejected")}
                  className="px-4 py-2 text-white bg-red-500 rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
