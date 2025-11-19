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
    "Other",
  ];

  const filteredJobTypes = jobTypes.filter((type) =>
    type.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    // limit 1–2 lines for short description
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
    <div
      className="flex justify-center min-h-screen pt-24  bg-gradient-to-b from-sky-200 via-white to-sky-100 max-md:px-4 max-md:pt-20"
    >
      <div
        className="w-full max-w-md p-8 border shadow-xl  bg-white/90 backdrop-blur-md border-sky-100 rounded-2xl max-md:p-5 max-md:rounded-xl"
      >
        <h2
          className="mb-6 text-3xl font-extrabold text-center  text-sky-700 max-md:text-xl max-md:mb-4"
        >
          Post a Job 📝
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-md:gap-3">

          {/* Title */}
          <input
            type="text"
            name="title"
            placeholder="Job Title"
            value={formData.title}
            onChange={handleChange}
            className="
              p-3 border rounded-lg outline-none border-sky-200
              focus:ring-2 focus:ring-sky-400
              max-md:p-2.5 max-md:text-base
            "
            required
          />

          {/* Company */}
          <input
            type="text"
            name="company"
            placeholder="Company Name"
            value={formData.company}
            onChange={handleChange}
            className="
              p-3 border rounded-lg outline-none border-sky-200
              focus:ring-2 focus:ring-sky-400
              max-md:p-2.5 max-md:text-base
            "
            required
          />

          {/* Location */}
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="
              p-3 border rounded-lg outline-none border-sky-200
              focus:ring-2 focus:ring-sky-400
              max-md:p-2.5 max-md:text-base
            "
            required
          />

          {/* Short Description */}
          <div>
            <textarea
              name="description"
              placeholder="Short Description (max 100 characters)"
              value={formData.description}
              onChange={handleChange}
              maxLength={100}
              className="
                h-16 p-3 border rounded-lg outline-none resize-none border-sky-200 
                focus:ring-2 focus:ring-sky-400
                max-md:h-14 max-md:p-2.5 max-md:text-base
              "
              required
            />
            <div className="text-xs text-right text-slate-500">
              {formData.description.length}/100
            </div>
          </div>

          {/* Full Description */}
          <textarea
            name="fullDescription"
            placeholder="Full Job Description"
            value={formData.fullDescription}
            onChange={handleChange}
            className="
              h-32 p-3 border rounded-lg outline-none border-sky-200
              focus:ring-2 focus:ring-sky-400
              max-md:h-28 max-md:p-2.5 max-md:text-base
            "
            required
          />

          {/* Requirements */}
          <input
            type="text"
            name="requirements"
            placeholder="Requirements (comma-separated)"
            value={formData.requirements}
            onChange={handleChange}
            className="
              p-3 border rounded-lg outline-none border-sky-200 
              focus:ring-2 focus:ring-sky-400
              max-md:p-2.5 max-md:text-base
            "
          />

          {/* Salary */}
          <input
            type="text"
            name="salary"
            placeholder="Salary Range"
            value={formData.salary}
            onChange={handleChange}
            className="
              p-3 border rounded-lg outline-none border-sky-200 
              focus:ring-2 focus:ring-sky-400
              max-md:p-2.5 max-md:text-base
            "
          />

          {/* Job Type */}
          <div>
            <select
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              className="
                w-full p-3 border rounded-lg outline-none border-sky-200 
                focus:ring-2 focus:ring-sky-400
                max-md:p-2.5 max-md:text-base
              "
              required
            >
              <option value="">Select Job Type</option>
              {filteredJobTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            {/* Custom job type */}
            {formData.jobType === "Other" && (
              <input
                type="text"
                placeholder="Enter custom job type"
                value={customJobType}
                onChange={(e) => setCustomJobType(e.target.value)}
                className="
                  p-3 mt-3 border rounded-lg outline-none border-sky-200 
                  focus:ring-2 focus:ring-sky-400
                  max-md:p-2.5 max-md:text-base
                "
                required
              />
            )}
          </div>

          {/* Minimum Experience */}
          <input
            type="number"
            name="minExperience"
            placeholder="Minimum Experience (years)"
            value={formData.minExperience}
            onChange={handleChange}
            min="0"
            className="
              p-3 border rounded-lg outline-none border-sky-200
              focus:ring-2 focus:ring-sky-400
              max-md:p-2.5 max-md:text-base
            "
            required
          />

          {/* Work Mode */}
          <select
            name="workMode"
            value={formData.workMode}
            onChange={handleChange}
            className="
              p-3 border rounded-lg outline-none border-sky-200
              focus:ring-2 focus:ring-sky-400
              max-md:p-2.5 max-md:text-base
            "
            required
          >
            <option value="In Office">In Office</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
          </select>

          {/* Submit */}
          <button
            type="submit"
            className="
              p-3 font-semibold text-white rounded-lg shadow-md 
              bg-gradient-to-r from-sky-500 to-sky-600 
              hover:from-sky-600 hover:to-sky-700
              max-md:p-2.5 max-md:text-base
            "
          >
            Post Job ✅
          </button>
        </form>
      </div>
    </div>
  );
}
