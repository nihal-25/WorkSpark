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

  // fetch recruiter jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/jobs/my-jobs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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

  const cancelEditing = () => {
    setEditingJobId(null);
    setFormData({
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
  };

  const saveJob = async () => {
    try {
      const token = localStorage.getItem("token");

      const payload = {
        ...formData,
        requirements: formData.requirements
          .split(",")
          .map((r) => r.trim())
          .filter(Boolean),
        minExperience: Number(formData.minExperience),
      };

      const res = await API.put(`/jobs/${editingJobId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setJobs((prev) =>
        prev.map((j) => (j._id === editingJobId ? res.data : j))
      );
      alert("Job updated successfully");
      cancelEditing();
    } catch (err) {
      console.error(err);
      alert("Failed to update job");
    }
  };

  const deleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setJobs((prev) => prev.filter((j) => j._id !== jobId));
      alert("Job deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to delete job");
    }
  };

  if (loading) return <div className="p-6">Loading jobs…</div>;

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="mb-4 text-xl font-bold">Manage Your Jobs</h2>

      {jobs.length === 0 && (
        <div className="text-gray-600">You have not posted any jobs yet.</div>
      )}

      <div className="flex flex-col w-full max-w-2xl gap-6">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="flex flex-col gap-2 p-4 bg-white rounded shadow"
          >
            {editingJobId === job._id ? (
              <>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Job Title"
                  className="p-2 border rounded"
                />
                <input
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Company"
                  className="p-2 border rounded"
                />
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Location"
                  className="p-2 border rounded"
                />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Short Description"
                  className="p-2 border rounded resize-none"
                  maxLength={100}
                />
                <textarea
                  name="fullDescription"
                  value={formData.fullDescription}
                  onChange={handleChange}
                  placeholder="Full Description"
                  className="p-2 border rounded"
                />
                <input
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  placeholder="Requirements (comma-separated)"
                  className="p-2 border rounded"
                />
                <input
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="Salary"
                  className="p-2 border rounded"
                />
                <input
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  placeholder="Job Type"
                  className="p-2 border rounded"
                />
                <input
                  name="workMode"
                  value={formData.workMode}
                  onChange={handleChange}
                  placeholder="Work Mode"
                  className="p-2 border rounded"
                />
                <input
                  name="minExperience"
                  type="number"
                  value={formData.minExperience}
                  onChange={handleChange}
                  placeholder="Min Experience (years)"
                  className="p-2 border rounded"
                  min={0}
                />

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={saveJob}
                    className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold">{job.title}</h3>
                <p className="text-gray-600">
                  {job.company} • {job.location}
                </p>
                <p>{job.description}</p>
                <p className="text-sm text-gray-700">
                  Requirements: {job.requirements.join(", ")}
                </p>
                <p className="text-sm font-medium">Salary: {job.salary}</p>
                <p className="text-sm font-medium">
                  Job Type: {job.jobType || "Not specified"} • Work Mode: {job.workMode || "Not specified"} • Min Experience: {job.minExperience || 0} years
                </p>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => startEditing(job)}
                    className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteJob(job._id)}
                    className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
