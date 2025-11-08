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

  const handleSave = async () => {
    try {
      const res = await API.put("/users/me", formData);
      setProfile(res.data);

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

  if (!profile)
    return (
      <div className="flex justify-center pt-24 text-sky-600">
        Loading profile…
      </div>
    );

  return (
    <div className="flex justify-center min-h-screen pt-24 bg-gradient-to-b from-sky-200 via-white to-sky-100">
      <div className="w-full max-w-md p-6 border shadow-lg bg-white/90 backdrop-blur-md border-sky-100 rounded-2xl">
        <h2 className="mb-6 text-2xl font-extrabold text-center text-sky-700">
          My Profile
        </h2>

        {editMode ? (
          <div className="space-y-5">
            {/* Name */}
            <div>
              <label className="block mb-1 font-medium text-sky-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg outline-none border-sky-200 focus:ring-2 focus:ring-sky-400"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-1 font-medium text-sky-700">Email</label>
              <p className="px-3 py-2 border rounded-lg bg-sky-50 border-sky-100 text-slate-600">
                {profile.email}
              </p>
            </div>

            {/* Role */}
            <div>
              <label className="block mb-1 font-medium text-sky-700">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg outline-none border-sky-200 focus:ring-2 focus:ring-sky-400"
              >
                <option value="recruiter">Recruiter</option>
                <option value="jobseeker">Jobseeker</option>
              </select>
            </div>

            {/* Experience */}
            <div>
              <label className="block mb-1 font-medium text-sky-700">
                Experience (years)
              </label>
              <input
                type="number"
                name="experience"
                min="0"
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg outline-none border-sky-200 focus:ring-2 focus:ring-sky-400"
              />
            </div>

            {/* Skills */}
            <div>
              <label className="block mb-2 font-medium text-sky-700">Skills (max 5)</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg outline-none border-sky-200 focus:ring-2 focus:ring-sky-400"
                  placeholder="Enter a skill"
                />
                <button
                  onClick={handleAddSkill}
                  disabled={formData.skills.length >= 5}
                  className="px-4 py-2 text-white rounded-lg bg-sky-500 hover:bg-sky-600 disabled:opacity-60"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-1 px-3 py-1 text-sm rounded-full bg-sky-100 text-sky-700"
                  >
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Resume Upload */}
            <div>
              <label className="block mb-1 font-medium text-sky-700">Resume (PDF)</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setResumeFile(e.target.files[0])}
                className="w-full px-3 py-2 bg-white border rounded-lg outline-none border-sky-200 focus:ring-2 focus:ring-sky-400"
              />
              {profile.resume && (
                <a
                  href={`http://localhost:5000/${profile.resume}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-sm underline text-sky-600"
                >
                  View Current Resume
                </a>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-between pt-2">
              <button
                onClick={handleSave}
                className="px-5 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600"
              >
                Save
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="px-5 py-2 text-black rounded-lg bg-sky-200 hover:bg-sky-300"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 text-slate-700">
            <p><span className="font-semibold text-sky-700">Name:</span> {profile.name}</p>
            <p><span className="font-semibold text-sky-700">Email:</span> {profile.email}</p>
            <p><span className="font-semibold text-sky-700">Role:</span> {profile.role}</p>
            <p>
              <span className="font-semibold text-sky-700">Experience:</span> 
              {profile.experience != null
                ? ` ${profile.experience} ${profile.experience === 1 ? "year" : "years"}`
                : " —"}
            </p>
            <p>
              <span className="font-semibold text-sky-700">Skills:</span>{" "}
              {profile.skills.length > 0 ? profile.skills.join(", ") : "—"}
            </p>
            <p>
              <span className="font-semibold text-sky-700">Resume:</span>{" "}
              {profile.resume ? (
                <a
                  href={`http://localhost:5000/${profile.resume}`}
                  target="_blank"
                  className="underline text-sky-600"
                >
                  View / Download
                </a>
              ) : "—"}
            </p>

            <button
              onClick={() => setEditMode(true)}
              className="w-full px-5 py-2 mt-4 text-white rounded-lg bg-sky-500 hover:bg-sky-600"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
