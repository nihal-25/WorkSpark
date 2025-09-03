import { useState } from "react";
import API from "../api";

export default function JobForm() {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    requirements: "",
    salary: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // convert comma-separated requirements into an array
    const payload = {
      ...formData,
      requirements: formData.requirements
        .split(",")
        .map((r) => r.trim())
        .filter(Boolean),
    };

    try {
      const res = await API.post("/jobs", payload);
      alert("Job posted successfully!");
      console.log(res.data);

      // reset form
      setFormData({
        title: "",
        company: "",
        location: "",
        description: "",
        requirements: "",
        salary: "",
      });
    } catch (err) {
      console.error("Error posting job:", err.response?.data || err.message);
      alert("Failed to post job");
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-xl font-bold mb-4">Post a Job</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-80">
        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={formData.title}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          type="text"
          name="company"
          placeholder="Company Name"
          value={formData.company}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <textarea
          name="description"
          placeholder="Job Description"
          value={formData.description}
          onChange={handleChange}
          className="border p-2 rounded h-24"
          required
        />

        <input
          type="text"
          name="requirements"
          placeholder="Requirements (comma-separated)"
          value={formData.requirements}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          type="text"
          name="salary"
          placeholder="Salary"
          value={formData.salary}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Post Job
        </button>
      </form>
    </div>
  );
}
