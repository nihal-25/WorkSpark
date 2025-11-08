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
  <div className="min-h-screen px-6 pt-24 bg-gradient-to-b from-sky-200 via-white to-sky-100">
    
    <button
      onClick={() => navigate(-1)}
      className="px-4 py-2 mb-6 transition border rounded-lg shadow-sm text-sky-700 bg-sky-100 border-sky-200 hover:bg-sky-200"
    >
      ⬅ Back
    </button>

    <div className="max-w-3xl p-8 mx-auto border shadow-xl bg-white/90 backdrop-blur-md border-sky-100 rounded-2xl">
      <h2 className="text-3xl font-extrabold text-sky-700">{job.title}</h2>
      <p className="mt-1 text-slate-600">
        {job.company} • {job.location}
      </p>

      {/* Highlights */}
      <div className="mt-4 space-y-2 text-sm text-slate-700">
        <p><strong className="text-sky-700">💰 Salary:</strong> {job.salary || "Not specified"}</p>
        <p><strong className="text-sky-700">Job Type:</strong> {job.jobType || "Not specified"}</p>
        <p><strong className="text-sky-700">Work Mode:</strong> {job.workMode || "Not specified"}</p>
        <p><strong className="text-sky-700">Min Experience:</strong> {job.minExperience || 0} years</p>
      </div>

      {/* Description */}
      <h3 className="mt-6 text-lg font-semibold text-sky-700">Full Description</h3>
      <p className="mt-2 leading-relaxed whitespace-pre-line text-slate-700">
        {job.fullDescription}
      </p>

      {/* Requirements */}
      {!!job.requirements?.length && (
        <div className="mt-6">
          <h3 className="font-semibold text-sky-700">Requirements</h3>
          <ul className="mt-2 space-y-1 list-disc list-inside text-slate-700">
            {job.requirements.map((req, idx) => (
              <li key={idx}>{req}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Bottom Buttons */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 transition rounded-lg bg-sky-200 text-sky-700 hover:bg-sky-300"
        >
          Go Back
        </button>
        <button
          onClick={() => navigate("/jobseeker-dashboard")}
          className="px-5 py-2 text-white transition rounded-lg shadow-md bg-sky-500 hover:bg-sky-600"
        >
          Find More Jobs
        </button>
      </div>
    </div>
  </div>
);

}
