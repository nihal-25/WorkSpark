import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ import navigation hook
import API from "../pages/api";

export default function Signup() {
  const navigate = useNavigate(); // ✅ initialize navigate
  const [formData, setFormData] = useState({
    name: "",
    role: "",    // recruiter or jobseeker
    age: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/signup", formData);
      alert("✅ Signup successful! Redirecting to login...");
      console.log(res.data);

      // ✅ redirect to login page
      navigate("/login");

    } catch (err) {
      if (err.response) {
        console.error("Error response:", err.response.data);
        alert(`Signup failed: ${err.response.data.message || JSON.stringify(err.response.data)}`);
      } else if (err.request) {
        console.error("No response from server:", err.request);
        alert("Signup failed: No response from server");
      } else {
        console.error("Error:", err.message);
        alert("Signup failed: " + err.message);
      }
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="mb-4 text-xl font-bold">User Signup</h2>
      <form onSubmit={handleSubmit} className="flex flex-col w-64 gap-3">
        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <select
          name="role"
          onChange={handleChange}
          className="p-2 border rounded"
        >
          <option value="">Select Role</option>
          <option value="jobseeker">Job Seeker</option>
          <option value="recruiter">Recruiter</option>
        </select>
        <input
          type="number"
          name="age"
          placeholder="Age"
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <button type="submit" className="p-2 border rounded">
          Signup
        </button>
      </form>
    </div>
  );
}
