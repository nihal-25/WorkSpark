import { useEffect, useState } from "react";
import axios from "axios";

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedJobId, setExpandedJobId] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:5000/jobs/my-jobs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(res.data);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) return <div className="p-6">Loading your jobs…</div>;

  return (
    <div className="max-w-5xl p-6 mx-auto">
      <h2 className="mb-4 text-2xl font-bold">Your Posted Jobs</h2>

      {!jobs.length && <div>No jobs posted yet.</div>}

      <div className="grid gap-4">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="p-4 bg-white border rounded-lg shadow-sm"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{job.title}</h3>
                <p className="text-sm text-gray-600">
                  {job.company} • {job.location}
                </p>
              </div>
              <button
                onClick={() =>
                  setExpandedJobId(expandedJobId === job._id ? null : job._id)
                }
                className="px-3 py-1 text-sm bg-sky-500 text-white rounded"
              >
                {expandedJobId === job._id ? "Hide Applicants" : "View Applicants"}
              </button>
            </div>

            {/* Applicants */}
            {expandedJobId === job._id && (
              <div className="mt-3">
                {job.applicants.length ? (
                  <ul className="space-y-2">
                    {job.applicants.map((app) => (
                      <li
                        key={app._id}
                        className="p-2 border rounded bg-gray-50 flex justify-between"
                      >
                        <span>
                          {app.jobseeker?.name} ({app.jobseeker?.email})
                        </span>
                        <span className="text-sm text-gray-600">
                          Status: {app.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No applicants yet.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
