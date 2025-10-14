import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawingId, setWithdrawingId] = useState(null);
  
  const navigate = useNavigate();
  // --- Withdraw an application ---
  const withdrawApplication = async (appId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("❌ No token found — please log in first");
    return;
  }

  setWithdrawingId(appId);
  try {
    await axios.patch(
      `http://localhost:5000/applications/${appId}/status`,
      { status: "rejected" },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // ✅ Remove from frontend list
    setApplications((prev) => prev.filter((app) => app._id !== appId));

    alert("🚫 Application withdrawn");
  } catch (error) {
    alert(
      "❌ Failed to withdraw: " +
        (error.response?.data?.message || error.message)
    );
  } finally {
    setWithdrawingId(null);
  }
};

  // --- Fetch applications ---
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5000/applications", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setApplications(res.data))
      .catch((err) => console.error("Fetch applications failed:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-6">Loading applications…</div>;
  }

  return (
    <div className="max-w-5xl p-6 mx-auto">
      <h2 className="mb-4 text-2xl font-bold">My Applications</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {applications.map((app) => {
          const job = app.job; // populated job object
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

              {/* Actions */}
              <div className="flex gap-3 mt-4">
                <button
              onClick={() => navigate(`/jobs/${job._id}`)}
              className="px-3 py-1 mt-3 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              View Details
            </button>
                <button
                  className="px-3 py-2 text-sm bg-red-100 border rounded"
                  onClick={() => withdrawApplication(app._id)}
                  disabled={withdrawingId === app._id}
                >
                  {withdrawingId === app._id ? "…" : "Withdraw ❌"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {!applications.length && (
        <div className="text-gray-600">
          You haven’t applied to any jobs yet.
        </div>
      )}
    </div>
  );
}
