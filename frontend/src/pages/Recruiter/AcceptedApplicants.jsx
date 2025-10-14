import { useEffect, useState } from "react";
import axios from "axios";

export default function AcceptedApplicants() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [interviewData, setInterviewData] = useState({ date: "", link: "" });

  const token = localStorage.getItem("token");

  // ✅ Fetch accepted applicants
  useEffect(() => {
    const fetchAccepted = async () => {
      try {
        const res = await axios.get("http://localhost:5000/jobs/accepted-applicants", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplicants(res.data);
      } catch (err) {
        console.error("Failed to fetch accepted applicants:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccepted();
  }, [token]);

  const updateStatus = async (appId, status) => {
    try {
      await axios.patch(
        `http://localhost:5000/applications/${appId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update status locally
      setApplicants((prev) =>
        prev.map((a) =>
          a._id === appId ? { ...a, status } : a
        )
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status");
    }
  };

  // 🆕 Schedule interview
  const scheduleInterview = async () => {
    if (!interviewData.date || !interviewData.link) {
      alert("Please fill both date and meeting link");
      return;
    }

    try {
      const res = await axios.patch(
        `http://localhost:5000/applications/${selectedApplicant._id}/schedule`,
        interviewData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Interview scheduled successfully!");

      // ✅ Update the applicant's interview info in state (keep card visible)
      setApplicants((prev) =>
        prev.map((a) =>
          a._id === selectedApplicant._id
            ? { ...a, interview: res.data.application.interview }
            : a
        )
      );

      // Reset modal
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

  const jobsList = Array.from(new Map(applicants.map((a) => [a.job._id, a.job])).values());

  return (
    <div className="relative max-w-4xl p-6 mx-auto">
      <h2 className="mb-4 text-2xl font-bold">Accepted Applicants</h2>

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
        <p className="text-gray-500">No accepted applicants.</p>
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
                {(app.jobseeker?.skills || []).join(", ")}
              </p>

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

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-4">
                <button
                  onClick={() => updateStatus(app._id, "hold")}
                  className="px-4 py-2 text-white bg-yellow-500 rounded"
                >
                  Move to Hold
                </button>
                <button
                  onClick={() => updateStatus(app._id, "rejected")}
                  className="px-4 py-2 text-white bg-red-500 rounded"
                >
                  Reject
                </button>

                {/* 🆕 Schedule Interview / Already Scheduled */}
                {app.interview?.status === "scheduled" ? (
                  <span className="px-4 py-2 text-sm font-semibold text-green-700 bg-green-100 border border-green-300 rounded">
                    ✅ Interview Scheduled
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedApplicant(app);
                      setShowModal(true);
                    }}
                    className="px-4 py-2 text-white bg-green-600 rounded"
                  >
                    Schedule Interview
                  </button>
                )}
              </div>

              {/* 🗓 Show interview details if scheduled */}
              {app.interview?.status === "scheduled" && (
                <div className="mt-3 text-sm text-gray-700">
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(app.interview.date).toLocaleString()}
                  </p>
                  <p>
                    <strong>Link:</strong>{" "}
                    <a
                      href={app.interview.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Join Meeting
                    </a>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 🆕 Schedule Interview Modal */}
      {showModal && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg shadow-lg w-96">
            <h3 className="mb-4 text-xl font-semibold">Schedule Interview</h3>

            <label className="block mb-2 text-sm font-medium">Date & Time</label>
            <input
              type="datetime-local"
              value={interviewData.date}
              onChange={(e) =>
                setInterviewData((prev) => ({ ...prev, date: e.target.value }))
              }
              className="w-full p-2 mb-4 border rounded"
            />

            <label className="block mb-2 text-sm font-medium">Meeting Link</label>
            <input
              type="text"
              placeholder="Google Meet / Zoom link"
              value={interviewData.link}
              onChange={(e) =>
                setInterviewData((prev) => ({ ...prev, link: e.target.value }))
              }
              className="w-full p-2 mb-4 border rounded"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={scheduleInterview}
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
