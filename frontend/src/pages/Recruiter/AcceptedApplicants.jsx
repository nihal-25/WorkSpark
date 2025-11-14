import { useEffect, useState } from "react";
import API from "../api"; // ✅ use shared axios instance

export default function AcceptedApplicants() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [interviewData, setInterviewData] = useState({ date: "", link: "" });

  // ✅ Fetch accepted applicants
  useEffect(() => {
    const fetchAccepted = async () => {
      try {
        const res = await API.get("/jobs/accepted-applicants");
        setApplicants(res.data);
      } catch (err) {
        console.error("Failed to fetch accepted applicants:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccepted();
  }, []);

  // ✅ Update status (accepted → hold or reject)
  const updateStatus = async (appId, status) => {
    try {
      await API.patch(`/applications/${appId}/status`, { status });
      setApplicants((prev) => prev.filter((a) => a._id !== appId));
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status");
    }
  };

  // ✅ Schedule Interview
  const scheduleInterview = async () => {
    if (!interviewData.date || !interviewData.link) {
      alert("Please fill both date & meeting link");
      return;
    }

    try {
      const res = await API.patch(
        `/applications/${selectedApplicant._id}/schedule`,
        interviewData
      );

      alert("✅ Interview scheduled successfully!");

      setApplicants((prev) =>
        prev.map((a) =>
          a._id === selectedApplicant._id
            ? { ...a, interview: res.data.application.interview }
            : a
        )
      );

      setShowModal(false);
      setInterviewData({ date: "", link: "" });
      setSelectedApplicant(null);
    } catch (err) {
      console.error("Failed to schedule interview:", err);
      alert("❌ Failed to schedule interview");
    }
  };

  if (loading) return <div className="p-6">Loading accepted applicants…</div>;

  const filteredApplicants =
    selectedJob === "all"
      ? applicants
      : applicants.filter((a) => a.job._id === selectedJob);

  const jobsList = Array.from(
    new Map(applicants.map((a) => [a.job._id, a.job])).values()
  );

  return (
    <div className="min-h-screen px-6 pt-24 bg-gradient-to-b from-sky-200 via-white to-sky-100">
      <div className="max-w-5xl mx-auto">

        <h2 className="mb-6 text-3xl font-extrabold text-center text-sky-700">
          Accepted Applicants ✅
        </h2>

        {jobsList.length > 0 && (
          <select
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
            className="w-full p-3 mb-6 border rounded-lg shadow-sm bg-white/90 border-sky-200 focus:ring-2 focus:ring-sky-400"
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
            No accepted applicants yet.
          </p>
        ) : (
          <div className="grid gap-6">
            {filteredApplicants.map((app) => (
              <div
                key={app._id}
                className="p-6 transition border shadow-md rounded-2xl bg-white/90 border-sky-100 hover:shadow-xl"
              >
                <h3 className="text-xl font-semibold text-sky-700">
                  {app.jobseeker?.name}
                </h3>
                <p className="text-slate-600">{app.jobseeker?.email}</p>

                <p className="mt-3 text-sm text-slate-700">
                  <strong className="text-sky-600">Job:</strong> {app.job.title} — {app.job.company}
                </p>

                <p className="text-sm text-slate-700">
                  <strong className="text-sky-600">Experience:</strong>{" "}
                  {app.jobseeker?.experience > 0
                    ? `${app.jobseeker.experience} year${
                        app.jobseeker.experience > 1 ? "s" : ""
                      }`
                    : "Fresher"}
                </p>

                <p className="text-sm text-slate-700">
                  <strong className="text-sky-600">Skills:</strong>{" "}
                  {(app.jobseeker?.skills || []).join(", ") || "Not provided"}
                </p>

                {/* ✅ Fix resume download link */}
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

                <div className="flex flex-wrap gap-3 mt-6">
                  <button
                    onClick={() => updateStatus(app._id, "hold")}
                    className="px-3 py-1.5 text-sm bg-yellow-400 text-black rounded-md hover:bg-yellow-500"
                  >
                    Move to Hold ⏸
                  </button>

                  <button
                    onClick={() => updateStatus(app._id, "rejected")}
                    className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Reject ❌
                  </button>

                  {app.interview?.status === "scheduled" ? (
                    <span className="px-3 py-1.5 bg-green-100 text-green-700 border border-green-300 text-sm rounded-md">
                      Scheduled ✅
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedApplicant(app);
                        setShowModal(true);
                      }}
                      className="px-3 py-1.5 text-sm text-white bg-green-500 rounded-md hover:bg-green-600"
                    >
                      Schedule Interview 🗓
                    </button>
                  )}
                </div>

                {app.interview?.status === "scheduled" && (
                  <div className="mt-3 text-sm">
                    <p>
                      <strong>Date:</strong> {new Date(app.interview.date).toLocaleString()}
                    </p>
                    <p>
                      <strong>Link:</strong>{" "}
                      <a href={app.interview.link} className="underline text-sky-600" target="_blank">
                        Join Meeting
                      </a>
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ✅ Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="p-6 bg-white shadow-xl rounded-2xl w-96">
              <h3 className="mb-4 text-xl font-semibold text-sky-700">Schedule Interview</h3>

              <input
                type="datetime-local"
                value={interviewData.date}
                onChange={(e) => setInterviewData({ ...interviewData, date: e.target.value })}
                className="w-full p-2 mb-4 border rounded-lg border-sky-200 focus:ring-2 focus:ring-sky-400"
              />

              <input
                type="text"
                placeholder="Google Meet / Zoom Link"
                value={interviewData.link}
                onChange={(e) => setInterviewData({ ...interviewData, link: e.target.value })}
                className="w-full p-2 mb-6 border rounded-lg border-sky-200 focus:ring-2 focus:ring-sky-400"
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={scheduleInterview}
                  className="px-4 py-2 text-white rounded-lg bg-sky-600 hover:bg-sky-700"
                >
                  Schedule ✅
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
