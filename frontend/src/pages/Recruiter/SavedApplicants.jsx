import { useEffect, useState } from "react";
import API from "../api"; // ✅ use shared API instance

export default function SavedApplicants() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState("all");
  const token = localStorage.getItem("token");

  // ✅ Fetch held applicants (using deployed backend)
  useEffect(() => {
    const fetchHeldApplicants = async () => {
      try {
        const res = await API.get("/jobs/held-applicants");
        setApplicants(res.data);
      } catch (err) {
        console.error("Failed to fetch held applicants:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHeldApplicants();
  }, []);

  // ✅ Update applicant status
  const updateStatus = async (appId, status) => {
    try {
      await API.patch(`/applications/${appId}/status`, { status });
      setApplicants((prev) => prev.filter((a) => a._id !== appId));
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status");
    }
  };

  if (loading) return <div className="p-6">Loading held applicants…</div>;

  // ✅ Filter applicants based on dropdown
  const filteredApplicants =
    selectedJob === "all"
      ? applicants
      : applicants.filter((a) => a.job._id === selectedJob);

  // ✅ Job dropdown list
  const jobsList = Array.from(
    new Map(applicants.map((a) => [a.job._id, a.job])).values()
  );

  return (
    <div className="min-h-screen px-6 pt-24 bg-gradient-to-b from-sky-200 via-white to-sky-100">
      <div className="max-w-4xl mx-auto">

        <h2 className="mb-6 text-3xl font-extrabold text-center text-sky-700">
          Saved (On Hold) Applicants ⏸️
        </h2>

        {jobsList.length > 0 && (
          <select
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
            className="w-full p-3 mb-6 border rounded-lg shadow-sm bg-white/90 backdrop-blur-md border-sky-200 focus:ring-2 focus:ring-sky-400"
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
          <p className="text-lg text-center text-slate-600">
            No applicants on hold.
          </p>
        ) : (
          <div className="grid gap-6">
            {filteredApplicants.map((app) => (
              <div
                key={app._id}
                className="p-6 transition border shadow-lg bg-white/90 backdrop-blur-md border-sky-100 rounded-2xl hover:shadow-2xl"
              >
                <h3 className="text-xl font-semibold text-sky-700">
                  {app.jobseeker?.name || "Unknown Applicant"}
                </h3>
                <p className="text-slate-600">{app.jobseeker?.email}</p>

                <p className="mt-3 text-sm text-slate-700">
                  <strong className="text-sky-600">Job:</strong> {app.job.title} — {app.job.company}
                </p>

                <p className="text-sm text-slate-700">
                  <strong className="text-sky-600">Experience:</strong>{" "}
                  {typeof app.jobseeker?.experience === "number"
                    ? app.jobseeker.experience > 0
                      ? `${app.jobseeker.experience} year${
                          app.jobseeker.experience > 1 ? "s" : ""
                        }`
                      : "Fresher"
                    : "N/A"}
                </p>

                <p className="text-sm text-slate-700">
                  <strong className="text-sky-600">Skills:</strong>{" "}
                  {(app.jobseeker?.skills || []).join(", ") || "Not provided"}
                </p>

                {/* ✅ Resume link fixed */}
                {app.jobseeker?.resume && (
                  <a
                    href={`https://workspark.onrender.com/${app.jobseeker.resume}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 mt-4 text-white transition rounded-lg bg-sky-500 hover:bg-sky-600"
                  >
                    View Resume 📄
                  </a>
                )}

                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => updateStatus(app._id, "accepted")}
                    className="px-4 py-2 text-sm text-white transition bg-green-500 rounded-lg hover:bg-green-600"
                  >
                    Accept ✅
                  </button>

                  <button
                    onClick={() => updateStatus(app._id, "rejected")}
                    className="px-4 py-2 text-sm text-white transition bg-red-500 rounded-lg hover:bg-red-600"
                  >
                    Reject ❌
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
