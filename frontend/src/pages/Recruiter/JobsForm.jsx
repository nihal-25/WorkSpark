import { useState } from "react";
import API from "../api";

export default function JobForm() {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    fullDescription: "",
    requirements: "",
    salary: "",
    jobType: "",
    minExperience: "",
    workMode: "In Office",
  });

  const [search, setSearch] = useState("");
  const [customJobType, setCustomJobType] = useState("");

  // ✅ Example job types (expand as needed)
  const jobTypes = [
    "Software Developer",
    "Web Developer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "App Developer",
    "Mobile Developer",
    "UI/UX Designer",
    "Data Scientist",
    "Machine Learning Engineer",
    "AI Engineer",
    "DevOps Engineer",
    "Cloud Architect",
    "Cybersecurity Analyst",
    "Database Administrator",
    "Network Engineer",
    "System Administrator",
    "Marketing Specialist",
    "Product Manager",
    "Business Analyst",
    "Graphic Designer",
    "Game Developer",
    "Content Writer",
    "Video Editor",
    "HR Manager",
    "Sales Executive",
    "Customer Support",
    "Finance Analyst",
    "Operations Manager",
    "QA Tester",
    "Other", // 🔹 special option
  ];

  const filteredJobTypes = jobTypes.filter((type) =>
    type.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    // enforce 1–2 line limit for description
    if (name === "description") {
      const lines = value.split("\n");
      if (lines.length > 2) return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalJobType =
      formData.jobType === "Other" ? customJobType.trim() : formData.jobType;

    if (!finalJobType) {
      alert("Please specify a job type.");
      return;
    }

    const payload = {
      ...formData,
      jobType: finalJobType,
      minExperience: parseInt(formData.minExperience || 0, 10),
      requirements: formData.requirements
        .split(",")
        .map((r) => r.trim())
        .filter(Boolean),
    };

    try {
      const res = await API.post("/jobs", payload);
      alert("✅ Job posted successfully!");
      console.log(res.data);

      // reset form
      setFormData({
        title: "",
        company: "",
        location: "",
        description: "",
        fullDescription: "",
        requirements: "",
        salary: "",
        jobType: "",
        minExperience: "",
        workMode: "In Office",
      });
      setSearch("");
      setCustomJobType("");
    } catch (err) {
      console.error("❌ Error posting job:", err.response?.data || err.message);
      alert("Failed to post job");
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="mb-4 text-xl font-bold">Post a Job</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-80">
        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={formData.title}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        />

        <input
          type="text"
          name="company"
          placeholder="Company Name"
          value={formData.company}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        />

        {/* Short 1–2 line description */}
        <textarea
          name="description"
          placeholder="Short Description (max 100 characters)"
          value={formData.description}
          onChange={handleChange}
          className="h-16 p-2 border rounded resize-none"
          maxLength={100}
          required
        />
        <div className="text-xs text-right text-gray-500">
          {formData.description.length}/100
        </div>

        {/* Full description */}
        <textarea
          name="fullDescription"
          placeholder="Full Job Description"
          value={formData.fullDescription}
          onChange={handleChange}
          className="h-32 p-2 border rounded"
          required
        />

        <input
          type="text"
          name="requirements"
          placeholder="Requirements (comma-separated)"
          value={formData.requirements}
          onChange={handleChange}
          className="p-2 border rounded"
        />

        <input
          type="text"
          name="salary"
          placeholder="Salary Range"
          value={formData.salary}
          onChange={handleChange}
          className="p-2 border rounded"
        />

        {/* 🔹 Job Type with Search */}
        <div>
          
          <select
            name="jobType"
            value={formData.jobType}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Job Type</option>
            {filteredJobTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          {/* 🔹 Show custom input if "Other" selected */}
          {formData.jobType === "Other" && (
            <input
              type="text"
              placeholder="Enter custom job type"
              value={customJobType}
              onChange={(e) => setCustomJobType(e.target.value)}
              className="w-full p-2 mt-2 border rounded"
              required
            />
          )}
        </div>

        {/* 🔹 Minimum Experience */}
        <input
          type="number"
          name="minExperience"
          placeholder="Minimum Experience (in years)"
          value={formData.minExperience}
          onChange={handleChange}
          min="0"
          className="p-2 border rounded"
          required
        />

        {/* 🔹 Work Mode */}
        <select
          name="workMode"
          value={formData.workMode}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        >
          <option value="In Office">In Office</option>
          <option value="Remote">Remote</option>
          <option value="Hybrid">Hybrid</option>
        </select>

        <button
          type="submit"
          className="p-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Post Job
        </button>
      </form>
    </div>
  );
}
