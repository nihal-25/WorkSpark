import { useEffect, useState, useContext } from "react";
import API from "../api";
import AuthContext from "../../context/AuthContext";

export default function ProfilePage() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    skills: [],
    experience: 0,
  });
  const [newSkill, setNewSkill] = useState("");
  const [resumeFile, setResumeFile] = useState(null);

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/users/me");
        setProfile(res.data);
        setFormData({
          name: res.data.name || "",
          role: res.data.role || "",
          skills: res.data.skills || [],
          experience: res.data.experience || 0,
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Ensure experience stays numeric
    if (name === "experience") {
      setFormData((prev) => ({ ...prev, experience: Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && formData.skills.length < 5) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (index) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  // Save profile
  const handleSave = async () => {
    try {
      // 1️⃣ Update details
      const res = await API.put("/users/me", formData);
      setProfile(res.data);

      // 2️⃣ Upload resume if selected
      if (resumeFile) {
        const fd = new FormData();
        fd.append("resume", resumeFile);

        const uploadRes = await API.post("/users/upload-resume", fd, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setProfile((prev) => ({ ...prev, resume: uploadRes.data.resume }));
        setResumeFile(null);
      }

      setEditMode(false);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="max-w-md p-6 mx-auto mt-10 bg-white rounded shadow">
      <h2 className="mb-4 text-xl font-bold">My Profile</h2>

      {editMode ? (
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block font-semibold">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block font-semibold">Email:</label>
            <p className="p-2 bg-gray-100 rounded">{profile.email}</p>
          </div>

          {/* Role */}
          <div>
            <label className="block font-semibold">Role:</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="recruiter">Recruiter</option>
              <option value="jobseeker">Jobseeker</option>
            </select>
          </div>

          {/* ✅ Experience (number input) */}
          <div>
            <label className="block font-semibold">Experience (in years):</label>
            <input
              type="number"
              name="experience"
              min="0"
              value={formData.experience}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Enter your total years of experience"
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block font-semibold">Skills (max 5):</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="flex-1 p-2 border rounded"
                placeholder="Enter a skill"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-1 text-white bg-blue-500 rounded"
                disabled={formData.skills.length >= 5}
              >
                Add
              </button>
            </div>
            <ul className="flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <li
                  key={index}
                  className="flex items-center gap-1 px-2 py-1 text-sm bg-gray-200 rounded"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(index)}
                    className="text-red-500"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Resume Upload */}
          <div>
            <label className="block font-semibold">Resume (PDF only):</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setResumeFile(e.target.files[0])}
              className="w-full p-2 border rounded"
            />
            {profile.resume && (
              <p className="mt-2 text-sm text-gray-600">
                Current Resume:{" "}
                <a
                  href={`http://localhost:5000/${profile.resume}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View / Download
                </a>
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 text-white bg-green-500 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="px-4 py-2 bg-gray-400 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <p>
            <span className="font-semibold">Name:</span> {profile.name}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {profile.email}
          </p>
          <p>
            <span className="font-semibold">Role:</span> {profile.role}
          </p>
          <p>
            <span className="font-semibold">Experience:</span>{" "}
            {profile.experience != null
  ? `${profile.experience} ${profile.experience === 1 ? "year" : "years"}`
  : "—"}
          </p>
          <p>
            <span className="font-semibold">Skills:</span>{" "}
            {profile.skills.length > 0 ? profile.skills.join(", ") : "—"}
          </p>
          <p>
            <span className="font-semibold">Resume:</span>{" "}
            {profile.resume ? (
              <a
                href={`http://localhost:5000/${profile.resume}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View / Download
              </a>
            ) : (
              "—"
            )}
          </p>

          <button
            onClick={() => setEditMode(true)}
            className="px-4 py-2 text-white bg-blue-500 rounded"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
}
