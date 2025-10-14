import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api";

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get(`/jobs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJob(res.data);
      } catch (err) {
        console.error("Error fetching job details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  if (loading) return <div className="p-6">Loading job…</div>;
  if (!job) return <div className="p-6">Job not found.</div>;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 mb-4 bg-gray-200 rounded hover:bg-gray-300"
      >
        ⬅ Back
      </button>

      <div className="max-w-3xl p-6 mx-auto bg-white shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold">{job.title}</h2>
        <p className="text-gray-600">
          {job.company} • {job.location}
        </p>

        <div className="mt-2 space-y-1 text-sm text-gray-700">
          <p>
            <strong>💰 Salary:</strong> {job.salary || "Not specified"}
          </p>
          <p>
            <strong>Job Type:</strong> {job.jobType || "Not specified"}
          </p>
          <p>
            <strong>Work Mode:</strong> {job.workMode || "Not specified"}
          </p>
          <p>
            <strong>Min Experience:</strong> {job.minExperience || 0} years
          </p>
        </div>

        <h3 className="mt-4 text-lg font-semibold">Full Description</h3>
        <p className="mt-2 text-gray-700 whitespace-pre-line">{job.fullDescription}</p>

        {!!job.requirements?.length && (
          <div className="mt-4">
            <h3 className="font-semibold">Requirements</h3>
            <ul className="list-disc list-inside">
              {job.requirements.map((req, idx) => (
                <li key={idx}>{req}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
