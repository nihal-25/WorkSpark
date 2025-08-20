import { useEffect, useState } from "react";
import axios from "axios";

export default function JobSeekerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/jobs")
      .then((res) => setJobs(res.data))
      .catch((err) => console.error("Fetch jobs failed:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-6">Loading jobs…</div>;
  }

  return (
    <div className="max-w-5xl p-6 mx-auto">
      <h2 className="mb-4 text-2xl font-bold">Available Jobs</h2>

      <div className="grid gap-4 md:grid-cols-2">
        {jobs.map((job) => (
          <div key={job._id} className="p-4 bg-white border rounded-xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{job.title}</h3>
                <p className="text-sm text-gray-600">
                  {job.company} • {job.location}
                </p>
              </div>
              <span className="text-sm font-medium">
                {job.salary || "—"}
              </span>
            </div>

            <p className="mt-3 text-sm text-gray-700">
              {job.description?.slice(0, 140)}{job.description?.length > 140 ? "…" : ""}
            </p>

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

            <div className="flex gap-3 mt-4">
              <a
                href={`/jobs/${job._id}`}
                className="px-3 py-2 text-sm text-white bg-blue-600 rounded"
              >
                View details
              </a>
              <button
                className="px-3 py-2 text-sm border rounded"
                onClick={() => alert("Apply coming soon!")}
              >
                Apply
              </button>
            </div>
          </div>
        ))}
      </div>

      {!jobs.length && (
        <div className="text-gray-600">No jobs found.</div>
      )}
    </div>
  );
}
