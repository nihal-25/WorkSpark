import { useEffect, useState } from "react";
import API from "../api";

export default function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingJobId, setEditingJobId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    fullDescription: "",
    requirements: "",
    salary: "",
    jobType: "",
    workMode: "",
    minExperience: 0,
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/jobs/my-jobs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(res.data);
      } catch {
        alert("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const startEditing = (job) => {
    setEditingJobId(job._id);
    setFormData({
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.description,
      fullDescription: job.fullDescription,
      requirements: job.requirements.join(", "),
      salary: job.salary,
      jobType: job.jobType || "",
      workMode: job.workMode || "",
      minExperience: job.minExperience || 0,
    });
  };

  const cancelEditing = () => setEditingJobId(null);

  const saveJob = async () => {
    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...formData,
        requirements: formData.requirements.split(",").map((r) => r.trim()),
        minExperience: Number(formData.minExperience),
      };

      const res = await API.put(`/jobs/${editingJobId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setJobs((prev) => prev.map((j) => (j._id === editingJobId ? res.data : j)));
      cancelEditing();
      alert("✅ Job updated successfully");
    } catch {
      alert("Failed to update job");
    }
  };

  const deleteJob = async (jobId) => {
    if (!window.confirm("Delete this job?")) return;
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
    } catch {
      alert("Failed to delete job");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen font-semibold text-sky-700">
        Loading your jobs…
      </div>
    );

  return (
    <div className="min-h-screen px-6 pt-24 bg-gradient-to-b from-sky-200 via-white to-sky-100">
      <h2 className="mb-8 text-3xl font-extrabold text-center text-sky-700">
        Manage Your Job Posts
      </h2>

      {jobs.length === 0 && (
        <p className="text-lg text-center text-gray-600">
          You have not posted any jobs yet.
        </p>
      )}

      <div className="grid max-w-5xl gap-6 mx-auto">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="p-6 transition border shadow-sm bg-white/90 backdrop-blur-md border-sky-100 rounded-2xl hover:shadow-lg"
          >
            <h3 className="text-xl font-semibold text-sky-700">{job.title}</h3>
            <p className="text-slate-600">{job.company} • {job.location}</p>
            <p className="mt-2 text-sm text-slate-700">{job.description}</p>

            <div className="mt-3 text-sm">
              <p><strong className="text-sky-600">Requirements:</strong> {job.requirements.join(", ")}</p>
              <p><strong className="text-sky-600">Salary:</strong> {job.salary}</p>
              <p><strong className="text-sky-600">Type:</strong> {job.jobType} • {job.workMode}</p>
              <p><strong className="text-sky-600">Experience:</strong> {job.minExperience} yrs</p>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => startEditing(job)}
                className="px-4 py-2 text-white transition rounded-lg shadow bg-sky-500 hover:bg-sky-600"
              >
                Edit ✏️
              </button>
              <button
                onClick={() => deleteJob(job._id)}
                className="px-4 py-2 text-white transition bg-red-500 rounded-lg shadow hover:bg-red-600"
              >
                Delete 🗑
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT POPUP */}
      {editingJobId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-[450px] max-h-[85vh] overflow-y-auto p-6 bg-white rounded-2xl shadow-xl border border-sky-200">
            <h3 className="mb-4 text-xl font-bold text-sky-700">Edit Job</h3>

            <div className="grid gap-3">
              {Object.keys(formData).map((key) => (
                key === "fullDescription" ? (
                  <textarea key={key} name={key} value={formData[key]} onChange={handleChange} className="p-3 border rounded-lg" rows={4}/>
                ) : (
                  <input key={key} name={key} value={formData[key]} onChange={handleChange} className="p-3 border rounded-lg" />
                )
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={cancelEditing} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">Cancel</button>
              <button onClick={saveJob} className="px-4 py-2 text-white rounded-lg bg-sky-600 hover:bg-sky-700">Save ✅</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
