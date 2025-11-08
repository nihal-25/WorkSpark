import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawingId, setWithdrawingId] = useState(null);
  
  const navigate = useNavigate();
  
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
  <div className="min-h-screen px-6 pt-24 bg-gradient-to-b from-sky-200 via-white to-sky-100">
    <div className="max-w-5xl mx-auto">

      <h2 className="mb-6 text-3xl font-extrabold text-center text-sky-700">
        My Applications 📄
      </h2>

      {applications.length === 0 && (
        <div className="text-lg text-center text-slate-600">
          You haven’t applied to any jobs yet.
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {applications.map((app) => {
          const job = app.job;
          if (!job) return null;

          return (
            <div
              key={app._id}
              className="p-5 transition-all border shadow-md bg-white/90 border-sky-100 rounded-2xl backdrop-blur-md hover:shadow-xl"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
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
                  className="px-4 py-2 text-sm text-red-600 transition bg-red-100 rounded-lg hover:bg-red-200 disabled:opacity-60"
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
    </div>
  </div>
);

}
