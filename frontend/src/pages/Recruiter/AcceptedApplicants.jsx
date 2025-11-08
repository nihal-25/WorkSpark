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
  <div className="min-h-screen px-6 pt-24 bg-gradient-to-b from-sky-200 via-white to-sky-100">
    <div className="max-w-5xl mx-auto">

      <h2 className="mb-6 text-3xl font-extrabold text-center text-sky-700">
        Accepted Applicants ✅
      </h2>

      {jobsList.length > 0 && (
        <select
          value={selectedJob}
          onChange={(e) => setSelectedJob(e.target.value)}
          className="w-full p-3 mb-6 transition border rounded-lg shadow-sm outline-none bg-white/90 backdrop-blur-md border-sky-200 focus:ring-2 focus:ring-sky-400"
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
              className="p-6 transition border shadow-md bg-white/90 backdrop-blur-md border-sky-100 rounded-2xl hover:shadow-xl"
            >
              <h3 className="text-xl font-semibold text-sky-700">
                {app.jobseeker?.name || "Unnamed Applicant"}
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

              {app.jobseeker?.resume && (
                <a
                  href={`http://localhost:5000/${app.jobseeker.resume}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 mt-4 text-white transition rounded-lg shadow-sm bg-sky-500 hover:bg-sky-600"
                >
                  View Resume 📄
                </a>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-6">
                <button
                  onClick={() => updateStatus(app._id, "hold")}
                  className="px-3 py-1.5 bg-yellow-400 text-black rounded-md text-sm hover:bg-yellow-500 transition shadow-sm"
                >
                  Move to Hold ⏸
                </button>

                <button
                  onClick={() => updateStatus(app._id, "rejected")}
                  className="px-3 py-1.5 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition shadow-sm"
                >
                  Reject ❌
                </button>

                {app.interview?.status === "scheduled" ? (
                  <span className="px-3 py-1.5 text-sm font-medium text-green-700 bg-green-100 border border-green-300 rounded-md">
                    Scheduled ✅
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedApplicant(app);
                      setShowModal(true);
                    }}
                    className="px-3 py-1.5 bg-green-500 text-white rounded-md text-sm hover:bg-green-600 transition shadow-sm"
                  >
                    Schedule Interview 🗓
                  </button>
                )}
              </div>

              {/* Display interview details */}
              {app.interview?.status === "scheduled" && (
                <div className="mt-3 text-sm text-slate-700">
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
                      className="underline text-sky-600"
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="p-6 bg-white shadow-xl rounded-2xl w-96">
            <h3 className="mb-4 text-xl font-semibold text-sky-700">Schedule Interview</h3>

            <label className="block mb-1 text-sm font-medium">Date & Time</label>
            <input
              type="datetime-local"
              value={interviewData.date}
              onChange={(e) => setInterviewData((prev) => ({ ...prev, date: e.target.value }))}
              className="w-full p-2 mb-4 border rounded-lg outline-none border-sky-200 focus:ring-2 focus:ring-sky-400"
            />

            <label className="block mb-1 text-sm font-medium">Meeting Link</label>
            <input
              type="text"
              placeholder="Google Meet / Zoom Link"
              value={interviewData.link}
              onChange={(e) => setInterviewData((prev) => ({ ...prev, link: e.target.value }))}
              className="w-full p-2 mb-6 border rounded-lg outline-none border-sky-200 focus:ring-2 focus:ring-sky-400"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 transition bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>

              <button
                onClick={scheduleInterview}
                className="px-4 py-2 text-white transition rounded-lg bg-sky-600 hover:bg-sky-700"
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
